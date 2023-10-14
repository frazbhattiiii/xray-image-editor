import AuthenticationPage from '@/components/auth/auth-page'

const Login = () => {
  return (  
    <div className='flex justify-center items-center w-full h-full p-5'>
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
