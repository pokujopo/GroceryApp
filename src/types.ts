export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Fruits' | 'Vegetables' | 'Dairy' | 'Bakery' | 'Meat' | 'Pantry';
  image: string;
  description: string;
  unit: string;
}

export interface CartItem extends Product {
  quantity: number;
}
