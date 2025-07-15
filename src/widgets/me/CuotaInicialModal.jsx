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
import { format, addMonths,parseISO } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { postCreateCuota, postCreateCuotaInicial, postCreateCuotaMensual } from "@/requests/reqCuotas";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const CuotaInicialModal = ({ isOpen, onClose,dataGeneral,dataCuotas,tipo }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id_pago: dataGeneral.id, // ID Pago, solo lectura
            numero_cuota: null, // Número de cuota
            monto: "", // Monto
            fecha_pago: null, // Fecha de pago
            fecha_vencimiento: null, // Fecha de vencimiento
            estado: "0", // Estado por defecto
            tipo: tipo
        }
    });

    async function onSubmit(data) {
            const currentUrl = window.location.pathname;
            setLoading(true);
            try {
                const resp = tipo==="MENSUAL" ? await postCreateCuotaMensual({...data, estado: data.estado === "0" ? false : true}) :  await postCreateCuotaInicial({...data, estado: data.estado === "0" ? false : true});
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
            <DialogHeader>Generar pago de cuota inicial</DialogHeader>
            <DialogBody className="space-y-4 overflow-auto max-h-[80vh]">
            <Card>
            <CardBody className="px-6 py-4">
                <form onSubmit={handleSubmit(onSubmit)}>

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
                        <Input type="date" {...register("fecha_vencimiento",{setValueAs: (value) => value ? new Date(value) : null})} />
                        {errors.fecha_vencimiento && <Typography className="text-red-500 text-sm font-bold">{errors.fecha_vencimiento.message}</Typography>}
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

export default CuotaInicialModal;
