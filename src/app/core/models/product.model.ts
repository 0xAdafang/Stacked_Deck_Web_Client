export interface CardDetails {
  hp?: string;
  types?: string;
  stage?: string;
  retreatCost?: string;
  weakness?: string;
  resistance?: string;
  attackDetails?: string;
  flavorText?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;

  cardDetails?: CardDetails;

  price: number;

  inStock: boolean;

  image: string;
  images?: string[];


  categoryId?: string;
  categoryName?: string;
  categoryCode?: string;

  type: 'SINGLE' | 'BOOSTER_PACK' | 'ETB' | 'BOOSTER_BOX' | 'BUNDLE';

  rarity?: string;
  condition?: string;
  illustrator?: string;


  active?: boolean;
  featured?: boolean;

  createdAt?: string;
  updatedAt?: string;
}
