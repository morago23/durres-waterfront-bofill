import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const photos = [
  { id: 1, src: "/gallery/photo1.jpg", alt: "Durrës Waterfront Pergola View 1" },
  { id: 2, src: "/gallery/photo2.jpg", alt: "Durrës Waterfront Pergola View 2" },
  { id: 3, src: "/gallery/photo3.png", alt: "Durrës Waterfront Pergola View 3" },
  { id: 4, src: "/gallery/photo4.jpg", alt: "Durrës Waterfront Pergola View 4" },
  { id: 5, src: "/gallery/photo5.png", alt: "Durrës Waterfront Pergola View 5" },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen flex flex-col p-6 sm:p-12 relative">
      <header className="w-full max-w-7xl mx-auto mb-12 flex items-center justify-between relative z-10 animate-in">
        <div>
          <h1 className="text-3xl font-black tracking-[0.2em] uppercase mb-1 text-white">
            Public Gallery
          </h1>
          <p className="text-white/60 font-light uppercase tracking-widest text-xs">
            Durrës Waterfront Construction & Views
          </p>
        </div>
        <Link 
          href="/"
          className="h-12 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-colors text-sm font-bold uppercase tracking-widest gap-2 text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto">
        {/* Masonry Layout via CSS Columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo, index) => (
            <div 
              key={photo.id}
              className="relative overflow-hidden rounded-xl break-inside-avoid shadow-2xl bg-white/5 border border-white/10 group animate-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Image 
                src={photo.src}
                alt={photo.alt}
                width={800}
                height={800}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-medium tracking-wider text-sm uppercase">
                  View {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
