import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/store/interfaces";
import ProductsActionsCell from "./ProductActionsCell";
import { Badge } from "@/components/ui/badge";

const ProductColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;
      const name = String(row.getValue("name"));
      return (
        <div className="flex items-center font-medium capitalize">
          <img
            src={product.image}
            alt={product.name}
            className="h-12 w-12 rounded-md mr-4"
          />
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center text-center m-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="ml-2 text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "quantityAvailable",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center text-center m-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const quantity = parseInt(row.getValue("quantityAvailable"));
      return <div className="ml-2 text-center">{quantity}</div>;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center m-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const categoryName = row.original.categoryName;
      return (
        <div className="text-center">
          <Badge variant="secondary" className="capitalize">
            {categoryName}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center m-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;
      const createdAt = product.createdTimeStamp;
      return (
        <div className="ml-2 font-medium text-center">{createdAt}</div>
      );
    },
  },
  {
    accessorKey: "deletedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex justify-center items-center m-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Deleted At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;
      const deletedAt = product.deletedTimeStamp;
      return (
        <div className="ml-2 font-medium text-center">{deletedAt}</div>
      );
    },
  },
  {
    id: "actions",
    header: () => {
      return <div className="ml-2 text-center">Actions</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">
        <ProductsActionsCell product={row.original} />
      </div>
    ),
  },
];

export default ProductColumns;
