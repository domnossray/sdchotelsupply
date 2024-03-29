"use client";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
// import type { Prisma } from "@prisma/client";
import { trpc } from "~/app/_trpc/client";
import EditModalBtn from "../modal-btn/product/update";
import { useCallback } from "react";
import AddModalBtn from "../modal-btn/product/add";

export default function Page(){

    const { data:products ,isLoading} = trpc.product.gets.useQuery()
    // const { data:image } = trpc.product.getImage.useQuery({id:1})

    // not use it because type of image too complicated
    // type Product =  {
    //   status: string | null;
    //   id: number;
    //   name: string;
    //   createdAt: string;
    //   updatedAt: string;
    //   description: string | null;
    //   price: number | null;
    //   popular: boolean | null;
    //   image: Prisma.JsonValue | null;
    //   categoryId: number | null;
    //   category: {
    //       status: string | null;
    //       id: number;
    //       description: string | null;
    //       name: string;
    //       createdAt: string;
    //       updatedAt: string;
    //       parentId: number | null;
    //   } | null;
    // }
    
    const columns = [
        {key:"name",label:"NAME"},
        {key:"price",label:"PRICE"},
        {key:"popular",label:"POPULAR"},
        {key:"category",label:"CATEGORY"},
        {key:"status",label:"STATUS"},
        {key:"action",label:"ACTION"}
    ];
    // eslint-disable-next-line
    const renderCell = useCallback((product: any , columnKey: React.Key) => { // eslint-disable-next-line
    // eslint-disable-next-line
    const cellValue = product[columnKey as keyof any];
    switch (columnKey) {
      case "name":
        return (
            <div>
                {product.name}
            </div>
        );
      case "price":
        return (
          <div>
            {product.price}
          </div>  
        );
      case "popular":
        return (
          <div>
            {product.popular?"true":"false"}
          </div>
        );
      case "category":
        return (
          <div>
            {product.category?.name??''}
          </div>
        );
      case "status":
        return (
          <div>
            {product.status}
          </div>
        );
      case "action":
        return (
          <div className="relative flex items-center gap-2">
            <EditModalBtn id={product.id} />
          </div>
        );
      default:
        return <>
        {cellValue?cellValue:''}
        </>;
    }
  }, []);

    return (
        <div className="w-full">
            <div className="mb-3">
                <AddModalBtn />
            </div>
            <Table aria-label="Product table">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            {isLoading?
                <TableBody isLoading={isLoading} loadingContent={<Spinner className="mt-14" />} >
                    <TableRow>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                    </TableRow>
                </TableBody>
            :<TableBody isLoading={isLoading} items={products}  loadingContent={<Spinner />}>
                 {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>} 
                    </TableRow> 
                    )}
            </TableBody>}
            </Table>
        </div>
        )
}