export default interface Product {
  id: string;
  name: string;
  price: number;
  quantityAvailable: number;
  category: {
    id: string;
    name: string;
  };
  imageUrl: string;
}
