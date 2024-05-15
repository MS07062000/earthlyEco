import axios from 'axios';

export const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/products');
    return response.data; // Array of products
  } catch (error) {
    console.error('Error fetching products:', error);
    // Handle error appropriately (e.g., dispatch an error action in Redux)
  }
};

const addProduct = async (productData) => {
    try {
      const response = await axios.post('/api/products', productData);
      return response.data; // Newly created product object
    } catch (error) {
      console.error('Error adding product:', error);
      // Handle error appropriately (e.g., dispatch an error action in Redux)
    }
  };

  
  const editProduct = async (productData) => {
    try {
      const response = await axios.put(`/api/products`, productData);
      return response.data; // Updated product object
    } catch (error) {
      console.error('Error editing product:', error);
      // Handle error appropriately (e.g., dispatch an error action in Redux)
    }
  };

  
  const deleteProduct = async (productId: string) => {
    try {
      await axios.delete(`/api/products/${productId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Handle error appropriately (e.g., dispatch an error action in Redux)
    }
  };
  