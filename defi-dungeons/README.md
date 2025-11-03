# DeFi Dungeons

A Next.js-based Solana NFT game where players can connect their wallets and view their Hero NFTs.

## Features

- **Wallet Connection**: Support for Phantom and Solflare wallets
- **NFT Display**: Fetch and display Metaplex standard NFTs from connected wallet
- **Responsive UI**: Built with Tailwind CSS for a modern, responsive design
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Solana Web3.js** - Solana blockchain interaction
- **Metaplex JS** - NFT metadata fetching
- **Solana Wallet Adapter** - Wallet connection management

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- A Solana wallet (Phantom or Solflare) with devnet SOL

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click "Select Wallet" to connect your Phantom or Solflare wallet
2. Approve the connection request in your wallet
3. Your Hero NFTs will automatically load and display as cards
4. View NFT details including name, image, description, and attributes

## Project Structure

```
defi-dungeons/
├── app/
│   ├── layout.tsx          # Root layout with wallet provider
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── WalletContextProvider.tsx  # Wallet adapter setup
│   ├── WalletConnectButton.tsx    # Wallet connection button
│   ├── NFTGallery.tsx             # NFT gallery container
│   └── NFTCard.tsx                # Individual NFT card
└── lib/
    ├── types.ts            # TypeScript type definitions
    └── fetchNFTs.ts        # NFT fetching logic
```

## Network Configuration

The app is currently configured to use Solana **devnet**. To change networks, modify the endpoint in `components/WalletContextProvider.tsx`:

```typescript
// For mainnet:
const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);

// For devnet (current):
const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
```

## Future Enhancements

- Game mechanics (battles, quests, etc.)
- NFT staking
- Token rewards
- Multiplayer features
- NFT minting

## License

MIT
