import * as XLSX from "xlsx";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
    Card,
    CardHeader,
    Typography,
    CardBody,
    CardFooter,
    Spinner,
} from "@material-tailwind/react";
import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { format, addMonths, parseISO } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { postCreateCuota, postCreateCuotaInicial, postGenerarCuotas } from "@/requests/reqCuotas";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const GenerarCuotasModal = ({ isOpen, onClose, dataGeneral, dataCuotas }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id_pago: dataGeneral.id, // ID Pago, solo lectura
            numero_cuotas: null, // Número de cuota
            fecha_referencia: null, // Fecha de pago
        }
    });
    console.log(dataGeneral);

    async function onSubmit(data) {
        console.log(data);
        const currentUrl = window.location.pathname;
        setLoading(true);
        try {
            const resp = await postGenerarCuotas({ ...data,precioTotal:dataGeneral.precio_total,cuotaInicial:dataGeneral.cuota_inicial });
            if (resp.message === "exito") {
                Swal.fire({
                    icon: 'success',
                    text: 'Pago registrado con éxito!',
                    customClass: {
                        confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                    }
                });
                onClose()
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
        <Dialog open={isOpen} handler={onClose} size="lg">
            <DialogHeader>Generar Cuotas</DialogHeader>
            <DialogBody className="space-y-4 overflow-auto max-h-[80vh]">
                <Card>
                    <CardBody className="px-6 py-4">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* Número de cuotas */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">Número de cuotas</label>
                                <Input type="number" {...register("numero_cuotas", { required: "Campo requerido" })} />
                                {errors.numero_cuotas && <Typography className="text-red-500 text-sm font-bold">{errors.numero_cuotas.message}</Typography>}
                            </div>

                            {/* Fecha de primera cuota */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">Fecha de primera cuota</label>
                                <Input type="date" {...register("fecha_referencia", { setValueAs: (value) => value ? new Date(value) : null })} />
                                {errors.fecha_referencia && <Typography className="text-red-500 text-sm font-bold">{errors.fecha_referencia.message}</Typography>}
                            </div>

                            <CardFooter className="flex justify-between">
                                <Button type="submit" color="blue" disabled={loading}>
                                    {loading ? <Spinner color="green" /> : "Crear Cuota"}
                                </Button>
                            </CardFooter>
                            <ToastContainer />
                        </form>
                    </CardBody>
                </Card>
            </DialogBody>
        </Dialog>
    );
};

export default GenerarCuotasModal;
