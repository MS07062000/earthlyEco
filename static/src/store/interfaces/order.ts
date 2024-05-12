export default interface Order {
  id: string;
  products: {
    id: string;
    image: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}
