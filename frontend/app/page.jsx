import FormSignUp from "@/components/FormSignUp/FormSignUp"
const PrincipalPage = () => {
  return (
    <div className="w-full min-h-screen isolate pt-20 bg-black">
        <h1 className="text-center text-4xl font-montserrat font-bold text-white">¡Bienvenido a <span className="text-kaqui">UvgMatch!</span></h1>
        <FormSignUp />
    </div>

  )
}

export default PrincipalPage