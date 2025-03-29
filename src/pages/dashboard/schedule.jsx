import Recibo from "@/pdfs/Recibo";
import axiosInstance from "@/requests/axiosConfig";
import ReciboModal from "@/widgets/me/ReciboModal";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardHeader, Spinner } from "@material-tailwind/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Schedule = () => {
    const location = useLocation();
    const data = location.state?.data;
    const [cuotasxPago, setCuotasxPago] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [cuotaGenerarRecibo, setCuotaGenerarRecibo] = useState();

    async function getCuotasxPago() {
        try {
            const response = await axiosInstance.post("/cuota/getCuotaXPago", { id_pago: data.id });
            setCuotasxPago(response.data);
        } catch (error) {
            throw Error(error);
        }
    }

    async function pagarCuota(id) {
        try {
            const result = await Swal.fire({
                icon: 'question',
                text: '¿Desea pagar la cuota?',
                showDenyButton: true,
                confirmButtonText: 'Si',
                denyButtonText: 'No',
                customClass: {
                    confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600',
                    denyButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                }
            });

            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Procesando...',
                    text: 'Por favor, espere...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const fecha_pagon = new Date();
                const fecha_pago_ajustada = new Date(fecha_pagon.setHours(0, 0, 0, 0)).toISOString();
                const resp = await axiosInstance.post("/cuota/pay", { id, fecha_pago: fecha_pago_ajustada });

                if (resp.data.message === "exito") {
                    Swal.fire({
                        icon: 'success',
                        text: 'Cuota cancelada!',
                        customClass: {
                            confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                        }
                    }).then(() => {
                        getCuotasxPago();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: resp.error || 'Ocurrió un error inesperado',
                        customClass: {
                            confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                        }
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error!',
                customClass: {
                    confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                }
            });
        }
    }

    async function revertirpagarCuota(id) {
        try {
            const result = await Swal.fire({
                icon: 'question',
                text: '¿Desea revertir el pago de la cuota?',
                showDenyButton: true,
                confirmButtonText: 'Si',
                denyButtonText: 'No',
                customClass: {
                    confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600',
                    denyButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                }
            });

            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Procesando...',
                    text: 'Por favor, espere...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                const fecha_pago = new Date()
                const resp = await axiosInstance.post("/cuota/revertpay", { id, fecha_pago });

                if (resp.data.message === "exito") {
                    Swal.fire({
                        icon: 'success',
                        text: 'Cuota revertida!',
                        customClass: {
                            confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                        }
                    }).then(() => {
                        getCuotasxPago();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: resp.error || 'Ocurrió un error inesperado',
                        customClass: {
                            confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                        }
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error!',
                customClass: {
                    confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                }
            });
        }
    }

    function handleModalOpen(data) {
        setCuotaGenerarRecibo(data);
    }

    useEffect(() => {
        getCuotasxPago();
    }, []);

    useEffect(() => {
        if (cuotaGenerarRecibo) {
            setModalOpen(true);
        }
    }, [cuotaGenerarRecibo]);

    return (
        <div className="container mx-auto">
            {/* Título */}
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                Cronograma de Pagos - Predio {data?.predio.manzana} {data?.predio.lote}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Información del Cliente */}
                <Card className="mb-6 shadow-lg">
                    <CardHeader floated={false} shadow={false} className="bg-blue-700 p-4">
                        <h2 className="text-white text-lg font-bold">Información del Cliente</h2>
                    </CardHeader>
                    <CardBody>
                        {data?.cliente_pago.map((cliente, index) => (
                            <div key={index} className="border-b pb-2 mb-2">
                                <p className="text-lg font-medium">
                                    <span className="text-blue-700 font-bold">DNI:</span> {cliente.cliente_dni}
                                </p>
                                <p className="text-lg">
                                    <span className="text-blue-700 font-bold">Nombre:</span> {cliente.cliente_nombre}{" "}
                                    {cliente.cliente_apellido}
                                </p>
                            </div>
                        ))}
                    </CardBody>
                </Card>

                {/* Resumen Financiero */}
                <Card className="mb-6 shadow-lg">
                    <CardHeader floated={false} shadow={false} className="bg-green-700 p-4">
                        <h2 className="text-white text-lg font-bold">Resumen Financiero</h2>
                    </CardHeader>
                    <CardBody>
                        <p className="text-lg">
                            <span className="text-green-700 font-bold">Monto Total:</span> S/ {data?.precio_total}
                        </p>
                        <p className="text-lg">
                            <span className="text-green-700 font-bold">Cuota Inicial:</span> S/ {data?.cuota_inicial}
                        </p>
                        <p className="text-lg">
                            <span className="text-green-700 font-bold">Saldo Inicial:</span> S/ {data?.saldo}
                        </p>
                    </CardBody>
                </Card>
            </div>

            {/* Tabla de Cuotas */}
            <Card className="shadow-lg">
                <CardHeader floated={false} shadow={false} className="bg-gray-700 p-4 flex justify-between">
                    <h2 className="text-white text-lg font-bold">Cronograma de Cuotas</h2>
                    <button className="bg-yellow-700 hover:bg-yellow-800 text-white py-2 px-4 rounded ml-2" onClick={() => eliminarCuota(cuota.id)}>
                        Descargar Cronograma <i className="fas fa-download ml-2"></i>
                    </button>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-700 text-white">
                                    <th className="p-3 border border-gray-300">Cuota</th>
                                    <th className="p-3 border border-gray-300">Monto (S/)</th>
                                    <th className="p-3 border border-gray-300">Fecha de Vencimiento</th>
                                    <th className="p-3 border border-gray-300">Fecha de Pago</th>
                                    <th className="p-3 border border-gray-300">Estado</th>
                                    <th className="p-3 border border-gray-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cuotasxPago.data && cuotasxPago.data.map((cuota, index) => (
                                    <tr key={index} className="text-center border border-gray-300 odd:bg-gray-100">
                                        <td className="p-3">{cuota.numero_cuota}</td>
                                        <td className="p-3">S/ {cuota.monto}</td>
                                        <td className="p-3">{cuota.fecha_vencimiento && cuota.fecha_vencimiento.split("T")[0]}</td>
                                        <td className="p-3">{cuota.fecha_pago && cuota.fecha_pago.split("T")[0]}</td>
                                        <td className="p-3">{cuota.estado ? "Pagada" : "Pendiente"}</td>
                                        <td className="p-3 flex justify-center">
                                            {cuota.estado ? (
                                                <>
                                                    <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" onClick={() => revertirpagarCuota(cuota.id)}>
                                                        Pagada
                                                    </button>
                                                    <button className="bg-yellow-700 hover:bg-yellow-800 text-white py-2 px-4 rounded ml-2" onClick={() => handleModalOpen(cuota)}>
                                                        <DocumentIcon className="w-6 h-6" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={() => pagarCuota(cuota.id)}>
                                                        Pagar
                                                    </button>

                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
            {cuotaGenerarRecibo && (<ReciboModal isOpen={modalOpen} onClose={() => {setModalOpen(false);setCuotaGenerarRecibo(null);}} dataCuota={cuotaGenerarRecibo} dataGeneral={data} />)}
        </div>
    );
};

export default Schedule;
