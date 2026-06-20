"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, X } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    setError(null);
    setIsCompressing(true);

    try {
      // 1. Quick preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      // 2. Aggressive client-side compression
      const compressedFile = await compressImage(selectedFile);
      setFile(compressedFile);
    } catch (err) {
      console.error("Error compressing image", err);
      setError("An error occurred while processing the image.");
    } finally {
      setIsCompressing(false);
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          
          // Strict 800px limit
          const MAX_WIDTH = 800;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("No canvas context");
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // WebP format at 60% quality
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject("Error converting to blob");
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: "image/webp",
              });
              resolve(newFile);
            },
            "image/webp",
            0.6
          );
        };
        img.onerror = (e) => reject(e);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    if (userName.trim()) {
      formData.append("userName", userName.trim());
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error uploading the image");
      }

      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/gallery");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Connection error");
      setIsUploading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6 animate-in">
        <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold tracking-wider text-center">Photo uploaded!</h2>
        <p className="text-white/60 text-center">Redirecting to public gallery...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      {/* Upload Button or Preview */}
      {!previewUrl ? (
        <label className="relative w-full aspect-[4/5] border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all animate-in">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Camera className="w-10 h-10 mb-4 text-white/80" />
          <span className="text-lg font-medium text-white/80">Open Camera or Gallery</span>
          <span className="text-sm text-white/40 mt-2">Max ~200KB after compression</span>
        </label>
      ) : (
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden animate-in">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(null);
              setFile(null);
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Optional User Data */}
      <div className="space-y-4 animate-in delay-100">
        <div className="space-y-2">
          <label htmlFor="userName" className="text-sm font-medium text-white/60 uppercase tracking-widest flex items-center justify-between">
            <span>Your Instagram or Email</span>
            <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full">Giveaways</span>
          </label>
          <input
            id="userName"
            type="text"
            maxLength={50}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="@username or email (optional)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {isCompressing && (
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-sm text-center">
            Optimizing image for the web...
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isUploading || isCompressing}
          className="w-full min-h-[60px] bg-white text-black hover:bg-gray-200 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed font-bold rounded-xl transition-colors uppercase tracking-widest text-sm flex items-center justify-center"
        >
          {isUploading ? "Uploading..." : "Send to Pergola"}
        </button>
      </div>
    </form>
  );
}
