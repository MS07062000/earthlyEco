import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { CategorySchema } from "@/schemas";
import { Category } from "@/store/interfaces";
import useCategory from "@/hooks/useCategory";

interface CategoryFormProps {
  categoryInfo?: Category;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryInfo }) => {
  const { createCategory, updateCategory } = useCategory();
  const [error, setError] = useState<string | undefined>("");
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    categoryInfo?.image
  );

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: categoryInfo?.name ?? "",
      image: categoryInfo?.image ?? "",
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

  const onSubmit = async (values: z.infer<typeof CategorySchema>) => {
    setError("");
    if (categoryInfo != undefined) {
      updateCategory({
        id: categoryInfo.id,
        ...values,
      });
      return;
    }

    createCategory({
      ...values,
    });

    form.reset();
    setImagePreview(undefined);
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
                <Input required placeholder="Name" {...field} />
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
                Upload an image for the category. (Max size: 5MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader className="animate-spin" size={20} />
          ) : categoryInfo != undefined ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
