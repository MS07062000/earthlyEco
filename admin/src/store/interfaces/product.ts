export default interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantityAvailable: number;
  categoryId: string;
  categoryName: string;
  createdTimeStamp: string;
  deletedTimeStamp: string | null;
}
