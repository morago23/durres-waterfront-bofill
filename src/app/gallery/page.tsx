import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Script from "next/script";

export default function GalleryPage() {
  return (
    <main className="min-h-screen flex flex-col p-6 sm:p-12 relative overflow-hidden">
      <header className="w-full max-w-7xl mx-auto mb-12 flex items-center justify-between relative z-10 animate-in">
        <div>
          <h1 className="text-3xl font-black tracking-[0.2em] uppercase mb-1 text-white">
            Instagram Feed
          </h1>
          <p className="text-white/60 font-light uppercase tracking-widest text-xs">
            @taulantiapromenade
          </p>
        </div>
        <Link 
          href="/"
          className="h-12 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-colors text-sm font-bold uppercase tracking-widest gap-2 text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto animate-in delay-100">
        <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
        <div className="elfsight-app-bae913af-1da8-457d-a485-6833c8f5ed79" data-elfsight-app-lazy></div>
      </div>
    </main>
  );
}
