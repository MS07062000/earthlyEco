import { useAppDispatch, useAppSelector } from "@/hooks/apphook";
import categoryColumns from "../oragnisms/CategoryColumns";
import CategoryPageTemplate from "../template/CategoryPageTemplate";
import { fetchCategories, setCategoryErrorMessage, setCategorySuccessMessage } from "@/store/actions/categoryActions";
import { useEffect } from "react";
import { toast } from "sonner";

const CategoryPage = () => {
  const dispatch = useAppDispatch();
  const category = useAppSelector((state) => state.category);
  useEffect(() => {
    if (category.categories === null) {
      dispatch(fetchCategories());
    }
  }, [category.categories]);

  useEffect(() => {
    if (category.successMessage != null && category.successMessage.length > 0) {
      toast.success(category.successMessage, {
        onAutoClose: () => {
          dispatch(setCategorySuccessMessage(null));
        },
        onDismiss: () => {
          dispatch(setCategorySuccessMessage(null));
        },
      });
    }
  }, [category.successMessage]);

  useEffect(() => {
    if (category.errorMessage != null && category.errorMessage.length > 0) {
      toast.error(category.errorMessage, {
        onAutoClose: () => {
          dispatch(setCategoryErrorMessage(null));
        },
        onDismiss: () => {
          dispatch(setCategoryErrorMessage(null));
        },
      });
    }
  }, [category.errorMessage]);

  return (
    <>
      {category.categories !== null && (
        <CategoryPageTemplate
          columns={categoryColumns}
          categoryData={category.categories}
        />
      )}
    </>
  );
};

export default CategoryPage;
