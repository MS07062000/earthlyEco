import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Category } from "@/store/interfaces";
import CategoryActionsCell from "./CategoryActionsCell";

const CategoryColumns: ColumnDef<Category>[] = [
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
      const category = row.original;
      const name = String(row.getValue("name"));
      return (
        <div className="flex items-center font-medium capitalize">
          <img
            src={category.image}
            alt={category.name}
            className="h-12 w-12 rounded-md mr-4"
          />
          {name}
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
      const category = row.original;
      const createdAt = category.createdTimeStamp;
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
      const category = row.original;
      const deletedAt = category.deletedTimeStamp;
      return (
        <div className="ml-2 font-medium text-center">{deletedAt}</div>
      );
    },
  },
  {
    id: "actions",
    header: () => {
      return (
       <div className="ml-2 text-center">Actions</div>
      );
    },
    cell: ({ row }) => <div className="text-center"><CategoryActionsCell category={row.original} /></div>,
  },
];

export default CategoryColumns;