# Gachapad

Swap desk for Base tokenized stocks (B20). A 0.50% desk fee is split 80 / 15 / 5 into a prize vault, app treasury, and referral reserve. The vault restocks NVDAc, AAPLc, METAc, and GOOGLc. Users burn soulbound activity points to pull a random stock slip.

## MVP

- Desk UI: USDC in, prize ticker out
- Fee and points preview
- Vault rail + preview pull
- Missions and daily check-in
- Foundry contracts and Sepolia mocks

Not in MVP: Uniswap v4 hook, Chainlink VRF, Mini App, illiquid tickers.

## Stack

Next.js 15, TypeScript, Tailwind, OnchainKit, Wagmi, Viem. Contracts: Foundry, solc 0.8.26.

## Fee

| Slice | Share of 0.50% |
| --- | --- |
| Prize vault | 80% (0.40% notional) |
| Treasury | 15% |
| Referral / mission boost | 5% |

Points: 1 PAD per $1 swap volume. Check-in 15 + 5 streak (cap 40).

## Run

```bash
pnpm install
cp .env.example .env.local
# NEXT_PUBLIC_ONCHAINKIT_API_KEY from portal.cdp.coinbase.com
pnpm dev
```

Default chain is Base Sepolia (84532).

## Contracts

```bash
cd contracts
forge build
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY
```

Set `NEXT_PUBLIC_ROUTER_ADDRESS`, `NEXT_PUBLIC_VAULT_ADDRESS`, `NEXT_PUBLIC_POINTS_ADDRESS`, `NEXT_PUBLIC_USDC_ADDRESS` after deploy.

Prize names on mainnet (identify by address):

- NVDAc `0xb20000000000000000000078ee7ce2fE4908108C`
- AAPLc `0xb200000000000000000000C2e324d24d7eEcd1fb`
- METAc `0xb2000000000000000000008bC8786B856E61707C`
- GOOGLc `0xb2000000000000000000002D0BA3164cc74f58B7`

Coinbase Tokenized Stocks are not offered to US persons.

## License

MIT
