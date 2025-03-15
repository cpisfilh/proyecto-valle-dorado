import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Spinner } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import SelectPredioModal from "./SelectPredioModal";
import SelectClienteModal from "./SelectClienteModal";
import { useState } from "react";
import Swal from "sweetalert2";
import { postRelateClientProperty } from "@/requests/reqPredios";

const PredioxClienteModal = ({ isOpen, onClose, dataClientes, dataPredios,refresh }) => {
    const { handleSubmit, register, formState: { errors }, reset } = useForm({
        predio:"",
        cliente:""
    });
    const [isOpenSelectPredioModal, setIsOpenSelectPredioModal] = useState(false);
    const [isOpenSelectClienteModal, setIsOpenSelectClienteModal] = useState(false);
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const resp = await postRelateClientProperty(Number(data.cliente), Number(data.predio))
            if (resp.message === "exito") {
                Swal.fire({
                    icon: 'success',
                    text: 'Relación registrada!',
                    customClass: {
                        confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                    },
                    target: document.getElementById('pxcParentModal')
                }).then(() => {
                    onClose()
                    refresh()
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'Ocurrió un error!',
                    customClass: {
                        confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                    },
                    target: document.getElementById('pxcParentModal')
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error!',
                customClass: {
                    confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                },
                target: document.getElementById('pxcParentModal')
            })
        }finally{
            setLoading(false)
            reset()
        }
    };

    function handleCloseSelectClienteModal() {
        setIsOpenSelectClienteModal(true);
    }

    function handleCloseSelectPredioModal() {
        setIsOpenSelectPredioModal(false);
    }
    return (
        <Dialog id="pxcParentModal" open={isOpen} handler={onClose} size="md">
            <DialogHeader>Relacionar Predios a un Cliente</DialogHeader>
            <DialogBody className="space-y-4 overflow-auto max-h-[80vh]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/*Cliente */}
                    <label className="block text-sm font-medium text-gray-900">Cliente </label>
                    <div>
                        <select {...register("cliente", { required: true })} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                            <option value="">Seleccione un cliente</option>
                            {dataClientes.map((item) => (
                                <option key={item.id} value={item.id}>{item.dni + " - " + item.nombres + " " + item.apellidos}</option>
                            ))}
                        </select>
                        {errors.tipoPago && <p className="text-red-500 text-sm">{errors.tipoPago.message}</p>}
                    </div>

                    {errors.montoReciboTexto && <p className="text-red-500 text-sm">{errors.montoReciboTexto.message}</p>}

                    {/* Predio */}
                    <label className="block text-sm font-medium text-gray-900">Predio </label>
                    <div>
                        <select {...register("predio", { required: true })} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                            <option value="">Seleccione un Predio</option>
                            {dataPredios.map((item) => (
                                <option key={item.id} value={item.id}>{item.manzana + " - " + item.lote}</option>
                            ))}
                        </select>
                        {errors.tipoPago && <p className="text-red-500 text-sm">{errors.tipoPago.message}</p>}
                    </div>
                    {errors.montoReciboTexto && <p className="text-red-500 text-sm">{errors.montoReciboTexto.message}</p>}

                    <DialogFooter className="space-x-2 flex flex-wrap">
                        <Button color="gray" variant="outlined" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" color="blue">
                            {
                                loading ? <Spinner /> : "Guardar"
                            }
                        </Button>

                    </DialogFooter>
                </form>
            </DialogBody>
            <SelectPredioModal isOpen={isOpenSelectPredioModal} onClose={handleCloseSelectPredioModal} />
            <SelectClienteModal isOpen={isOpenSelectClienteModal} onClose={handleCloseSelectClienteModal} />
        </Dialog>
    );
};

export default PredioxClienteModal;
