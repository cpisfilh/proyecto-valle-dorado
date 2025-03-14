import Recibo from "@/pdfs/Recibo";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Button, Select, Option } from "@material-tailwind/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

const SelectPredioModal = ({ isOpen, onClose }) => {
    const { handleSubmit, register, formState: { errors }, watch } = useForm();

    const onSubmit = (data) => {
        console.log("Datos del recibo:", data);
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="md">
            <DialogHeader>Relacionar Predios a un Cliente</DialogHeader>
            <DialogBody className="space-y-4 overflow-auto max-h-[80vh]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/*Cliente */}
                    <label className="block text-sm font-medium text-gray-900">Cliente </label>
                    <div>
                        <select {...register("cliente")} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                            <option value="Efectivo">Efectivo</option>
                        </select>
                        {errors.tipoPago && <p className="text-red-500 text-sm">{errors.tipoPago.message}</p>}
                    </div>

                    {errors.montoReciboTexto && <p className="text-red-500 text-sm">{errors.montoReciboTexto.message}</p>}

                    {/* Predio */}
                    <label className="block text-sm font-medium text-gray-900">Predio </label>
                    <div>
                        <select {...register("predio")} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                            <option value="Efectivo">Efectivo</option>
                        </select>
                        {errors.tipoPago && <p className="text-red-500 text-sm">{errors.tipoPago.message}</p>}
                    </div>
                    {errors.montoReciboTexto && <p className="text-red-500 text-sm">{errors.montoReciboTexto.message}</p>}

                    <DialogFooter className="space-x-2 flex flex-wrap">
                        <Button color="gray" variant="outlined" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" color="blue">Guardar</Button>

                    </DialogFooter>
                </form>
            </DialogBody>
        </Dialog>
    );
};

export default SelectPredioModal;
