import { useEffect, useState } from "react";
import { getCategories } from "./helpers/fetchCategories";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";

interface ProductInfo {
    image: string;
    products: Map<string, string>[];
}

interface CategoryInfo {
    [key: string]: ProductInfo;
}

const Category = () => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Array<CategoryInfo>>([]);
    const [error, setError] = useState<string | null>(null);
    const fetchCategories = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
            setLoading(false);
        } catch (error) {
            setError('Unable to get categories');
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);


    const handleRedirect = (categoryName: string, products: ProductInfo["products"]) => {
        navigate('/products', { state: { category: categoryName, products: products } });
    };

    return (
        <div className="bg-[#fdd35b] p-4 mt-14 min-h-screen">
            {
                isLoading
                    ? <Spinner />
                    : <>
                        {error != null && <ErrorMessage errorMessage={error} />}
                        {
                            categories.length > 0 &&
                            <>
                                <p className="pb-4 px-2 text-2xl font-medium text-center ">Shop By Category</p>
                                <div className="flex flex-row flex-wrap content-center justify-center gap-2 md:gap-4">
                                    {categories.map((category, index) => {
                                        const categoryName = Object.keys(category)[0];
                                        const products = category[categoryName].products;
                                        const image = category[categoryName].image;
                                        return (<figure onClick={() => { handleRedirect(categoryName, products) }} key={index} className="w-[320px] flex flex-col justify-start items-center">
                                            <img className="h-[320px] w-[320px] rounded-lg text-center" loading="lazy" src={image} alt="image description" />
                                            <figcaption className="capitalize mt-2 text-center font-medium text-lg ">{categoryName}</figcaption>
                                        </figure>);
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