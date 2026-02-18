import { getClientes } from "@/requests/reqClientes";
import { getPrediosSelectModal } from "@/requests/reqPredios";
import { Dialog, DialogHeader, DialogBody, Button } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useState } from "react";
import Recibo from "@/pdfs/Recibo";

const tiposPago = ["Transferencia Bancaria", "Depósito en Cuenta", "Yape", "Plin", "Cheque de Gerencia"];

const ReciboModalNew = ({ isOpen, onClose, dataCuota, dataGeneral }) => {
    const [pdfData, setPdfData] = useState(null);
    console.log(dataCuota);

    const { control, register, formState: { errors }, reset, setValue, handleSubmit } = useForm({
        defaultValues: {
            predio: [{
                id: dataGeneral?.predio_id || "",
                manzana: dataGeneral?.predio.manzana || "",
                lote: dataGeneral?.predio.lote || "",
            }],
            tipoPago: "Transferencia Bancaria",
            fecha: dataCuota?.fecha_pago?.split("T")[0] || "",
            montoRecibo: dataCuota?.monto || "",
            montoTotal: dataGeneral?.precio_total || "",
            voucher1: null,
            voucher2: null,
            cliente: dataGeneral?.cliente_pago.map((c) => ({
                id: c.cliente_id,
                nombres: c.cliente_nombre,
                apellidos: c.cliente_apellido,
                dni: c.cliente_dni
            })),
            concepto: dataCuota?.tipo || "MENSUAL",
            // concepto: dataCuota && dataCuota.tipo == "MENSUAL" ? "PAGO DE CUOTA " + dataCuota.numero_cuota : "PARTE DE CUOTA INICIAL",
        }
    })

    const handleFileChange = (e, campo) => {
        const file = e.target.files[0];
        if (file) {
            setValue(campo, file);
        }
    };

    const { fields: prediosFields, append: appendPredio, remove: removePredio } = useFieldArray({
        control,
        name: "predio",
    });

    const { data: predios, isLoading: loadingPredios } = useQuery({
        queryKey: ["predios"],
        queryFn: getPrediosSelectModal
    })

    const { fields: clientesFields, append: appendCliente, remove: removeCliente } = useFieldArray({
        control,
        name: "cliente",
    });

    const { data: clientes, isLoading: loadingClientes } = useQuery({
        queryKey: ["clientes"],
        queryFn: getClientes
    })

    useEffect(() => {
        if (isOpen) {
            reset()
        }
    }, [isOpen])

    const onSubmit = (data) => {
        setPdfData({
            ...data,
            concepto: data.concepto == "MENSUAL" ? "PAGO DE CUOTA " + (dataCuota?.numero_cuota || "") : "PARTE DE CUOTA INICIAL",
        });
    };

    if (loadingPredios || loadingClientes) return <div>Loading...</div>;

    return (
        <Dialog open={isOpen} handler={onClose} size="lg" className="min-h-[400px]">
            <DialogHeader>Ingresar Recibo</DialogHeader>
            <DialogBody className="space-y-4 overflow-auto max-h-[80vh]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-900">Predios</label>
                            <Button onClick={() => appendPredio({ id: "", manzana: "", lote: "" })} color="green" size="sm" className="flex items-center"><Plus className="mr-2" /> Agregar</Button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {
                                prediosFields && prediosFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <select
                                            key={field.id}
                                            {...register(`predio.${index}.id`, {
                                                required: {
                                                    value: true,
                                                    message: "Campo requerido"
                                                }
                                            })}
                                            onChange={(e) => {
                                                const predioSeleccionado = predios.data.find(
                                                    (c) => c.id === Number(e.target.value)
                                                );

                                                if (predioSeleccionado) {
                                                    setValue(`predio.${index}.manzana`, predioSeleccionado.manzana);
                                                    setValue(`predio.${index}.lote`, predioSeleccionado.lote);
                                                }
                                            }}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                                            <option value="">Seleccione...</option>
                                            {
                                                predios.data.map((predio) => (
                                                    <option key={predio.id} value={predio.id}>{predio.manzana} - {predio.lote}</option>
                                                ))
                                            }
                                        </select>

                                        <input
                                            type="hidden"
                                            {...register(`predio.${index}.manzana`, { required: true })}
                                        />

                                        <input
                                            type="hidden"
                                            {...register(`predio.${index}.lote`, { required: true })}
                                        />

                                        <Button onClick={() => removePredio(index)} color="red" size="sm">
                                            <X />
                                        </Button>

                                    </div>
                                ))
                            }
                            {errors.predio && <p className="text-red-500 text-sm">{errors.predio.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-900">Tipo de Pago</label>
                            </div>
                            <div className="flex flex-col gap-2">

                                <select
                                    {...register(`tipoPago`, {
                                        required: {
                                            value: true,
                                            message: "Campo requerido"
                                        }
                                    })}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Seleccione...</option>
                                    {
                                        tiposPago.map((tp) => (
                                            <option key={tp} value={tp}>{tp}</option>
                                        ))
                                    }
                                </select>
                                {errors.tipoPago && <p className="text-red-500 text-sm">{errors.tipoPago.message}</p>}
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-900">Fechas de Pago</label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <input
                                    {...register(`fecha`, {
                                        required: {
                                            value: true,
                                            message: "Campo requerido"
                                        }
                                    })}
                                    type="date"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.fecha && <p className="text-red-500 text-sm">{errors.fecha.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-900">Monto Recibo</label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <input
                                    {...register(`montoRecibo`, {
                                        required: {
                                            value: true,
                                            message: "Campo requerido"
                                        }
                                    })}
                                    type="number"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.montoRecibo && <p className="text-red-500 text-sm">{errors.montoRecibo.message}</p>}
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-900">Monto Total</label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <input
                                    {...register(`montoTotal`, {
                                        required: {
                                            value: true,
                                            message: "Campo requerido"
                                        }
                                    })}
                                    type="number"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.montoTotal && <p className="text-red-500 text-sm">{errors.montoTotal.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-900">Voucher 1</label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => handleFileChange(e, 'voucher1')}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-900">Voucher 2</label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => handleFileChange(e, 'voucher2')}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-900">Clientes</label>
                            <Button onClick={() => appendCliente({ nombre: "", dni: "" })} color="green" size="sm" className="flex items-center"><Plus className="mr-2" /> Agregar</Button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {
                                clientesFields && clientesFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <select
                                            {...register(`cliente.${index}.id`, { required: true })}
                                            onChange={(e) => {
                                                const clienteSeleccionado = clientes.data.find(
                                                    (c) => c.id === Number(e.target.value)
                                                );

                                                if (clienteSeleccionado) {
                                                    setValue(`cliente.${index}.nombres`, clienteSeleccionado.nombres);
                                                    setValue(`cliente.${index}.apellidos`, clienteSeleccionado.apellidos);
                                                    setValue(`cliente.${index}.dni`, clienteSeleccionado.dni);
                                                }
                                            }}
                                            className="block w-full rounded-lg border p-2.5 text-sm"
                                        >
                                            <option value="">Seleccione...</option>
                                            {
                                                clientes.data.map((cliente) => (
                                                    <option key={cliente.id} value={cliente.id}>{cliente.nombres} - {cliente.apellidos}</option>
                                                ))
                                            }
                                        </select>
                                        <input
                                            type="hidden"
                                            {...register(`cliente.${index}.nombres`, { required: true })}
                                        />

                                        <input
                                            type="hidden"
                                            {...register(`cliente.${index}.dni`, { required: true })}
                                        />
                                        <Button onClick={() => removeCliente(index)} color="red" size="sm">
                                            <X />
                                        </Button>

                                    </div>
                                ))
                            }
                            {errors.cliente && <p className="text-red-500 text-sm">{errors.cliente.message}</p>}
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-900">Concepto</label>
                        </div>
                        <select
                            {...register("concepto", { required: true })}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="MENSUAL">MENSUAL</option>
                            <option value="INICIAL">PARTE CUOTA INICIAL</option>
                        </select>
                        {errors.concepto && <p className="text-red-500 text-sm">{errors.concepto.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button type="submit" className="w-full">Generar Recibo</Button>
                        {pdfData && (
                            <PDFDownloadLink
                                document={<Recibo data={pdfData} />}
                                fileName={`recibo${pdfData.concepto}_${dataGeneral?.predio?.manzana || ""}${dataGeneral?.predio?.lote || ""}.pdf`}
                            >
                                {({ loading }) => (
                                    <Button color="green" className="w-full" disabled={loading}>
                                        {loading ? "Generando PDF..." : "Descargar Recibo"}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>

                </form>
            </DialogBody>
        </Dialog>
    );
};

export default ReciboModalNew;
