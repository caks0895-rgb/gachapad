"use client";

import { useMemo, useState } from "react";
import { PRIZE_STOCKS, envelopeUsd, expectedLuck } from "@/lib/tokens";
import { isConfigured } from "@/lib/contracts";

const DEMO_INV = [
  { ticker: "NVDAc", usd: 1840 },
  { ticker: "AAPLc", usd: 1210 },
  { ticker: "METAc", usd: 960 },
  { ticker: "GOOGLc", usd: 1340 },
];

export function VaultRail() {
  const [burn, setBurn] = useState("200");
  const [slip, setSlip] = useState<string | null>(null);
  const configured = isConfigured();
  const pts = Number(burn) || 0;
  const env = envelopeUsd(pts);
  const ev = env * expectedLuck();
  const total = DEMO_INV.reduce((s, i) => s + i.usd, 0);

  const preview = useMemo(() => {
    if (pts <= 0) return null;
    return `Envelope ~$${env.toFixed(2)} before luck. Expected ~$${ev.toFixed(2)}.`;
  }, [env, ev, pts]);

  function demoPull() {
    const names = PRIZE_STOCKS.map((s) => s.ticker);
    const pick = names[Math.floor(Math.random() * names.length)];
    const lucks = [0.35, 0.7, 1, 1.6, 3];
    const luck = lucks[Math.floor(Math.random() * lucks.length)];
    setSlip(`${pick}  ·  $${(env * luck).toFixed(2)}  ·  ${luck.toFixed(2)}x`);
  }

  return (
    <section className="border border-rule bg-paper">
      <div className="flex items-baseline justify-between border-b border-rule px-5 py-3">
        <h2 className="font-serif text-2xl">Vault</h2>
        <p className="font-mono text-xs uppercase tracking-wider text-ink/50">
          ${total.toLocaleString()} demo
        </p>
      </div>
      <ul className="divide-y divide-rule">
        {DEMO_INV.map((row) => (
          <li key={row.ticker} className="flex items-center justify-between px-5 py-3">
            <span className="font-mono text-sm">{row.ticker}</span>
            <span className="font-mono text-sm text-ink/70">${row.usd.toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <div className="space-y-4 border-t border-rule px-5 py-5">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">Burn points</span>
          <input
            value={burn}
            onChange={(e) => setBurn(e.target.value.replace(/[^0-9]/g, ""))}
            className="mt-1 w-full border-b border-ink/20 bg-transparent py-1 font-serif text-3xl outline-none"
          />
        </label>
        {preview ? <p className="text-sm text-ink/65">{preview}</p> : null}
        <button
          type="button"
          onClick={demoPull}
          className="w-full border border-oxblood bg-oxblood py-3 text-sm text-paper"
        >
          {configured ? "Pull slip" : "Preview pull"}
        </button>
        {slip ? (
          <div className="slip-in border border-rule bg-mist px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink/50">Result slip</p>
            <p className="mt-1 font-serif text-xl">{slip}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
