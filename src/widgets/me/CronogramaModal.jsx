import * as XLSX from "xlsx";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
} from "@material-tailwind/react";
import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { format, addMonths,parseISO } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const CronogramaModal = ({ isOpen, onClose,dataGeneral,dataCuotas }) => {
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            fechaInicial: dataGeneral?.fecha_cuota_inicial ? dataGeneral.fecha_cuota_inicial.split("T")[0] : "",
            montoInicial: dataGeneral && dataGeneral.cuota_inicial,
            montoTotal: dataGeneral && dataGeneral.precio_total,
            nombreArchivo: dataGeneral && `Cronograma${dataGeneral.predio.manzana}-${dataGeneral.predio.lote}`,
            persona: dataGeneral && dataGeneral.cliente_pago.map((persona) => ({ nombre: persona.cliente_nombre + " " + persona.cliente_apellido, dni: persona.cliente_dni,extra:"-" })),
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "persona" });

    const mesesEnEspanol = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Set", "Oct", "Nov", "Dic"
    ];

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return `${date.getDate()}-${mesesEnEspanol[date.getMonth()]}-${date.getFullYear()}`;
    };

    const onSubmit = (data) => {
        console.log("Datos del recibo:", data);
        handleExport(data); // Generar el Excel con la información ingresada
    };

    const handleExport = async (formData) => {
        if (!formData.fechaInicial) {
            console.error("Error: La fecha inicial está vacía o es inválida.");
            return;
        }
    
        // Convertimos la fecha inicial
        const [year, month, day] = formData.fechaInicial.split("-").map(Number);
        const fechaInicial = new Date(year, month - 1, day, 12);
        if (isNaN(fechaInicial.getTime())) {
            console.error("Error: La fecha inicial no es válida.");
            return;
        }
    
        // 📌 Extraer montos y fechas desde `dataCuotas`
        const cuotasOrdenadas = [...dataCuotas.data].sort((a, b) => a.numero_cuota - b.numero_cuota);
        const montos = cuotasOrdenadas.map(cuota => parseFloat(cuota.monto)); // Convertimos a número
        const fechas = cuotasOrdenadas.map(cuota => formatearFecha(new Date(cuota.fecha_vencimiento)));
    
        // 📌 Crear archivo Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(formData.nombreArchivo || "Cronograma");

        let startRow = 2; // Fila donde comienzan los clientes
    
        // 📌 Agregar los datos de clientes
        worksheet.addRow(["", "", "", "", "DNI"]);
        formData.persona.forEach((p, index) => {
            const row = startRow + index;
            worksheet.addRow(["Cliente", p.nombre, "", "", p.dni]);
             // 📌 Combinar celdas de "Cliente" (columna B y D)
             worksheet.mergeCells(row, 2, row, 4);
            startRow++;
        });
        
    
        worksheet.addRow([]); // Espacio vacío
        worksheet.addRow(["", "Inicial"]);
        
        // 📌 Usar fechas y montos extraídos
        const fechaRow = worksheet.addRow(["", formatearFecha(fechaInicial), ...fechas]); // Fechas de vencimiento
        const montoRow = worksheet.addRow(["", formData.montoInicial, ...montos]); // Montos de cuotas
    
        worksheet.addRow([]); // Espacio vacío
        worksheet.addRow(["", "Monto total", formData.montoTotal]);
    
        // 📌 Aplicar estilos a las fechas
        fechaRow.eachCell((cell, colNumber) => {
            if (colNumber > 1) {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFF00" }, // Amarillo
                };
                cell.font = { bold: true };
                cell.alignment = { horizontal: "center" };
            }
        });
    
        // 📌 Aplicar bordes a las celdas con datos
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                if (cell.value) { 
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                }
            });
        });
    
        // 📌 Ajustar tamaño de columnas
        worksheet.columns.forEach((column) => {
            column.width = 15;
        });
    
        // 📌 Guardar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${formData.nombreArchivo || "Cronograma"}.xlsx`);
    };
    
    
    
    return (
        <Dialog open={isOpen} handler={onClose} size="lg">
            <DialogHeader>Datos para generar cronograma</DialogHeader>
            <DialogBody className="space-y-4 overflow-auto max-h-[80vh]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nombre Archivo */}
                <div>
                        <Input
                            label="Nombre de Archivo"
                            {...register("nombreArchivo", { required: "Este campo es obligatorio" })}
                        />
                        {errors.nombreArchivo && (
                            <p className="text-red-500 text-sm">{errors.nombreArchivo.message}</p>
                        )}
                    </div>
                    {/* Fecha Inicial */}
                    <div>
                        <Input
                            label="Fecha de Pago"
                            type="date"
                            {...register("fechaInicial", { required: "Este campo es obligatorio" })}
                        />
                        {errors.fechaInicial && (
                            <p className="text-red-500 text-sm">{errors.fechaInicial.message}</p>
                        )}
                    </div>

                    {/* Monto Inicial */}
                    <div>
                        <Controller
                            name="montoInicial"
                            control={control}
                            rules={{ required: "Este campo es obligatorio" }}
                            render={({ field }) => <Input label="Monto Inicial" type="number" {...field} />}
                        />
                        {errors.montoInicial && (
                            <p className="text-red-500 text-sm">{errors.montoInicial.message}</p>
                        )}
                    </div>

                    {/* Monto Total */}
                    <div>
                        <Controller
                            name="montoTotal"
                            control={control}
                            rules={{ required: "Este campo es obligatorio" }}
                            render={({ field }) => <Input label="Monto Total" type="number" {...field} />}
                        />
                        {errors.montoTotal && (
                            <p className="text-red-500 text-sm">{errors.montoTotal.message}</p>
                        )}
                    </div>

                    {/* Sección de Personas */}
                    <div>
                        <h3 className="font-semibold">Personas</h3>
                        <div className="flex flex-col gap-3 mt-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex flex-col md:flex-row gap-2">
                                    <Input
                                        className="w-full"
                                        label="Nombre"
                                        {...register(`persona.${index}.nombre`, {
                                            required: "Este campo es obligatorio",
                                        })}
                                    />
                                    <Input
                                        className="w-full"
                                        label="DNI"
                                        {...register(`persona.${index}.dni`, {
                                            required: "Este campo es obligatorio",
                                        })}
                                    />
                                    <Input
                                        className="w-full"
                                        label="Extra"
                                        {...register(`persona.${index}.extra`, {
                                            required: "Este campo es obligatorio",
                                        })}
                                    />
                                    <Button color="red" size="sm" onClick={() => remove(index)}>
                                        X
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {errors.persona && (
                            <p className="text-red-500 text-sm">Debe haber al menos una persona</p>
                        )}
                        <Button
                            color="blue"
                            variant="outlined"
                            onClick={() => append({ nombre: "", dni: "", extra: "" })}
                        >
                            + Agregar Persona
                        </Button>
                    </div>

                    <DialogFooter className="space-x-2 flex flex-wrap">
                        <Button color="gray" variant="outlined" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="blue">
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogBody>
        </Dialog>
    );
};

export default CronogramaModal;
