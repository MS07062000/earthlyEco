export default interface CategoryWithProductsInfo{
    category: string,
    products: {
        name: string,
        image: string,
        quantity: number, 
        price: number,
    }[]
}