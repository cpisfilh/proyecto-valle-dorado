import { postCreateCuota } from "@/requests/reqCuotas";
import { postCreatePago } from "@/requests/reqPagos";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Spinner, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const CreateQuota = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id_pago: "", // ID Pago, solo lectura
            numero_cuota: "", // Número de cuota
            monto: "", // Monto
            fecha_pago: null, // Fecha de pago
            fecha_vencimiento: "", // Fecha de vencimiento
            estado: "0" // Estado por defecto
        }
    });
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function onSubmit(data) {
        const currentUrl = window.location.pathname;
        setLoading(true);
        try {
            const resp = await postCreateCuota({...data, estado: data.estado === "0" ? false : true});
            if (resp.message === "exito") {
                Swal.fire({
                    icon: 'success',
                    text: 'Pago registrado con éxito!',
                    customClass: {
                        confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                    }
                });
                navigate(`${currentUrl.replace("/create", "")}`);
            } else {
                Swal.fire({
                    icon: 'error',
                    text: resp.error,
                    customClass: {
                        confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error!',
                customClass: {
                    confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                }
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-4 p-6 text-center rounded-t-lg">
                <Typography variant="h5" color="white">CREAR CUOTA</Typography>
            </CardHeader>
            <CardBody className="px-6 py-4">
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* ID Pago (solo lectura) */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">ID PAGO</label>
                        <Input type="number" {...register("id_pago", {required: "Campo requerido", setValueAs: (value) => value ? Number(value) : null})} />
                        {errors.id_pago && <Typography className="text-red-500 text-sm font-bold">{errors.id_pago.message}</Typography>}
                    </div>

                    {/* Número de cuota */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">Número de cuota</label>
                        <Input type="number" {...register("numero_cuota", { required: "Campo requerido", setValueAs: (value) => value ? Number(value) : null })} />
                        {errors.numero_cuota && <Typography className="text-red-500 text-sm font-bold">{errors.numero_cuota.message}</Typography>}
                    </div>

                    {/* Monto */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">Monto</label>
                        <Input type="number" {...register("monto", { required: "Campo requerido" })} />
                        {errors.monto && <Typography className="text-red-500 text-sm font-bold">{errors.monto.message}</Typography>}
                    </div>

                    {/* Fecha de pago */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">Fecha de pago</label>
                        <Input type="date" {...register("fecha_pago",{setValueAs: (value) => value ? new Date(value) : null})} />
                        {errors.fecha_pago && <Typography className="text-red-500 text-sm font-bold">{errors.fecha_pago.message}</Typography>}
                    </div>

                    {/* Fecha de vencimiento */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">Fecha de vencimiento</label>
                        <Input type="date" {...register("fecha_vencimiento", { required: "Campo requerido", setValueAs: (value) => value ? new Date(value) : null })} />
                        {errors.fecha_vencimiento && <Typography className="text-red-500 text-sm font-bold">{errors.fecha_vencimiento.message}</Typography>}
                    </div>

                    {/* Estado */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">Estado</label>
                        <select {...register("estado", { required: "Campo requerido" })} className="w-full p-2 border border-gray-300 rounded">
                            <option value="0">Pendiente</option>
                            <option value="1">Pagado</option>
                        </select>
                        {errors.estado && <Typography className="text-red-500 text-sm font-bold">{errors.estado.message}</Typography>}
                    </div>

                    <CardFooter className="flex justify-between">
                        <Button type="button" color="gray" variant="outlined" onClick={() => {const currentUrl = window.location.pathname; navigate(`${currentUrl.replace("/create", "")}`); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="blue" disabled={loading}>
                            {loading ? <Spinner color="green" /> : "Crear Cuota"}
                        </Button>
                    </CardFooter>
                    <ToastContainer />
                </form>
            </CardBody>
        </Card>
    );
};

export default CreateQuota;
