import { Link,useNavigate} from "react-router-dom";
import { useAtom } from "jotai";
import { imagePathAtom } from "@/atom/atom";
const timeLine = [
  {
    id:1,
    title:"20-05-2023",
    description:"Timeline",
    images:[
      "src/assets/xray.jpg",
      "src/assets/xray1.jpeg",
      "src/assets/xray2.jpeg"
    ],
  
  },
  {
    id:2,
    title:"02-08-2022",
    description:"Timeline",
    images:[
      "src/assets/xray.jpg",
      "src/assets/xray1.jpeg",
      "src/assets/xray2.jpeg"
    ],
  
  },{
    id:3,
    title:"28-03-2023",
    description:"Timeline",
    images:[
      "src/assets/xray.jpg",
      "src/assets/xray1.jpeg",
      "src/assets/xray2.jpeg"
    ],
  
  }

]
const TimeLineList = (
  {
    id,
    title,
    description,
    images
  }:any
)=>{
  const [,setImagePath] = useAtom(imagePathAtom);
  const navigate = useNavigate()

  const setImage = (image:any)=>{
    setImagePath(image)
    // redirect to editor
    console.log("hellos")
    navigate("/edit-image")

  }
  return(
    <div className="mb-10">
      <div className="flex gap-10 mt-10">
        <p className="bg-gray-700 px-4 py-2 text-white text-md">{title}</p>
        {/* <p className="bg-gray-700 px-4 py-2 text-white text-md">{description}</p> */}
    </div>
    <hr className=""/>
    <div className="flex gap-10 flex-wrap mt-6 px-10">
      {
        images.map((image:any)=>(
          <img src={image} alt="image" className="w-52 h-52 cursor-pointer" onClick={()=>setImage(image)}/>
        ))
      }
    </div>
      
    </div>

  )
}
const Timeline = () => {
  return (
    <div className="mt-5 px-10">
      <div className=" flex items-center justify-center pt-5">
        <Link to="/">
          <h1 className="text-4xl font-semibold">
            Xray {""}
            <span className="text-red-500">Editor</span>
          </h1>
        </Link>
      </div>
      <div className="flex gap-10 mt-10">
        <p className="text-lg font-bold">
          {" "}
          Patient ID: {""}
          <span className="text-red-500 font-semibold">1234</span>
        </p>
        <p className="text-lg font-bold">
          {" "}
          Name: {""}
          <span className="text-red-500 font-semibold">Ahmed</span>
        </p>
        <p className="text-lg font-bold">
          {" "}
          Gender: {""}
          <span className="text-red-500 font-semibold">Male</span>
        </p>
      </div>
      {
        timeLine.map((timeLine:any)=>(
          <TimeLineList
            id={timeLine.id}
            title={timeLine.title}
            description={timeLine.description}
            images={timeLine.images}
          />
        ))
      }
    </div>
  );
};

export default Timeline;
