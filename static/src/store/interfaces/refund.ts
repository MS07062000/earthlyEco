export default interface Refund {
    id: string;
    paymentID: string;
    products: {
      id: string;
      image: string;
      name: string;
      quantity: number;
      price: number;
    }[];
}