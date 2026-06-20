import vision from "@google-cloud/vision";

// Instanciar el cliente usando las credenciales del entorno
// Requiere GOOGLE_CLOUD_API_KEY o GOOGLE_APPLICATION_CREDENTIALS
const client = new vision.ImageAnnotatorClient();

const NSFW_CATEGORIES = ["adult", "violence", "racy"];
// Categorías que bloquean automáticamente
const BLOCKED_LEVELS = ["LIKELY", "VERY_LIKELY"];

export async function moderateImage(imageBuffer: Buffer): Promise<{ isAllowed: boolean; reason?: string }> {
  try {
    const [result] = await client.safeSearchDetection({
      image: { content: imageBuffer },
    });

    const detections = result.safeSearchAnnotation;
    if (!detections) {
      // Si no hay resultados de SafeSearch, por precaución permitimos o bloqueamos según política.
      // Aquí permitimos asumiendo que la API no detectó nada raro.
      return { isAllowed: true };
    }

    for (const category of NSFW_CATEGORIES) {
      const likelihood = detections[category as keyof typeof detections];
      if (typeof likelihood === 'string' && BLOCKED_LEVELS.includes(likelihood)) {
        return { 
          isAllowed: false, 
          reason: `Contenido inapropiado detectado (${category}: ${likelihood})` 
        };
      }
    }

    return { isAllowed: true };
  } catch (error) {
    console.error("Error en SafeSearch:", error);
    // En caso de fallo de la API (ej: límite de cuota), puedes decidir si "fail-open" o "fail-closed"
    // Fail-open (permitir) para no bloquear usuarios si la API cae:
    return { isAllowed: true, reason: "Error en API de moderación" };
  }
}
