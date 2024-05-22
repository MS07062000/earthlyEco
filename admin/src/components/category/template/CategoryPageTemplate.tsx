import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/global/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/store/interfaces";
import CategoryForm from "@/components/category/oragnisms/CategoryForm";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  // DialogDescription,
} from "@/components/ui/dialog";

interface CategoryPageTemplateProps {
  columns: ColumnDef<Category>[];
  categoryData: Category[];
}

const CategoryPageTemplate: React.FC<CategoryPageTemplateProps> = ({
  columns,
  categoryData,
}) => {
  return (
    <div className="container mx-auto py-10">
      <Dialog modal>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2" /> Create Category
          </Button>
        </DialogTrigger>
        <DialogContent className='overflow-y-scroll max-h-screen'>
          <DialogHeader>
          <DialogTitle className="text-3xl">Create Category</DialogTitle>
            {/* <DialogDescription>
              Create a new category for your products
            </DialogDescription> */}
          </DialogHeader>
          <CategoryForm />
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={categoryData} />
    </div>
  );
};

export default CategoryPageTemplate;
