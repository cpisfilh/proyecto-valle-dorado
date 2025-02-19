import { create } from "@/requests/reqGenerics";
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Input, Spinner, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Create = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const fields = location.state?.fields || [];
    const entity = location.state?.entity || 'Entidad';

    const currentUrl = window.location.pathname;

    const onSubmit = (data) => {
        setLoading(true);
        create(data, entity + "/create").then((response) => {
            if (response.message == "exito") {
                setTimeout(() => {
                    navigate(`${currentUrl.replace("/create", "/show")}`, { state: { data: response.data, entity } });
                }, 1500);
                toast.success("Registro creado con exito!", {
                    autoClose: 1300
                })
            } else {
                toast.error("Ocurrió un problema!")
            }
        });
    };

    return (
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-4 p-6 text-center rounded-t-lg">
                <Typography variant="h5" color="white">
                    CREAR {entity.toUpperCase()}
                </Typography>
            </CardHeader>
            <CardBody className="px-6 py-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((field) => (
                        <div className="mb-4" key={field.name}>
                            <label className="block text-gray-700 font-bold">{field.name.toUpperCase()}</label>
                            <Input type={field.type} {...register(field.name, {
                                required: {
                                    value: true,
                                    message: `El campo ${field.name} es requerido`
                                }, maxLength: {
                                    value: field.maxLength,
                                    message: `El campo ${field.name} debe tener un máximo de ${field.maxLength} caracteres`
                                }, minLength: {
                                    value: field.minLength,
                                    message: `El campo ${field.name} debe tener un mínimo de ${field.minLength} caracteres`
                                }
                            })} />
                            {errors[field.name] && <Typography className="text-red-500 text-sm font-bold">{errors[field.name].message}</Typography>}
                        </div>
                    ))}
                    <CardFooter className="flex justify-between">
                        <Button type="button" color="gray" variant="outlined" onClick={()=>{navigate(`${currentUrl.replace("/create", "")}`);}}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="blue" disabled={loading}>
                            {
                                loading ? <Spinner color="green" /> : `Crear ${entity}`
                            }
                        </Button>
                    </CardFooter>
                    <ToastContainer />
                </form>
            </CardBody>
        </Card>
    );
}
export default Create