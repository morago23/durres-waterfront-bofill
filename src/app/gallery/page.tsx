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
      <header className="w-full max-w-7xl mx-auto mb-10 relative z-10 flex items-center justify-between animate-in">
        <Link 
          href="/"
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <span className="text-xs text-white/40 uppercase tracking-widest border border-white/20 px-3 py-1">Photos</span>
      </header>

      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-in delay-100">
          <h1 className="text-4xl md:text-5xl font-black tracking-wider mb-4 text-white uppercase">
            Public Gallery
          </h1>
          <div className="h-px w-24 bg-white/30 mx-auto mb-6" />
          <p className="text-white/70 font-light max-w-2xl mx-auto text-lg">
            Durrës Waterfront Construction & Views
          </p>
        </div>

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
