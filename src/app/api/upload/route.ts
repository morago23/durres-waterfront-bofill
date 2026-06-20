import { NextRequest, NextResponse } from "next/server";
import { moderateImage } from "@/lib/moderateImage";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const userName = (formData.get("userName") as string) || "Anónimo";

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó imagen" }, { status: 400 });
    }

    // Validación básica de tipo de archivo (aunque el cliente ya manda WebP)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo no es una imagen válida" }, { status: 400 });
    }

    // Convertir a Buffer para la API de Cloud Vision
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Moderación con Google Cloud Vision
    const moderation = await moderateImage(buffer);
    if (!moderation.isAllowed) {
      return NextResponse.json(
        { error: moderation.reason || "La imagen ha sido bloqueada por nuestras políticas de seguridad." },
        { status: 403 }
      );
    }

    // 2. Subida a Supabase Storage
    const supabase = createServiceClient();
    
    // Generar un nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'webp';
    const filePath = `${timestamp}-${randomString}.${extension}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from("pergola-photos")
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
      });

    if (storageError) {
      console.error("Error subiendo a Storage:", storageError);
      return NextResponse.json({ error: "Error al guardar la imagen" }, { status: 500 });
    }

    // 3. Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from("pergola-photos")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // 4. Guardar en Base de Datos
    const { error: dbError } = await supabase
      .from("photos")
      .insert([
        {
          image_url: publicUrl,
          user_name: userName,
          source: "web",
          is_approved: true, // Ya pasó moderación
        },
      ]);

    if (dbError) {
      console.error("Error guardando en BD:", dbError);
      // Opcional: Podríamos borrar la imagen de Storage si falla la inserción en BD
      return NextResponse.json({ error: "Error al registrar la imagen" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: publicUrl }, { status: 201 });

  } catch (error) {
    console.error("Error inesperado en upload:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
