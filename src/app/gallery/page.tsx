import { createClient } from "@/lib/supabase/server";
import PhotoCard from "@/components/PhotoCard";
import Link from "next/link";
import { ArrowLeft, Grip } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function GalleryPage() {
  let photos: any[] = [];
  let error = null;

  // Si no tenemos URL real de Supabase, usamos datos de prueba para la previsualización
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    photos = Array(12).fill(null).map((_, i) => ({
      id: `mock-${i}`,
      image_url: "/pergola-silhouette.jpg", // Usando la foto brutalista de fondo como ejemplo
      user_name: i % 3 === 0 ? "Bofill Fan" : `User ${i + 1}`,
      source: i % 4 === 0 ? "instagram" : "web",
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
    }));
  } else {
    const supabase = await createClient();
    const { data, error: supaError } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
      
    photos = data || [];
    error = supaError;
  }

  return (
    <main className="min-h-screen flex flex-col p-6 sm:p-12 relative">
      <header className="w-full max-w-7xl mx-auto mb-12 flex items-center justify-between relative z-10 animate-in">
        <div>
          <h1 className="text-3xl font-bold tracking-widest uppercase mb-1">Public Mosaic</h1>
          <p className="text-white/60 font-light">
            {photos?.length || 0} participations at Durrës Waterfront.
          </p>
        </div>
        <Link 
          href="/"
          className="h-12 px-6 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center transition-colors text-sm font-bold uppercase tracking-widest gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </header>

      {error ? (
        <div className="flex-1 flex items-center justify-center text-red-400">
          Error loading gallery.
        </div>
      ) : !photos || photos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white/40 space-y-4 animate-in">
          <Grip className="w-12 h-12 opacity-50" />
          <p>No photos yet. Be the first to participate!</p>
          <Link href="/upload" className="text-accent hover:underline">Upload a photo</Link>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {photos.map((photo, index) => (
            <div 
              key={photo.id} 
              className={`animate-in`}
              style={{ animationDelay: `${(index % 10) * 50}ms` }}
            >
              <PhotoCard 
                photo={{
                  id: photo.id,
                  imageUrl: photo.image_url,
                  userName: photo.user_name,
                  source: photo.source,
                  createdAt: photo.created_at,
                }} 
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
