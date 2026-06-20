import Image from "next/image";

type PhotoProps = {
  id: string;
  imageUrl: string;
  userName: string;
  source: string;
  createdAt: string;
};

export default function PhotoCard({ photo }: { photo: PhotoProps }) {
  const isInstagram = photo.source === "instagram";
  const date = new Date(photo.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group relative aspect-square bg-white/5 rounded-xl overflow-hidden animate-in">
      <img
        src={photo.imageUrl}
        alt={`Photo by ${photo.userName}`}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Info (visible on hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white shadow-sm truncate pr-2">
            {photo.userName}
          </span>
          {isInstagram ? (
            <span className="text-pink-500 bg-white/10 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold shrink-0">
              IG
            </span>
          ) : (
            <span className="text-white/60 bg-white/10 backdrop-blur px-2 py-0.5 rounded-full text-xs shrink-0">
              Web
            </span>
          )}
        </div>
        <span className="text-white/60 text-xs mt-1">{date}</span>
      </div>
    </div>
  );
}
