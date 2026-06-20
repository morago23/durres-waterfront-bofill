import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("dummy")) {
  console.error("❌ Faltan las variables de entorno reales de Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function drawWinner() {
  console.log("🎁 Preparando sorteo aleatorio de Durrës Waterfront...");
  
  // Opcional: podrías filtrar por fecha (ej: últimas 2 semanas)
  // const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString();
  
  const { data: photos, error } = await supabase
    .from("photos")
    .select("id, user_name, source, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error al obtener los participantes:", error.message);
    return;
  }

  if (!photos || photos.length === 0) {
    console.log("⚠️ No hay participantes todavía.");
    return;
  }

  // Filtrar anónimos que no dejaron contacto (opcional)
  const validParticipants = photos.filter(p => p.user_name && p.user_name.trim() !== "" && p.user_name !== "Anónimo");

  if (validParticipants.length === 0) {
    console.log("⚠️ No hay participantes válidos con información de contacto.");
    return;
  }

  console.log(`📊 Total de participaciones válidas: ${validParticipants.length}`);
  
  // Matemática pura para sorteo aleatorio
  const randomIndex = Math.floor(Math.random() * validParticipants.length);
  const winner = validParticipants[randomIndex];

  console.log("\n🎉 ¡TENEMOS UN GANADOR! 🎉");
  console.log("===============================");
  console.log(`🏆 ID de la foto: ${winner.id}`);
  console.log(`👤 Contacto / Instagram: ${winner.user_name}`);
  console.log(`📱 Origen: ${winner.source.toUpperCase()}`);
  console.log(`📅 Fecha de subida: ${new Date(winner.created_at).toLocaleString()}`);
  console.log("===============================\n");
  console.log("Siguiente paso: Ve a Instagram o tu correo y contacta con el ganador para darle su premio.");
}

drawWinner();
