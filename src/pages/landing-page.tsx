import { Link } from "react-router";

const features = [
  {
    title: "Milestone escrow",
    description: "Split deals into milestones and release funds only when deliverables are approved.",
  },
  {
    title: "Dispute coverage",
    description: "Escalate edge-cases with a structured trail and admin mediation workflows.",
  },
  {
    title: "Identity + KYC",
    description: "Onboard buyers and sellers with verification gates that reduce payment risk.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#060714] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(86,125,255,0.32),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(31,207,178,0.22),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(165,111,255,0.18),transparent_35%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 py-8 md:py-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600" />
            <span className="font-semibold tracking-wide text-lg">PayGuard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/80 hover:text-white transition-colors">Log in</Link>
            <Link to="/register" className="px-4 py-2 rounded-full bg-white text-[#0B1025] text-sm font-semibold hover:bg-white/90 transition-colors">Get started</Link>
          </div>
        </header>

        <section className="pt-18 md:pt-28 text-center">
          <p className="inline-flex px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs tracking-[0.2em] uppercase text-white/80">Smart escrow infrastructure</p>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
            Close digital deals
            <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">without trust gaps.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-white/70 leading-relaxed">
            PayGuard protects buyers and sellers with secure fund holding, staged releases, and dispute resolution in one modern workspace.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="px-6 py-3 rounded-full bg-primary-500 text-white font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-400 transition-all">
              Start free
            </Link>
            <Link to="/login" className="px-6 py-3 rounded-full border border-white/20 bg-white/5 text-white/90 font-semibold hover:bg-white/10 transition-all">
              Open dashboard
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mt-20 md:mt-24 pb-8">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-sm p-6">
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
