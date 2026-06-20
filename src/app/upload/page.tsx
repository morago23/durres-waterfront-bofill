import Link from "next/link";
import UploadForm from "@/components/UploadForm";
import { ArrowLeft } from "lucide-react";

export default function UploadPage() {
  return (
    <main className="flex-1 flex flex-col items-center p-6 sm:p-12 relative overflow-hidden min-h-screen">
      <header className="w-full max-w-md mb-8 relative z-10 flex items-center justify-between">
        <Link 
          href="/"
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <span className="text-xs text-white/40 uppercase tracking-widest">Bofill Pergola</span>
      </header>

      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-8 animate-in">
          <h1 className="text-3xl font-bold tracking-wider mb-2">Capture the Moment</h1>
          <p className="text-white/60 font-light">Upload your photo and be part of the Durrës Waterfront mosaic.</p>
        </div>

        <UploadForm />
      </div>
    </main>
  );
}
