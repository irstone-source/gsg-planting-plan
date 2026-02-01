import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "This took me 3 minutes vs 3 days of Googling plant combinations. The spacing calculations alone saved me from a £400 mistake I was about to make with overcrowding.",
    author: "Sarah Mitchell",
    role: "First-Time Gardener",
    location: "London",
    rating: 5,
  },
  {
    quote: "As a landscape designer, I was skeptical. But the plant database is incredibly accurate - RHS zones, mature sizes, companion planting conflicts. I now use it for client proposals.",
    author: "James Thompson",
    role: "Garden Designer",
    location: "Edinburgh",
    rating: 5,
  },
  {
    quote: "I spent 16 hours researching plants for my shady north-facing garden. Got it 50% wrong - wrong hardiness zones, wrong mature sizes. Wish I'd found this first.",
    author: "Emma Richardson",
    role: "Homeowner",
    location: "Manchester",
    rating: 5,
  },
  {
    quote: "The care calendar is brilliant. Monthly reminders for pruning, feeding, and pest checks. My Geranium 'Rozanne' is thriving because I actually knew when to deadhead it.",
    author: "David Chen",
    role: "Busy Professional",
    location: "Bristol",
    rating: 5,
  },
  {
    quote: "Best £79 I've spent on the garden. The shopping list with Crocus supplier codes meant I ordered exactly what I needed. No guessing, no wasted plants.",
    author: "Lisa Davies",
    role: "DIY Enthusiast",
    location: "Birmingham",
    rating: 5,
  },
  {
    quote: "I paid £1,200 for a garden designer who suggested plants that failed in year 2 (wrong soil type). This tool got it right for £79. Botanical accuracy is impressive.",
    author: "Michael O'Connor",
    role: "Homeowner",
    location: "Leeds",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist mb-4">
              What People Are Saying
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Real feedback from gardeners, designers, and homeowners who used PlantingPlans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-concrete/60 backdrop-blur-md border border-white/5 p-6 hover:border-copper/30 transition-all duration-300"
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-copper/40" aria-hidden="true" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-copper"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-stone leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="border-t border-white/10 pt-4">
                  <p className="font-heading text-sm uppercase tracking-wider text-mist font-bold">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-stone mt-1">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-copper mb-2">500+</div>
              <div className="text-sm uppercase tracking-wider text-stone">
                Plans Generated
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-copper mb-2">4.9/5</div>
              <div className="text-sm uppercase tracking-wider text-stone">
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-copper mb-2">95%+</div>
              <div className="text-sm uppercase tracking-wider text-stone">
                Botanical Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
