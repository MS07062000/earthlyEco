import { useAppDispatch, useAppSelector } from "@/hooks/apphook";
import productColumns from "../organisms/ProductColumns";
import ProductPageTemplate from "../template/ProductPageTemplate";
import {
  fetchProducts,
  setProductErrorMessage,
  setProductSuccessMessage,
} from "@/store/actions/productActions";
import { useEffect } from "react";
import { toast } from "sonner";
import memoizedProductSelector from "@/store/selectors/productSelectors";
import { fetchCategories } from "@/store/actions/categoryActions";
const ProductPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { product, category } = useAppSelector(memoizedProductSelector);

  useEffect(() => {
    if (product.products === null) {
      dispatch(fetchProducts());
    }
  }, [product.products]);

  useEffect(() => {
    if (category.categories === null) {
      dispatch(fetchCategories());
    }
  }, [category.categories]);

  useEffect(() => {
    if (product.successMessage != null && product.successMessage.length > 0) {
      console.log(product.successMessage);
      toast.success(product.successMessage, {
        onAutoClose: () => {
          dispatch(setProductSuccessMessage(null));
        },
        onDismiss: () => {
          dispatch(setProductSuccessMessage(null));
        },
      });
    }
  }, [product.successMessage]);

  useEffect(() => {
    if (product.errorMessage != null && product.errorMessage.length > 0) {
      toast.error(product.errorMessage, {
        onAutoClose: () => {
          dispatch(setProductErrorMessage(null));
        },
        onDismiss: () => {
          dispatch(setProductErrorMessage(null));
        },
      });
    }
  }, [product.errorMessage]);

  return (
    <>
      {product.products !== null && (
        <ProductPageTemplate
          columns={productColumns}
          productData={product.products}
        />
      )}
    </>
  );
};

export default ProductPage;
