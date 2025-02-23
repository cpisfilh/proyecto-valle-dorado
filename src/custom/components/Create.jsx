import axiosInstance from "@/requests/axiosConfig";
import { create } from "@/requests/reqGenerics";
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Input, Spinner, Typography } from "@material-tailwind/react";
import { use, useEffect } from "react";
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

    const selectFields = fields.filter((field) => field.type === "select")

    // Crear estado dinámico con los nombres de los objetos
    const [selectState, setSelectState] = useState(
        selectFields.reduce((acc, field) => ({ ...acc, [field.name]: [] }), {})
    );
    const currentUrl = window.location.pathname;

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await create(data, entity + "/create");
            if (response.message == "exito") {
                setTimeout(() => {
                    navigate(`${currentUrl.replace("/create", "/show")}`, { state: { data: response.data, entity,fields } });
                }, 1500);
                toast.success("Registro creado con exito!", {
                    autoClose: 1300
                })
            } else {
                toast.error("Ocurrio un problema!")
            }
        } catch (error) {
            toast.error("Ocurrio un problema!")
        }

    };

    // Fetch de datos cuando el componente se monta
    useEffect(() => {
        if(selectFields.length === 0) return
        fields.forEach(async (field) => {
            try {
                const response = await axiosInstance.get(`/${field.name}`);
                setSelectState((prev) => ({ ...prev, [field.name]: response.data }));
            } catch (error) {
                console.error(`Error al cargar ${field.name}:`, error);
            }
        });
    }, []);

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
                            {
                                field.type === "select" ? (
                                    <>
                                    <select {...register(`${field.name}_id`,{
                                        required: {
                                            value: true,
                                            message: `El campo ${field.name} es requerido`
                                        }
                                    })} className="w-full p-2 border border-gray-300 rounded">
                                        <option value="">Seleccione una opción</option>
                                        {selectState[field.name]?.data?.map((option) => (
                                            <option key={option.id} value={option.id}>{option.valor}</option>
                                        ))}
                                    </select>
                                    {errors[field.name] && <Typography className="text-red-500 text-sm font-bold">{errors[field.name].message}</Typography>}
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )
                            }
                        </div>
                    ))}
                    <CardFooter className="flex justify-between">
                        <Button type="button" color="gray" variant="outlined" onClick={() => { navigate(`${currentUrl.replace("/create", "")}`); }}>
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