import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex-1 flex flex-col p-6 sm:p-12 relative overflow-y-auto w-full max-w-3xl mx-auto">
      <div className="w-full flex items-center mb-12 animate-in">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      <article className="space-y-12 animate-in delay-100">
        <header className="space-y-6">
          <h1 className="text-3xl sm:text-5xl font-black tracking-[0.1em] text-white uppercase leading-tight">
            The History of Durrës Waterfront
          </h1>
          <div className="h-px w-24 bg-white/20" />
        </header>

        <section className="space-y-6 text-white/70 font-light leading-relaxed">
          <p className="text-lg text-white">
            Designed by the renowned Ricardo Bofill Taller de Arquitectura (RBTA), the Durrës Waterfront is a monumental public space situated on the Adriatic coast of Albania.
          </p>
          <p>
            The centerpiece of this masterplan is the iconic continuous Pergola, an architectural gesture that serves as a grand promenade. It acts as a thread stitching the urban fabric of Durrës directly to the sea, redefining the city's relationship with the water.
          </p>
          <p>
            Characterized by its classical yet fiercely modern geometry, the structure provides shade, frames the horizon, and offers a stage for public life. It is not merely a path, but a destination in itself—a place where architecture, nature, and community seamlessly converge into a single, breathtaking experience.
          </p>
        </section>

        <section className="pt-8 border-t border-white/10">
          <h2 className="text-sm font-bold tracking-widest uppercase text-white/50 mb-6">Visual Axes & Form</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-white/70 font-light text-sm leading-relaxed">
            <div>
              <p>
                The rhythmic sequence of columns and archways creates infinite visual axes. This repetition is a signature RBTA element, echoing ancient Mediterranean public squares while utilizing modern materials and stark contrasts.
              </p>
            </div>
            <div>
              <p>
                Whether viewed at the bright peak of the day or illuminated against the pitch-black night, the waterfront transforms constantly, making it a living canvas for those who walk its length.
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
