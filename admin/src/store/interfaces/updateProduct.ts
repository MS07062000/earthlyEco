export default interface UpdateProduct {
    id: string;
    name?: string;
    price?: number;
    quantityAvailable?: number;
    categoryId?: string;
    image?: string;
}