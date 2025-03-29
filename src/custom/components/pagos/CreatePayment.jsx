import { postCreatePago } from "@/requests/reqPagos";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Spinner, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const CreatePayment = () => {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            clientes: [""], // Iniciamos con un cliente vacío
            precioTotal: null,
            cuotaInicial: null,
            numeroCuotas: null,
            saldo: null,
            predio: ""
        }
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const dataClientes = location.state?.resultsClientes || [];
    const dataPredios = location.state?.resultsPredios || [];

    // Obtenemos el array de clientes desde el formulario
    const clientes = watch("clientes");

    async function onSubmit(data) {
        const currentUrl = window.location.pathname;
        setLoading(true);
        try {
            const resp = await postCreatePago(data);
            if(resp.message === "exito") {
                Swal.fire({
                    icon: 'success',
                    text: 'Pago registrado con exito!',
                    customClass: {
                        confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                    }
                })
                navigate(`${currentUrl.replace("/create", "")}`);
            }else{
                Swal.fire({
                    icon: 'error',
                    text: 'Ocurrio un error!',
                    customClass: {
                        confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                    }
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocurrio un error!',
                customClass: {
                    confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                }
            })
        }finally{
            setLoading(false);
        }
    }

    // Agregar un nuevo select de cliente
    const addCliente = () => {
        setValue("clientes", [...clientes, ""]);
    };

    // Eliminar un select de cliente
    const removeCliente = (index) => {
        const newClientes = [...clientes];
        newClientes.splice(index, 1);
        setValue("clientes", newClientes);
    };

    return (
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-4 p-6 text-center rounded-t-lg">
                <Typography variant="h5" color="white">
                    CREAR PAGO
                </Typography>
            </CardHeader>
            <CardBody className="px-6 py-4">
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Clientes - Selección múltiple */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">CLIENTES</label>
                        {clientes.map((_, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <select
                                    {...register(`clientes.${index}`, {
                                        required: "Debe seleccionar un cliente",
                                        setValueAs: (value) => (value ? Number(value) : null)
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Seleccione un cliente</option>
                                    {dataClientes.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.dni + " - " + option.nombres + " " + option.apellidos}
                                        </option>
                                    ))}
                                </select>
                                <Button
                                    type="button"
                                    color="red"
                                    variant="text"
                                    onClick={() => removeCliente(index)}
                                    disabled={clientes.length === 1}
                                >
                                    ✖
                                </Button>
                            </div>
                        ))}
                        <Button type="button" color="blue" onClick={addCliente}>
                            + Agregar Cliente
                        </Button>
                        {errors.clientes && <Typography className="text-red-500 text-sm font-bold">{errors.clientes.message}</Typography>}
                    </div>

                    {/* Precio Total */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">PRECIO TOTAL</label>
                        <Input type="number" {...register("precioTotal", { required: "El campo Precio Total es requerido" })} />
                        {errors.precioTotal && <Typography className="text-red-500 text-sm font-bold">{errors.precioTotal.message}</Typography>}
                    </div>

                    {/* Número de cuotas */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">NÚMERO DE CUOTAS</label>
                        <Input type="number" {...register("numeroCuotas", { required: "El campo Número de cuotas es requerido" })} />
                        {errors.numeroCuotas && <Typography className="text-red-500 text-sm font-bold">{errors.numeroCuotas.message}</Typography>}
                    </div>

                    {/* Cuota Inicial */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">CUOTA INICIAL</label>
                        <Input type="number" {...register("cuotaInicial", { required: "El campo Cuota Inicial es requerido" })} />
                        {errors.cuotaInicial && <Typography className="text-red-500 text-sm font-bold">{errors.cuotaInicial.message}</Typography>}
                    </div>

                    {/* Saldo */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">SALDO</label>
                        <Input type="number" {...register("saldo", { required: "El campo Saldo es requerido" })} />
                        {errors.saldo && <Typography className="text-red-500 text-sm font-bold">{errors.saldo.message}</Typography>}
                    </div>

                    {/* Predio */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">Predio</label>
                        <select {...register("predio", { required: "El campo Predio es requerido", setValueAs: (value) => (value ? Number(value) : null) })} className="w-full p-2 border border-gray-300 rounded">
                            <option value="">Seleccione una opción</option>
                            {dataPredios.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.manzana + " - " + option.lote}
                                </option>
                            ))}
                        </select>
                        {errors.predio && <Typography className="text-red-500 text-sm font-bold">{errors.predio.message}</Typography>}
                    </div>

                    <CardFooter className="flex justify-between">
                        <Button type="button" color="gray" variant="outlined" onClick={() => {const currentUrl = window.location.pathname; navigate(`${currentUrl.replace("/create", "")}`); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="blue" disabled={loading}>
                            {loading ? <Spinner color="green" /> : "Crear Pago"}
                        </Button>
                    </CardFooter>
                    <ToastContainer />
                </form>
            </CardBody>
        </Card>
    );
};

export default CreatePayment;
