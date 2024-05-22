import FormError from "@/components/auth/atoms/FormError";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ProductSchema } from "@/schemas";
import { Loader } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Product } from "@/store/interfaces";
import useProduct from "@/hooks/useProduct";
interface ProductFormProps {
  productInfo?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ productInfo }) => {
  const { categories, createProduct, updateProduct } = useProduct();

  const [error, setError] = useState<string | undefined>("");
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    productInfo?.image
  );

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: productInfo?.name ?? "",
      image: productInfo?.image ?? undefined,
      price: productInfo?.price ?? 0,
      quantityAvailable: productInfo?.quantityAvailable ?? 0,
      categoryId:
        productInfo?.categoryId !== undefined
          ? productInfo?.categoryId
          : categories !== null && categories.length > 0
          ? categories[0].id
          : "",
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError("");
      const file = acceptedFiles[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          setError("Please upload a valid image file");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          // 5MB size limit
          setError("Image file size should not exceed 5MB");
          return;
        }
        try {
          const base64 = await convertToBase64(file);
          form.setValue("image", base64);
          setImagePreview(base64);
        } catch (error) {
          setError("Failed to convert image to base64");
        }
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
    setError("");
    // const formData = new FormData();
    // formData.append("name", values.name);
    // formData.append("image", values.image);
    // formData.append("price", values.price.toString());
    // formData.append("quantityAvailable", values.quantity.toString());
    // formData.append("categoryId", values.category);

    if (productInfo != null) {
      updateProduct({ id: productInfo.id, ...values });
      // toast.success("Product updated successfully");
      return;
    }
    createProduct({ ...values });

    form.reset();
    setImagePreview(undefined);

    // toast.success("Product created successfully");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          disabled={form.formState.isSubmitting}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input required placeholder="Product Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={form.formState.isSubmitting}
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="flex-1">
              <FormLabel>Image</FormLabel>
              <div
                {...getRootProps({
                  className: `border-2 border-dashed p-4 rounded-md cursor-pointer ${
                    isDragActive ? "border-blue-600" : "border-gray-300"
                  }`,
                })}
              >
                <Input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  <p>Drag 'n' drop an image here, or click to select one</p>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48"
                    />
                  </div>
                )}
              </div>
              <FormDescription>
                Upload an image for the product. (Max size: 5MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={form.formState.isSubmitting}
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={form.formState.isSubmitting}
          control={form.control}
          name="quantityAvailable"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Quantity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {categories !== null && categories.length > 0 && (
          <FormField
            disabled={form.formState.isSubmitting}
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormError message={error} />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader className="animate-spin" size={20} />
          ) : productInfo != null ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
