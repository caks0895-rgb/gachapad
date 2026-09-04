"use client";

import { useMemo, useState } from "react";
import { PRIZE_STOCKS, FEE_BPS } from "@/lib/tokens";
import { isConfigured } from "@/lib/contracts";

export function SwapDesk() {
  const [amount, setAmount] = useState("100");
  const [ticker, setTicker] = useState(PRIZE_STOCKS[0].ticker);
  const configured = isConfigured();
  const parsed = Number(amount) || 0;
  const fee = useMemo(() => (parsed * FEE_BPS) / 10_000, [parsed]);
  const prizeCut = fee * 0.8;
  const points = Math.max(0, Math.floor(parsed));

  return (
    <section className="border border-rule bg-paper">
      <div className="flex items-baseline justify-between border-b border-rule px-5 py-3">
        <h2 className="font-serif text-2xl">Swap desk</h2>
        <p className="font-mono text-xs uppercase tracking-wider text-ink/50">USDC in · stock out</p>
      </div>
      <div className="space-y-5 px-5 py-5">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">Pay</span>
          <div className="mt-1 flex items-end gap-3 border-b border-ink/20 pb-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              inputMode="decimal"
              className="w-full bg-transparent font-serif text-4xl outline-none"
            />
            <span className="font-mono text-sm">USDC</span>
          </div>
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">Receive</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRIZE_STOCKS.map((s) => (
              <button
                key={s.ticker}
                type="button"
                onClick={() => setTicker(s.ticker)}
                className={`border px-3 py-1.5 font-mono text-sm ${
                  ticker === s.ticker
                    ? "border-ink bg-ink text-paper"
                    : "border-rule text-ink hover:border-ink"
                }`}
              >
                {s.ticker}
              </button>
            ))}
          </div>
        </label>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs text-ink/70">
          <div className="flex justify-between gap-3">
            <dt>Desk fee</dt>
            <dd>{fee.toFixed(2)} USDC</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>To vault</dt>
            <dd>{prizeCut.toFixed(2)} USDC</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Points minted</dt>
            <dd>{points} PAD</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Route</dt>
            <dd>wrapper · AMM</dd>
          </div>
        </dl>
        <button
          type="button"
          disabled={!configured}
          className="w-full border border-ink bg-ink py-3 font-sans text-sm text-paper disabled:cursor-not-allowed disabled:border-rule disabled:bg-mist disabled:text-ink/40"
        >
          {configured ? `Buy ${ticker}` : "Contracts not set — preview only"}
        </button>
        <p className="text-xs leading-relaxed text-ink/55">
          Fee is 0.50 percent of notional, split 80 / 15 / 5 into vault, treasury, and referral.
          Secondary trading of Coinbase tokenized stocks is permissionless; the product is not
          offered to US persons. Identify tokens by contract address.
        </p>
      </div>
    </section>
  );
}
