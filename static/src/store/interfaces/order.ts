import CategoryWithProductsInfo from "./categoryWithProductsInfo";
export default interface Order {
    orderID: string;
    categoryWithProducts: CategoryWithProductsInfo[];
}