import ImageEditorComponent from "@/components/image-editor/ImageEditorComponent";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Pointer, Sparkle, PanelTopOpen } from "lucide-react";
import { useAtomValue } from "jotai";
import { imagePathAtom } from "@/atom/atom";



const ImageEditor = () => {
  const imagePath = useAtomValue(imagePathAtom);
  if (!imagePath) {
    return (
      <div className="flex flex-col justify-center items-center m-5 gap-4">
        <Link to="/">
          <h1 className="text-4xl font-semibold">
            Xray {""}
            <span className="text-red-500">Editor</span>
          </h1>
        </Link>
        <h1 className="text-4xl font-semibold">
          Please upload an image first
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center m-5 gap-4">
        <Link to="/">
          <h1 className="text-4xl font-semibold">
            Xray {""}
            <span className="text-red-500">Editor</span>
          </h1>
        </Link>
      </div>
      <div className="flex gap-20 px-40 pt-4">
        <ImageEditorComponent />
        <div className="flex flex-col justify-center items-center w-full gap-10">
          <Button className="w-3/4 py-6 bg-[#722f99] hover:bg-[#60178a]">
            {" "}
            <Sparkle className="mr-3" /> Detect AI{" "}
          </Button>
          <Button className="w-3/4 py-6 bg-[#722f99] hover:bg-[#60178a]">
            <Pointer className="mr-3" /> Reset the Points{" "}
          </Button>
          <Button className="w-3/4 py-6 bg-[#722f99] hover:bg-[#60178a]">
            <PanelTopOpen className="mr-3" /> Show Results{" "}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ImageEditor;
