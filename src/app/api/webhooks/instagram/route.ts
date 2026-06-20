import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// GET: Verificación del Hub Challenge de Meta
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
    // Retornar el challenge como plain text
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// POST: Recepción de eventos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.object === "instagram") {
      // Procesar en background sin bloquear la respuesta a Meta
      // Meta requiere un 200 OK en menos de 20 segundos
      processInstagramEvent(body).catch(console.error);
      
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    }

    return new NextResponse("Not Found", { status: 404 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

async function processInstagramEvent(body: any) {
  const supabase = createServiceClient();

  // Recorrer el payload (puede traer multiples entrys/changes)
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      // Nos interesa cuando hay menciones y viene una media
      if (change.field === "mentions" || change.field === "comments") {
        const mediaId = change.value?.media?.id;
        if (!mediaId) continue;

        // 1. Obtener la URL de la imagen vía Graph API
        const mediaUrl = await fetchMediaUrl(mediaId);
        if (!mediaUrl) continue;

        // 2. Descargar la imagen
        const imageRes = await fetch(mediaUrl);
        if (!imageRes.ok) continue;
        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Opcional: Podríamos pasarla por moderateImage(buffer) aquí también

        // 3. Subir a Supabase Storage
        const filePath = `ig-${Date.now()}-${mediaId}.jpg`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from("pergola-photos")
          .upload(filePath, buffer, {
            contentType: "image/jpeg",
          });

        if (storageError) continue;

        // 4. Obtener URL pública y Guardar en DB
        const { data: publicUrlData } = supabase.storage
          .from("pergola-photos")
          .getPublicUrl(filePath);

        const userName = change.value?.from?.username || "Usuario de IG";

        await supabase.from("photos").insert([
          {
            image_url: publicUrlData.publicUrl,
            user_name: userName,
            source: "instagram",
            is_approved: true, // Asumimos que lo de IG es público y "seguro" o requiere moderación posterior
          },
        ]);
      }
    }
  }
}

async function fetchMediaUrl(mediaId: string): Promise<string | null> {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken) return null;

    const url = `https://graph.facebook.com/v19.0/${mediaId}?fields=media_url&access_token=${accessToken}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.media_url || null;
  } catch (err) {
    console.error("Error fetching media URL:", err);
    return null;
  }
}
