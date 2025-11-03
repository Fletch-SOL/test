export interface HeroNFT {
  mint: string;
  name: string;
  image: string;
  description?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}
