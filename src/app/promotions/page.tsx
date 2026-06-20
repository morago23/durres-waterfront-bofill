import Link from "next/link";
import { ArrowLeft, ExternalLink, Ticket } from "lucide-react";

export default function PromotionsPage() {
  // Mock data for the client demo
  const mockPromotions = [
    {
      id: "1",
      sponsor_name: "La Piazza Ristorante",
      title: "Romantic Dinner for Two",
      description: "Experience the authentic taste of Italy. Win a full-course dinner overlooking the Adriatic sea, including our signature wine selection.",
      image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop",
      link: "https://example.com/lapiazza",
      end_date: new Date(Date.now() + 7 * 86400000).toISOString(),
    },
    {
      id: "2",
      sponsor_name: "Sunset Lounge",
      title: "VIP Cocktail Experience",
      description: "Enjoy an exclusive evening. Win a VIP table at sunset with complimentary signature cocktails for you and 3 friends.",
      image_url: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop",
      link: "https://example.com/sunset",
      end_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    },
    {
      id: "3",
      sponsor_name: "Durrës Artisan Gelateria",
      title: "One Month of Free Gelato",
      description: "Cool down your summer walks along the Bofill Pergola. Win a voucher for 30 premium artisanal gelatos.",
      image_url: "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?q=80&w=800&auto=format&fit=crop",
      link: "https://example.com/gelateria",
      end_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    }
  ];

  return (
    <main className="min-h-screen flex flex-col p-6 sm:p-12 relative overflow-hidden">
      <header className="w-full max-w-4xl mx-auto mb-10 relative z-10 flex items-center justify-between animate-in">
        <Link 
          href="/"
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <span className="text-xs text-white/40 uppercase tracking-widest border border-white/20 px-3 py-1">Giveaways</span>
      </header>

      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-in delay-100">
          <h1 className="text-4xl md:text-5xl font-black tracking-wider mb-4 text-white uppercase">
            Local Offers
          </h1>
          <div className="h-px w-24 bg-white/30 mx-auto mb-6" />
          <p className="text-white/70 font-light max-w-2xl mx-auto text-lg">
            Upload your photo to the public mosaic via Instagram or our web form and you'll automatically enter the weekly draws sponsored by local businesses!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPromotions.map((promo, i) => {
            const daysLeft = Math.ceil((new Date(promo.end_date).getTime() - Date.now()) / 86400000);
            return (
              <div 
                key={promo.id} 
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 animate-in group flex flex-col"
                style={{ animationDelay: `${(i + 2) * 100}ms` }}
              >
                <div className="h-48 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img 
                    src={promo.image_url} 
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-black/80 px-3 py-1.5 border border-white/20 flex items-center gap-2">
                    <Ticket className="w-3.5 h-3.5 text-white/70" />
                    <span className="text-xs font-bold text-white/70 tracking-widest uppercase">{daysLeft} days left</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                    {promo.sponsor_name}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{promo.title}</h3>
                  <p className="text-sm text-white/60 font-light leading-relaxed flex-1 mb-6">
                    {promo.description}
                  </p>
                  
                  <a 
                    href={promo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 text-xs font-medium uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to participate */}
        <div className="mt-16 text-center animate-in delay-300">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[60px] px-8 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-colors uppercase tracking-widest text-sm"
          >
            Participate Now
          </Link>
        </div>
      </div>
    </main>
  );
}
