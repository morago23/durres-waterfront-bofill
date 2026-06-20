import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Cargar .env.local (este script correría como un cron task en Vercel, o un worker de Node)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TILE_SIZE = 40; // Tamaño de cada celda del mosaico (ej: 40x40 píxeles)

async function getAverageColor(buffer: Buffer) {
  const { data, info } = await sharp(buffer)
    .resize(TILE_SIZE, TILE_SIZE, { fit: "cover" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let r = 0, g = 0, b = 0;
  const pixelCount = info.width * info.height;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  return {
    r: Math.round(r / pixelCount),
    g: Math.round(g / pixelCount),
    b: Math.round(b / pixelCount),
  };
}

function findClosestTile(targetColor: { r: number; g: number; b: number }, tiles: any[]) {
  let minDist = Infinity;
  let bestTile = tiles[0];

  for (const tile of tiles) {
    const dist = Math.sqrt(
      Math.pow(targetColor.r - tile.color.r, 2) +
      Math.pow(targetColor.g - tile.color.g, 2) +
      Math.pow(targetColor.b - tile.color.b, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      bestTile = tile;
    }
  }

  return bestTile;
}

export async function generateMosaic() {
  console.log("Iniciando generación de mosaico...");

  // 1. Obtener URLs de fotos desde BD
  const { data: photos, error } = await supabase
    .from("photos")
    .select("image_url")
    .limit(500); // Tomamos una muestra reciente o todas

  if (error || !photos || photos.length === 0) {
    console.error("No hay suficientes fotos para crear el mosaico.");
    return;
  }

  console.log(`Descargando y procesando ${photos.length} fotos...`);
  
  // 2. Procesar fotos (descargar y calcular color promedio)
  const tiles = [];
  for (const photo of photos) {
    try {
      const res = await fetch(photo.image_url);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const color = await getAverageColor(buffer);
      const resizedBuffer = await sharp(buffer)
        .resize(TILE_SIZE, TILE_SIZE, { fit: "cover" })
        .toBuffer();

      tiles.push({ color, buffer: resizedBuffer });
    } catch (err) {
      console.warn("Fallo procesando foto:", photo.image_url);
    }
  }

  if (tiles.length === 0) return;

  // 3. Cargar la imagen silueta base
  const silhouettePath = path.resolve(process.cwd(), "public/pergola-silhouette.jpg");
  if (!fs.existsSync(silhouettePath)) {
    console.error("Falta archivo silueta en", silhouettePath);
    return;
  }

  const targetMeta = await sharp(silhouettePath).metadata();
  if (!targetMeta.width || !targetMeta.height) return;

  const cols = Math.floor(targetMeta.width / TILE_SIZE);
  const rows = Math.floor(targetMeta.height / TILE_SIZE);
  const mosaicWidth = cols * TILE_SIZE;
  const mosaicHeight = rows * TILE_SIZE;

  console.log(`Generando grid de ${cols}x${rows}...`);

  const compositeOps = [];

  // 4. Analizar celda por celda de la silueta y mapear fotos
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const region = await sharp(silhouettePath)
        .extract({
          left: col * TILE_SIZE,
          top: row * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE,
        })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      let r = 0, g = 0, b = 0;
      const px = region.info.width * region.info.height;
      for (let i = 0; i < region.data.length; i += 4) {
        r += region.data[i];
        g += region.data[i + 1];
        b += region.data[i + 2];
      }
      
      const avgColor = {
        r: Math.round(r / px),
        g: Math.round(g / px),
        b: Math.round(b / px),
      };

      const bestTile = findClosestTile(avgColor, tiles);

      // Si queremos un efecto más sutil, podríamos mezclar (blend) la foto con la silueta original.
      // Aquí usamos la foto completa.
      compositeOps.push({
        input: bestTile.buffer,
        top: row * TILE_SIZE,
        left: col * TILE_SIZE,
      });
    }
  }

  console.log("Componiendo imagen final...");

  // 5. Crear la imagen final
  const outputBuffer = await sharp({
    create: {
      width: mosaicWidth,
      height: mosaicHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite(compositeOps)
    .jpeg({ quality: 90 })
    .toBuffer();

  // 6. Subir a Supabase Storage (sobrescribiendo el anterior o guardando uno nuevo por día)
  const fileName = `mosaic-${new Date().toISOString().split('T')[0]}.jpg`;
  
  const { data: storageData, error: storageError } = await supabase.storage
    .from("pergola-photos")
    .upload(`mosaics/${fileName}`, outputBuffer, {
      contentType: "image/jpeg",
      upsert: true
    });

  if (storageError) {
    console.error("Error subiendo mosaico final:", storageError);
  } else {
    console.log(`✅ Mosaico finalizado y subido: mosaics/${fileName}`);
  }
}

// Ejecutar si se llama directamente (ej: `ts-node scripts/generate-mosaic.ts`)
if (require.main === module) {
  generateMosaic().catch(console.error);
}
