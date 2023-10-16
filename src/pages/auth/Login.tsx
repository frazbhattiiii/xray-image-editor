import AuthenticationPage from '@/components/auth/auth-page'
import { Link } from 'react-router-dom'

const Login = () => {
  return (  
    <div className='flex flex-col justify-center items-center w-full h-full p-5'>
      <div className="flex justify-center items-center m-5 gap-4">
        <Link to="/">
          <h1 className="text-4xl font-semibold">
            Xray {""}
            <span className="text-red-500">Editor</span>
          </h1>
        </Link>
      </div>
      <AuthenticationPage
        title='Login'
        description='Enter your email to login to your account'
        value='Signup'
        authFor="login"
      />
    </div>
  )
}

export default Login
