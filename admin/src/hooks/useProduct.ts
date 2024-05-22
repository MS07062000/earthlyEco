import {
  setProductSuccessMessage,
  fetchProducts
} from "@/store/actions/productActions";
import apiErrorHandler from "@/store/actions/utils/apiErrorHandler";
import { productAPI } from "@/store/api";
import { CreateProduct, UpdateProduct, Product } from "@/store/interfaces";
import { updateProductErrorMessage } from "@/store/slices/productSlice";
import { useAppDispatch,useAppSelector } from "./apphook";

export default function useProduct() {
  const category = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();

  const createProduct = async (product: CreateProduct) => {
    try {
      await productAPI.createProduct(product);
      dispatch(fetchProducts());
      dispatch(
        setProductSuccessMessage(`${product.name} created successfully`)
      );
    } catch (error: unknown) {
      apiErrorHandler(
        error,
        `Unable to create product ${product.name}`,
        updateProductErrorMessage
      )(dispatch);
    }
  };

  const updateProduct = async (product: UpdateProduct) => {
    try {
      await productAPI.updateProduct(product);
      dispatch(fetchProducts());
      dispatch(
        setProductSuccessMessage(`${product.name} updated successfully`)
      );
    } catch (error: unknown) {
      apiErrorHandler(
        error,
        `Unable to update product ${product.name}`,
        updateProductErrorMessage
      )(dispatch);
    }
  };

  const deleteProduct = async (product: Product) => {
    try {
      await productAPI.deleteProduct(product.id);
      dispatch(fetchProducts());
      dispatch(
        setProductSuccessMessage(`Product ${product.name} deleted successfully`)
      );
    } catch (error: unknown) {
      apiErrorHandler(
        error,
        `Unable to delete product ${product.name}`,
        updateProductErrorMessage
      )(dispatch);
    }
  };

  const restoreProduct = async (product: Product) => {
    try {
      await productAPI.restoreProduct(product.id);
      dispatch(fetchProducts());
      dispatch(
        setProductSuccessMessage(
          `Product ${product.name} restored successfully`
        )
      );
    } catch (error: unknown) {
      apiErrorHandler(
        error,
        `Unable to restored product ${product.name}`,
        updateProductErrorMessage
      )(dispatch);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    categories: category.categories
  };
}
