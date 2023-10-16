import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

type ImageCardProps = {
  content: string;
};

const ImageCard: React.FC<ImageCardProps> = ({ content }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedImage = event.target.files?.[0];
    if (uploadedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(uploadedImage);
    }
  };

  const handleClick = () => {
    document.getElementById("uploadInput")?.click();
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Card className="w-80 h-32 cursor-pointer">
          <CardContent className="flex items-center justify-center mt-10 ">
            <p className="text-xl font-semibold text-[#411c91] ">{content}</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <div className="flex flex-col h-64 cursor-pointer items-center justify-center gap-4">
              <label
                htmlFor="uploadInput"
                className="text-lg font-semibold text-gray-700"
              >
                Upload Image
              </label>
              <Input
                type="file"
                id="uploadInput"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div
                className={`flex h-64 w-72 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 ${
                  image ? "" : "hover:border-red-500"
                }`}
                onClick={handleClick}
              >
                {image ? (
                  <img src={image} alt="Uploaded" className="h-44 w-40" />
                ) : (
                  <div className="text-center">
                    <Avatar className="h-44 w-44">
                      <AvatarImage src="/img/teacher.jpg" />
                      <AvatarFallback>Image</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center">
              <Button
                type="submit"
                className="text-md rounded-md bg-red-500 px-16 py-6 text-white hover:bg-red-600"
              >
                Save Image
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const ImageUpload = () => {
  return (
    <div className="mt-14 ">
      <div className=" flex items-center justify-center pb-5">
        <Link to="/">
          <h1 className="text-4xl font-semibold">
            Xray {""}
            <span className="text-red-500">Editor</span>
          </h1>
        </Link>
      </div>
      <div className="flex gap-14 items-center justify-center">
        <div className="flex flex-col gap-10">
          <ImageCard content="Images" />
          <ImageCard content="Ceph" />
          <ImageCard content="OPE" />
          <ImageCard content="3D" />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
