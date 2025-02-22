import Recibo from "@/pdfs/Recibo";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Button, Select, Option } from "@material-tailwind/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

const manzanas = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
const lotes = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, "0"));
const tiposPago = ["Transferencia Bancaria", "Depósito en Cuenta", "Cheque de Gerencia"];

const ReciboModal = ({ isOpen, onClose }) => {
    const { control, handleSubmit, register, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            tipoPago: "",
            fecha: "",
            montoRecibo: "",
            montoReciboTexto: "",
            centavosRecibo: "00",
            montoTotal: "",
            montoTotalTexto: "",
            centavosTotal: "00",
            predio: {
                manzana: "",
                lote: "",
            },
            persona: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "persona"
    });

    const onSubmit = (data) => {
        console.log("Datos del recibo:", data);
    };

    const formValues = watch(); // Obtenemos todos los valores del formulario

    const isFormComplete = () => {
        return (
            formValues.tipoPago &&
            formValues.fecha &&
            formValues.montoRecibo &&
            formValues.montoReciboTexto &&
            formValues.centavosRecibo &&
            formValues.montoTotal &&
            formValues.montoTotalTexto &&
            formValues.centavosTotal &&
            formValues.predio.manzana &&
            formValues.predio.lote &&
            formValues.persona.length > 0 &&
            formValues.persona.every(p => p.nombre && p.dni) // Validar que todas las personas tengan nombre y DNI
        );
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="lg">
            <DialogHeader>Ingresar Recibo</DialogHeader>
            <DialogBody className="space-y-4 overflow-auto max-h-[80vh]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="w-full">
                            <Controller
                                name="predio.manzana"
                                control={control}
                                rules={{ required: "Este campo es obligatorio" }}
                                render={({ field }) => (
                                    <Select {...field} label="Manzana">
                                        {manzanas.map((m) => (
                                            <Option key={m} value={m}>{m}</Option>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.predio?.manzana && <p className="text-red-500 text-sm">{errors.predio.manzana.message}</p>}
                        </div>

                        <div className="w-full">
                            <Controller
                                name="predio.lote"
                                control={control}
                                rules={{ required: "Este campo es obligatorio" }}
                                render={({ field }) => (
                                    <Select {...field} label="Lote">
                                        {lotes.map((l) => (
                                            <Option key={l} value={l}>{l}</Option>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.predio?.lote && <p className="text-red-500 text-sm">{errors.predio.lote.message}</p>}
                        </div>
                    </div>

                    {/* Tipo de Pago */}
                    <div>
                        <Controller
                            name="tipoPago"
                            control={control}
                            rules={{ required: "Este campo es obligatorio" }}
                            render={({ field }) => (
                                <Select {...field} label="Tipo de Pago">
                                    {tiposPago.map((tp) => (
                                        <Option key={tp} value={tp}>{tp}</Option>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.tipoPago && <p className="text-red-500 text-sm">{errors.tipoPago.message}</p>}
                    </div>

                    {/* Fecha */}
                    <div>
                        <Input label="Fecha de Pago" {...register("fecha", { required: "Este campo es obligatorio" })} />
                        {errors.fecha && <p className="text-red-500 text-sm">{errors.fecha.message}</p>}
                    </div>

                    {/* Monto Recibo */}
                    <div>
                        <Controller
                            name="montoRecibo"
                            control={control}
                            rules={{ required: "Este campo es obligatorio" }}
                            render={({ field }) => (
                                <Input
                                    label="Monto Recibo"
                                    value={field.value}
                                    {...register("montoRecibo", { required: "Este campo es obligatorio" })}
                                />
                            )}
                        />
                        {errors.montoRecibo && <p className="text-red-500 text-sm">{errors.montoRecibo.message}</p>}
                    </div>

                    {/* Monto Recibo Texto */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                        <Input className="w-full " label="Monto en Letras" {...register("montoReciboTexto", { required: "Este campo es obligatorio" })} />
                        <div className="flex gap-2 w-full">
                            <span className="flex items-center">nuevos soles con</span>
                            <Input label="Céntimos (/100)" {...register("centavosRecibo", { required: "Este campo es obligatorio" })} />
                        </div>
                    </div>

                    {errors.montoReciboTexto && <p className="text-red-500 text-sm">{errors.montoReciboTexto.message}</p>}


                    {/* Monto Total */}
                    <div>
                        <Controller
                            name="montoTotal"
                            control={control}
                            rules={{ required: "Este campo es obligatorio" }}
                            render={({ field }) => (
                                <Input
                                    label="Monto Total"
                                    value={field.value}
                                    {...register("montoTotal", { required: "Este campo es obligatorio" })}
                                />
                            )}
                        />
                        {errors.montoTotal && <p className="text-red-500 text-sm">{errors.montoTotal.message}</p>}
                    </div>

                    {/* Monto Total Texto */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                        <Input className="w-full" label="Monto en Letras" {...register("montoTotalTexto", { required: "Este campo es obligatorio" })} />
                        <div className="flex gap-2 w-full">
                            <span className="flex items-center">nuevos soles con</span>
                            <Input label="Céntimos (/100)" {...register("centavosTotal", { required: "Este campo es obligatorio" })} />
                        </div>
                    </div>
                    {errors.montoTotalTexto && <p className="text-red-500 text-sm">{errors.montoTotalTexto.message}</p>}

                    {/* Sección de Personas */}
                    <div>
                        <h3 className="font-semibold">Personas</h3>
                        <div className="flex flex-col gap-3 mt-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex flex-col md:flex-row gap-2">
                                    <Input
                                        className="w-full"
                                        label="Nombre"
                                        {...register(`persona.${index}.nombre`, { required: "Este campo es obligatorio" })}
                                    />
                                    <Input
                                        className="w-full"
                                        label="DNI"
                                        {...register(`persona.${index}.dni`, { required: "Este campo es obligatorio" })}
                                    />
                                    <div className="flex justify-end">
                                    <Button color="red" size="sm" className="w-24" onClick={() => remove(index)}>X</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.persona && <p className="text-red-500 text-sm">Debe haber al menos una persona</p>}
                        <Button color="blue" variant="outlined" onClick={() => append({ nombre: "", dni: "" })}>+ Agregar Persona</Button>
                    </div>

                    <DialogFooter className="space-x-2 flex flex-wrap">
                        <Button color="gray" variant="outlined" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" color="blue">Guardar</Button>
                        {
                            isFormComplete() && (
                                <PDFDownloadLink
                            document={<Recibo data={watch()} />}
                            fileName="recibo.pdf"
                        >
                            <Button variant="gradient" color="green">Generar Recibo</Button>
                        </PDFDownloadLink>
                            )
                        }
                        
                    </DialogFooter>
                </form>
            </DialogBody>
        </Dialog>
    );
};

export default ReciboModal;
