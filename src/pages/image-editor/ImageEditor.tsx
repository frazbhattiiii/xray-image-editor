import ImageEditorComponent from '@/components/image-editor/ImageEditorComponent';
import { Link } from 'react-router-dom';

const ImageEditor = () => {
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
      <div className='px-20 w-[28rem] pt-4'>
      <ImageEditorComponent/>
      </div>
      </>
  )
}

export default ImageEditor
