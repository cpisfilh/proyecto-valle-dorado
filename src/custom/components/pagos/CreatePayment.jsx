import { postCreatePagoXPredios } from "@/requests/reqPagos";
import usePaymentsStore from "@/store/usePaymentsStore";
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
            fechaReferencia: null,
            numeroCuotas: null,
            predios: [""]
        }
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const dataClientes = location.state?.resultsClientes || [];
    const dataPredios = location.state?.resultsPredios || [];

    // Obtenemos el array de clientes desde el formulario
  const clientes = watch("clientes");

    // Obtenemos el array de predios desde el formulario
    const predios = watch("predios");


    async function onSubmit(data) {
        const currentUrl = window.location.pathname;
        setLoading(true);
        // Crear la fecha en local y ajustarla a medianoche en UTC

    const fecha_pagon = new Date(data.fechaReferencia);
    fecha_pagon.setUTCHours(0, 0, 0, 0);

    const fecha_pago_ajustada = fecha_pagon.toISOString();
        try {
            const resp = await postCreatePagoXPredios({ ...data, fechaCuotaInicial: fecha_pago_ajustada });
            if(resp.message === "exito") {
                Swal.fire({
                    icon: 'success',
                    text: 'Pago registrado con exito!',
                    customClass: {
                        confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                    }
                })
                usePaymentsStore.getState().setShouldReloadPagos(true);
                navigate(`${currentUrl.replace("/create", "")}`);
            }else{
                Swal.fire({
                    icon: 'error',
                    text: resp.error || 'Ocurrio un error!',
                    customClass: {
                        confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                    }
                })
            }
        } catch (error) {
          console.log(error);
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

    // Agregar un nuevo select de predio
    const addPredio = () => {
        setValue("predios", [...predios, ""]);
    };

    // Eliminar un select de cliente
    const removeCliente = (index) => {
        const newClientes = [...clientes];
        newClientes.splice(index, 1);
        setValue("clientes", newClientes);
    };

    // Eliminar un select de predio
    const removePredio = (index) => {
        const newPredios = [...predios];
        newPredios.splice(index, 1);
        setValue("predios", newPredios);
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

                    {/* Fecha Cuota Inicial */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">FECHA DE REFERENCIA</label>
                        <Input type="date" {...register("fechaReferencia", { required: "El campo Fecha Cuota Inicial es requerido" })} />
                        {errors.fechaReferencia && <Typography className="text-red-500 text-sm font-bold">{errors.fechaReferencia.message}</Typography>}
                    </div>

                    {/* Predio */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">Predio</label>
                        {predios.map((_, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <select
                                    {...register(`predios.${index}`, {
                                        required: "Debe seleccionar un predio",
                                        setValueAs: (value) => (value ? Number(value) : null)
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Seleccione un predio</option>
                                    {dataPredios.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.manzana + " - " + option.lote}
                                        </option>
                                    ))}
                                </select>
                                <Button
                                    type="button"
                                    color="red"
                                    variant="text"
                                    onClick={() => removePredio(index)}
                                    disabled={predios.length === 1}
                                >
                                    ✖
                                </Button>
                            </div>
                        ))}
                        <Button type="button" color="blue" onClick={addPredio}>
                            + Agregar Predio
                        </Button>
                        {errors.predios && <Typography className="text-red-500 text-sm font-bold">{errors.predios.message}</Typography>}
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
