import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchCategories } from "../../store/actions/categoryActions";
import { CategoryInfo } from "../../store/interfaces";
import { Message, Spinner } from "..";

const Category = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const categoryState = useAppSelector(state => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
    }, []);


    const handleRedirect = (categoryName: string) => {
        navigate(`/products?category=${categoryName}`);
    };

    return (
        <div className="bg-[#fdd35b] p-4 mt-14 min-h-screen">
            {
                categoryState.loading
                    ? <Spinner />
                    : <>
                        {categoryState.error != null && <Message type="error" message={categoryState.error} />}
                        {
                            categoryState.categories.length > 0 && categoryState.error == null &&
                            <>
                                <p className="pb-2 px-2 text-2xl font-medium text-center fixed z-50 top-16 inset-x-0 bg-[#fdd35b]">Shop By Category</p>
                                <div className="mt-10 flex flex-row flex-wrap content-center justify-center gap-2 md:gap-4">
                                    {categoryState.categories.map((category: CategoryInfo, index: number) => {
                                        return (
                                            <figure onClick={() => { handleRedirect(category.name) }} key={index} className="w-[320px] flex flex-col justify-start items-center">
                                                <img className="h-[320px] w-[320px] rounded-lg text-center" loading="lazy" src={category.image} alt="image description" />
                                                <figcaption className="capitalize mt-2 text-center font-medium text-lg ">{category.name}</figcaption>
                                            </figure>
                                        );
                                    }
                                    )}
                                </div>
                            </>
                        }

                    </>
            }
        </div>
    )
}
export default Category;