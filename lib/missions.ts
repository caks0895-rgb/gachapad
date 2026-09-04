export type Mission = {
  id: number;
  title: string;
  detail: string;
  points: number;
  once: boolean;
};

export const MISSIONS: Mission[] = [
  { id: 1, title: "First print", detail: "Complete one swap on the desk.", points: 50, once: true },
  { id: 2, title: "Three names", detail: "Swap into three different prize tickers.", points: 80, once: true },
  { id: 3, title: "Hundred lot", detail: "Reach $100 cumulative swap volume.", points: 40, once: true },
  { id: 4, title: "Five hundred lot", detail: "Reach $500 cumulative swap volume.", points: 120, once: true },
  { id: 5, title: "Two thousand lot", detail: "Reach $2,000 cumulative swap volume.", points: 400, once: true },
  { id: 6, title: "Hold the slip", detail: "Keep a gacha prize in-wallet for 24 hours.", points: 60, once: true },
];
