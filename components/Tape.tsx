import { PRIZE_STOCKS } from "@/lib/tokens";

export function Tape() {
  const line = [
    "NVDAc 226.59",
    "AAPLc 326.32",
    "METAc 605.97",
    "GOOGLc 340.58",
    "desk fee 0.50%",
    "vault 80 / treasury 15 / refer 5",
    "prize names with live LP only",
    ...PRIZE_STOCKS.map((s) => `${s.ticker} · ${s.underlying}`),
  ].join("     ·     ");

  return (
    <div className="tape bg-mist py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70">
      <div className="tape-track">
        <span>{line}</span>
        <span aria-hidden>     ·     {line}</span>
      </div>
    </div>
  );
}
