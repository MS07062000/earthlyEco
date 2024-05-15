import { Product } from "../store/interfaces";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const editProduct = (editProduct: Product) => {};

  const deleteProduct = (deleteProduct: Product) => {};

  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Quantity: {product.quantityAvailable}</p>
      <p>Category: {product.category.name}</p>
      <button onClick={() => editProduct(product)}>Edit</button>
      <button onClick={() => deleteProduct(product)}>Delete</button>
    </div>
  );
};

export default ProductCard;
