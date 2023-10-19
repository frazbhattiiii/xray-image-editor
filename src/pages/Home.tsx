//  listing all urls of all pages 
import { Link } from "react-router-dom"
const Home = () => {
  return (
    <div className="flex items-center justify-center mt-20">
      <li className="flex flex-col gap-4 text-xl ">
        <Link to="/login">Login</Link>
        <Link to="/signup">Register</Link>
        <Link to="/forgot-password">Forgot Password</Link>
        <Link to="/update-password">Update Password</Link>
        <Link to="/list-patients">Patient List</Link>
        <Link to="/upload-image">Image Upload</Link>
        <Link to="/timeline">Timeline</Link> 

      

      </li>
    </div>
  )
}

export default Home
