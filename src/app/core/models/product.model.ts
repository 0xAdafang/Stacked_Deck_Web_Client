export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;

  price: number;
  stockQuantity: number;
  inStock?: boolean;

  image: string;
  images?: string[];


  categoryId?: string;
  categoryName?: string;
  type: 'SINGLE_CARD' | 'BOOSTER_PACK' | 'ETB' | 'BOOSTER_BOX' | 'BUNDLE';
  rarity?: string;
  condition?: string;


  active?: boolean;
  featured?: boolean;

  createdAt?: string;
  updatedAt?: string;
}
