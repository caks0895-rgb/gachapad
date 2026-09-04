export const ROUTER_ABI = [
  {
    type: "function",
    name: "swapExactIn",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenOut", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "minOut", type: "uint256" },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
] as const;

export const VAULT_ABI = [
  {
    type: "function",
    name: "pull",
    stateMutability: "nonpayable",
    inputs: [{ name: "pointsToBurn", type: "uint256" }],
    outputs: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "luckBps", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "inventory",
    stateMutability: "view",
    inputs: [{ name: "token", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

export const POINTS_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "checkIn",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [{ name: "awarded", type: "uint256" }],
  },
  {
    type: "function",
    name: "claimMission",
    stateMutability: "nonpayable",
    inputs: [{ name: "missionId", type: "uint8" }],
    outputs: [{ name: "awarded", type: "uint256" }],
  },
] as const;

export function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_ROUTER_ADDRESS &&
      process.env.NEXT_PUBLIC_VAULT_ADDRESS &&
      process.env.NEXT_PUBLIC_POINTS_ADDRESS
  );
}
