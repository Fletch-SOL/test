import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { HeroNFT } from './types';

export async function fetchWalletNFTs(
  walletAddress: string,
  connection: Connection
): Promise<HeroNFT[]> {
  try {
    const metaplex = new Metaplex(connection);
    const owner = new PublicKey(walletAddress);

    // Find all NFTs owned by the wallet
    const nfts = await metaplex.nfts().findAllByOwner({ owner });

    // Fetch metadata for each NFT
    const heroNFTs: HeroNFT[] = [];

    for (const nft of nfts) {
      try {
        // Load full metadata - handle both Metadata and NFT types
        const fullNft = await metaplex.nfts().load({ metadata: nft as any });

        // Parse JSON metadata
        if (fullNft.json) {
          heroNFTs.push({
            mint: fullNft.address.toString(),
            name: fullNft.json.name || 'Unknown Hero',
            image: fullNft.json.image || '',
            description: fullNft.json.description,
            attributes: fullNft.json.attributes as Array<{
              trait_type: string;
              value: string | number;
            }>,
          });
        }
      } catch (error) {
        console.error(`Error loading NFT:`, error);
        // Continue with other NFTs even if one fails
      }
    }

    return heroNFTs;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
}
