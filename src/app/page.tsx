import Link from "next/link";
import { Camera, ExternalLink } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-12">
        {/* Header / Logo */}
        <header className="space-y-4 animate-in mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-[0.2em] uppercase text-white">
            Durrës<br />Waterfront
          </h1>
          <div className="h-px w-24 bg-white/30 mx-auto" />
        </header>

        {/* Action Buttons */}
        <div className="w-full animate-in delay-100">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-white font-medium text-lg tracking-wide uppercase">Join the public mosaic</h2>
            <p className="text-sm text-white/60 font-light">
              Upload a Story and tag <span className="text-white font-medium">@taulantiapromenade</span>
            </p>
          </div>

          <a
            href="https://www.instagram.com/taulantiapromenade/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-full min-h-[60px] bg-white hover:bg-gray-200 text-black rounded-xl transition-colors duration-300 mb-6"
          >
            <span className="text-sm font-bold tracking-widest uppercase flex items-center gap-3">
              <ExternalLink className="w-5 h-5" /> Open Instagram
            </span>
          </a>

          <div className="relative py-2 flex items-center mb-6">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink-0 mx-4 text-white/40 text-xs uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          <Link
            href="/upload"
            className="group flex items-center justify-center w-full min-h-[60px] border border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-md rounded-xl transition-colors duration-300"
          >
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-3 text-white/80 group-hover:text-white">
              <Camera className="w-4 h-4" /> Upload manually
            </span>
          </Link>
        </div>

        {/* Footer links */}
        <div className="pt-8 flex flex-col items-center gap-6 animate-in delay-200">
          <Link 
            href="/promotions"
            className="group flex items-center gap-2 border-b border-transparent hover:border-white/40 pb-1 transition-all duration-300"
          >
            <span className="text-white/60 group-hover:text-white text-xs font-bold tracking-widest uppercase">
              Local Offers & Giveaways
            </span>
          </Link>
          
          <Link 
            href="/gallery"
            className="text-white/40 hover:text-white text-xs font-light tracking-widest uppercase transition-colors"
          >
            View Public Gallery
          </Link>

          <Link 
            href="/about"
            className="group flex items-center gap-2 border-b border-transparent hover:border-white/40 pb-1 transition-all duration-300 mt-4"
          >
            <span className="text-white/40 group-hover:text-white text-xs font-bold tracking-widest uppercase">
              About the Project
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
