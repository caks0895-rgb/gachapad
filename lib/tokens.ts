export type StockToken = {
  ticker: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
  underlying: string;
  hasLiveLp: boolean;
};

/** Coinbase B20 tokenized stocks. Identify by address, never ticker alone. */
export const MAINNET_STOCKS: StockToken[] = [
  {
    ticker: "NVDAc",
    name: "NVIDIA",
    address: "0xb20000000000000000000078ee7ce2fE4908108C",
    decimals: 18,
    underlying: "NVDA",
    hasLiveLp: true,
  },
  {
    ticker: "AAPLc",
    name: "Apple",
    address: "0xb200000000000000000000C2e324d24d7eEcd1fb",
    decimals: 18,
    underlying: "AAPL",
    hasLiveLp: true,
  },
  {
    ticker: "METAc",
    name: "Meta",
    address: "0xb2000000000000000000008bC8786B856E61707C",
    decimals: 18,
    underlying: "META",
    hasLiveLp: true,
  },
  {
    ticker: "GOOGLc",
    name: "Alphabet",
    address: "0xb2000000000000000000002D0BA3164cc74f58B7",
    decimals: 18,
    underlying: "GOOGL",
    hasLiveLp: true,
  },
];

export const PRIZE_STOCKS = MAINNET_STOCKS.filter((s) => s.hasLiveLp);

export const FEE_BPS = 50;
export const FEE_PRIZE_SHARE_BPS = 8000;
export const FEE_TREASURY_SHARE_BPS = 1500;
export const FEE_REFERRAL_SHARE_BPS = 500;

export const LUCK_BANDS = [
  { mult: 0.35, weight: 30, label: "Thin slip" },
  { mult: 0.7, weight: 35, label: "Quiet print" },
  { mult: 1.0, weight: 22, label: "At par" },
  { mult: 1.6, weight: 10, label: "Wide print" },
  { mult: 3.0, weight: 3, label: "Open print" },
] as const;

export function envelopeUsd(points: number): number {
  if (points <= 0) return 0;
  return (0.004 * points + 0.0000015 * points * points) * 0.8;
}

export function expectedLuck(): number {
  const total = LUCK_BANDS.reduce((s, b) => s + b.weight, 0);
  return LUCK_BANDS.reduce((s, b) => s + b.mult * (b.weight / total), 0);
}
