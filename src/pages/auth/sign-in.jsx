import { getuserByToken, login } from "@/requests/auth";
import useAuthStore from "@/store/authStore";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";


export function SignIn() {
  const setToken = useAuthStore((state) => state.setToken);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const [Mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignIn = async (email, password) => {
    setLoading(true);
    setMensaje("");
    try {
      const response = await login(email, password);
      if (response.message === "exito") {
        setToken(response.data.token);
        const response1 = await getuserByToken();
        if (response1.message === "exito") {
          setCurrentUser(response1.data);
        } else if (response1.message === "No autorizado") {
          setMensaje(response1.message);
        } else {
          setMensaje(response1.error);
        }
      } else {
        setMensaje(response.error);
        console.log(response.error);
      }
    } catch (error) {
      setMensaje("Ocurrio un error");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMensaje("");
      }, 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setMensaje("Por favor, ingresa tu email y contraseña.");
      return;
    }

    handleSignIn(email, password);
  };
  return (
    <section className="flex gap-4 h-screen p-10">
      <div className="w-full lg:w-3/5 flex flex-col justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Iniciar Sesión</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Ingresa tu email y contraseña para iniciar sesión</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          {
            Mensaje && <div className="mb-4 text-red-500 text-center p-2 bg-red-100 rounded-lg">{Mensaje}</div>
          }
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Email o Usuario
            </Typography>
            <Input
              size="lg"
              name="email"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Contraseña
            </Typography>
            <Input
              name="password"
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-6" fullWidth>
            {
              loading ? "Cargando..." : "Iniciar Sesión"
            }
          </Button>
        </form>

      </div>
      <div className="w-2/5 hidden lg:block h-full">
        <img
          src="/img/pattern.png"
          className="rounded-3xl h-full w-full object-cover"
        />
      </div>

    </section>
  );
}

export default SignIn;
