import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/global/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/store/interfaces";
import ProductForm from "@/components/products/organisms/ProductForm";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

interface ProductPageTemplateProps {
  columns: ColumnDef<Product>[];
  productData: Product[];
}

const ProductPageTemplate: React.FC<ProductPageTemplateProps> = ({
  columns,
  productData,
}) => {
  return (
    <div className="container mx-auto py-10">
      <Dialog modal>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2" /> Create Product
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle className="text-3xl">Create Product</DialogTitle>
            {/* <DialogDescription>
              Create a new product for your store
            </DialogDescription> */}
          </DialogHeader>
          <ProductForm />
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={productData} />
    </div>
  );
};

export default ProductPageTemplate;
