"use client";
import { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import { trpc } from "~/app/_trpc/client";
import { toast } from "sonner";
import ImageUploader from "@/app/_components/admin/imageuploader";
import Editor from "../../editor";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export default function AddModalBtn() {
    const {isOpen, onOpen, onOpenChange,onClose} = useDisclosure();
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [popular, setPopular] = useState<boolean>(false);
    const [price, setPrice] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [image, setImage] = useState<string[]>();
    const [filesWithTimestamp, setFilesWithTimestamp] = useState<{ file: File, name: string }[]>([]);

    useEffect(() => {
      const str: string[] = [];
      const files: { file: File, name: string }[] = [];
      
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          const timestamp = new Date().getTime();
          const newName = timestamp.toString() + file.name;
          
          str.push(newName);
          files.push({ file, name: newName });
        });

        setImage(str);
        setFilesWithTimestamp(files);
      }
    }, [selectedFiles]);


    const utils = trpc.useUtils()
    const {data:submenulist} = trpc.subMenu.list.useQuery()

    const mutation = trpc.product.add.useMutation({
      onSuccess: () => {
        toast.success("Product Added")
        utils.product.gets.invalidate()
        onClose()
      },
      onError: (err) => {
        toast.error(err.message)
      }
    });

    const hanldeAddMenu = async () => {
      if(!name || !status || !description || !categoryId || !popular || !price){
        toast.error("Please fill all field")
        return
      }
      if(isNaN(Number(price))){
        toast.error("Price must be a number")
        return
      }
      if(image && image?.length>0){
        const upload = await handleUpload()
        if(!upload){
          toast.error("Upload image failed")
          return
        }
      }
      mutation.mutateAsync({
          name,
          price:Number(price),
          description,
          categoryId,
          popular, 
          status,
          image:JSON.stringify(image)
      })
    }

const handleUpload = async () => {
  if(filesWithTimestamp.length > 0){
    const formData = new FormData();
    filesWithTimestamp.map((fileObj) => {
      formData.append("files", fileObj.file, fileObj.name);
    });
    try {
      const res = await fetch(BASE_URL+"/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        return false
      }
      await res.json();
      return true
    } catch (error) {
      console.error('An error occurred:', error);
      return false
    }
  } else {
    return false
  }
}

    return (
    <>
      <Button onPress={onOpen}>Add Product</Button>
      <Modal size="5xl" className="h-[800px]" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">New Product</ModalHeader>
              <ModalBody className="overflow-auto">
                <Input label="title" value={name} onChange={(e)=>setName(e.target.value)}/>
                <Select required onChange={(e)=> setCategoryId(Number(e.target.value))} label={"category"} items={submenulist}>
                  {parent => <SelectItem key={parent.id} value={parent.id}>{parent.name}</SelectItem>}
                </Select>
                <Select required onChange={(e)=>setStatus(e.target.value)} label="status">
                  <SelectItem key={"active"} value={"active"}>
                    Active
                  </SelectItem>
                  <SelectItem key={"disable"} value={"disable"}>
                    Disable 
                  </SelectItem>
                </Select>
                <Select required onChange={(e)=>setPopular(e.target.value === "true")} label="popular">
                  <SelectItem key={"true"} value={"true"}>
                    True
                  </SelectItem>
                  <SelectItem key={"false"} value={"false"}>
                    False 
                  </SelectItem>
                </Select>
                <Input label="price" value={price} onChange={(e)=>setPrice(e.target.value)}/>
                <ImageUploader selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} limit={99}/>
                <div className="text-sm text-gray-500">
                  Descsription
                </div>
                <Editor value={description} setValue={setDescription}/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={hanldeAddMenu}>
                  Add 
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}