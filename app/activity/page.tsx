import { FooterNote } from "@/components/FooterNote";
import { Header } from "@/components/Header";

const rows = [
  { t: "preview", act: "Swap", detail: "100 USDC to NVDAc", extra: "+100 PAD" },
  { t: "preview", act: "Fee", detail: "0.50 USDC desk, 0.40 to vault", extra: "80/15/5" },
  { t: "preview", act: "Pull", detail: "200 PAD burned", extra: "AAPLc slip" },
];

export default function ActivityPage() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage">Record</p>
        <h1 className="mt-2 font-serif text-4xl">Tape</h1>
        <p className="mt-3 text-sm text-ink/70">
          Live fills appear here after the router is deployed. Rows below are layout only.
        </p>
        <table className="mt-8 w-full border-t border-rule text-left text-sm">
          <thead>
            <tr className="font-mono text-[11px] uppercase tracking-wider text-ink/45">
              <th className="py-3 font-normal">When</th>
              <th className="py-3 font-normal">Act</th>
              <th className="py-3 font-normal">Detail</th>
              <th className="py-3 font-normal">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-rule">
                <td className="py-3 font-mono text-xs">{r.t}</td>
                <td className="py-3">{r.act}</td>
                <td className="py-3 text-ink/70">{r.detail}</td>
                <td className="py-3 font-mono text-xs">{r.extra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <FooterNote />
    </div>
  );
}
