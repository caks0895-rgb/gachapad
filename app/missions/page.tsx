import { FooterNote } from "@/components/FooterNote";
import { Header } from "@/components/Header";
import { MISSIONS } from "@/lib/missions";

export default function MissionsPage() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage">Activity</p>
        <h1 className="mt-2 font-serif text-4xl">Missions</h1>
        <p className="mt-3 max-w-xl text-sm text-ink/70">
          Swap volume is the main mint. Check-in and missions are extras. Points cannot be transferred.
        </p>
        <section className="mt-8 border-t border-rule">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-serif text-2xl">Daily check-in</p>
              <p className="mt-1 text-sm text-ink/65">15 points, plus 5 per streak day, cap 40.</p>
            </div>
            <button type="button" className="border border-ink px-4 py-2 text-sm" disabled>
              Connect to stamp
            </button>
          </div>
        </section>
        <ol className="divide-y divide-rule border-t border-rule">
          {MISSIONS.map((m) => (
            <li key={m.id} className="flex items-baseline justify-between gap-6 py-4">
              <div>
                <p className="font-serif text-xl">{m.title}</p>
                <p className="mt-1 text-sm text-ink/65">{m.detail}</p>
              </div>
              <p className="shrink-0 font-mono text-sm">{m.points} PAD</p>
            </li>
          ))}
        </ol>
      </main>
      <FooterNote />
    </div>
  );
}
