import FormLogin from "@/components/FormLogin/FormLogin"
const Login = () => {
  return (
    <div className="w-full min-h-screen isolate pt-20 bg-black">
        <h1 className="text-center text-4xl font-montserrat font-bold text-white">¡Bienvenido a <span className="text-kaqui">UvgMatch!</span></h1>
        <FormLogin />
    </div>

  )
}

export default Login