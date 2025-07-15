import React from "react";
import Recibo from "@/pdfs/Recibo";
import axiosInstance from "@/requests/axiosConfig";
import { getPago } from "@/requests/reqPagos";
import CronogramaModal from "@/widgets/me/CronogramaModal";
import CuotaInicialModal from "@/widgets/me/CuotaInicialModal";
import GenerarCuotasModal from "@/widgets/me/GenerarCuotasModal";
import ReciboModal from "@/widgets/me/ReciboModal";
import { DocumentIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardHeader, Spinner } from "@material-tailwind/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Schedule = () => {
    const location = useLocation();
    const [data, setData] = useState(location.state?.data || {});
    const [cuotasxPago, setCuotasxPago] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalCronogramaOpen, setModalCronogramaOpen] = useState(false);
    const [modalAddCuotaInicialOpen, setModalAddCuotaInicialOpen] = useState(false);
    const [modalGenerarCuotasOpen, setModalGenerarCuotasOpen] = useState(false);
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
            let selectedDate = new Date().toISOString().split('T')[0]; // valor por defecto
            const result = await Swal.fire({
                icon: 'question',
                text: '¿Desea pagar la cuota?, seleccione la fecha de pago.',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                denyButtonText: 'Pago parcial',
                input: 'date',
                inputValue: new Date().toISOString().split('T')[0], // fecha actual en formato YYYY-MM-DD
                customClass: {
                    confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600',
                    denyButton: 'bg-blue-500 text-white rounded hover:bg-blue-600',
                    cancelButton: 'bg-red-500 text-white rounded hover:bg-red-600',
                    input: 'border border-gray-300 rounded p-2 w-1/2 mx-auto'
                },
                willClose: () => {
                    const inputEl = Swal.getInput();
                    if (inputEl?.value) {
                        selectedDate = inputEl.value;
                    }
                }
            });

            if (result.isConfirmed && result.value) {
                Swal.fire({
                    title: 'Procesando...',
                    text: 'Por favor, espere...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                console.log(result.value);

                // 🔥 Ajustar fecha recibida desde input type="date"
                // El valor recibido es YYYY-MM-DD
                const selectedDateStr = result.value; // por ejemplo: "2025-05-27"
                const localDate = new Date(selectedDateStr + 'T00:00:00'); // zona local
                const fecha_pago_ajustada = localDate.toISOString(); // a UTC ISO

                const resp = await axiosInstance.post("/cuota/pay", {
                    id,
                    fecha_pago: fecha_pago_ajustada
                });

                if (resp.data.message === "exito") {
                    Swal.fire({
                        icon: 'success',
                        text: 'Cuota cancelada!',
                        customClass: {
                            confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                        }
                    }).then(() => {
                        getCuotasxPago();
                        getDataPago();
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
            } else if (result.isDenied) {
                const result1 = await Swal.fire({
                    icon: 'info',
                    title: 'Pago parcial',
                    text: 'Ingrese el monto a pagar',
                    input: 'number',
                    confirmButtonText: 'Pagar',
                    showConfirmButton: true,
                    showCancelButton: true,
                    inputAttributes: {
                        min: 0,
                        step: 0.01,
                        class: 'border border-gray-300 rounded p-2 w-1/2 mx-auto'
                    },
                    customClass: {
                        confirmButton: 'bg-blue-500 text-white rounded hover:bg-blue-600',
                        cancelButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                    }
                });

                if (result1.isConfirmed && result1.value) {
                    Swal.fire({
                        title: 'Procesando...',
                        text: 'Por favor, espere...',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    // 🔥 Ajustar fecha recibida desde input type="date"
                    // El valor recibido es YYYY-MM-DD
                    const selectedDateStr = selectedDate; // por ejemplo: "2025-05-27"
                    const localDate = new Date(selectedDateStr + 'T00:00:00'); // zona local
                    const fecha_pago_ajustada = localDate.toISOString(); // a UTC ISO

                    const resp = await axiosInstance.post("/subcuota/create", {
                        id_cuota: id,
                        monto: result1.value,
                        fecha_pago: fecha_pago_ajustada,
                    });

                    if (resp.data.message === "exito") {
                        Swal.fire({
                            icon: 'success',
                            text: 'Cuota cancelada!',
                            customClass: {
                                confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                            }
                        }).then(() => {
                            getCuotasxPago();
                            getDataPago();
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
            }
        } catch (error) {
            console.error("Error al pagar la cuota:", error);
            Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error!',
                customClass: {
                    confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                }
            });
        }
    }


    async function eliminarSubCuota(id) {
        try {
            const result = await Swal.fire({
                icon: 'warning',
                text: '¿Está seguro de eliminar esta subcuota?',
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
                const resp = await axiosInstance.post(`/subcuota/delete`, { id });

                if (resp.data.message === "exito") {
                    Swal.fire({
                        icon: 'success',
                        text: 'Subcuota eliminada!',
                        customClass: {
                            confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                        }
                    }).then(() => {
                        getCuotasxPago();
                        getDataPago();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: resp.error || 'Ocurrido un error inesperado',
                        customClass: {
                            confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                        }
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocurrido un error!',
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
                        getDataPago();
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

    async function getDataPago() {
        try {
            setLoading(true);
            const data2 = await getPago(data.id);
            setData(data2.data);
        } catch (error) {
            throw Error(error);
        } finally {
            setLoading(false);
        }
    }

    async function removeItem(id){
        try {
            const result = await Swal.fire({
                icon: 'warning',
                text: '¿Está seguro de eliminar esta cuota?',
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
                const resp = await axiosInstance.post(`/cuota/deleteCuotaPago`, { id });

                if (resp.data.message === "exito") {
                    Swal.fire({
                        icon: 'success',
                        text: 'Cuota eliminada!',
                        customClass: {
                            confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                        }
                    }).then(() => {
                        getCuotasxPago();
                        getDataPago();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: resp.error || 'Ocurrido un error inesperado',
                        customClass: {
                            confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                        }
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocurrido un error!',
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
        if (data) {
            getCuotasxPago();
            getDataPago();
        }
    }, []);

    useEffect(() => {
        if (cuotaGenerarRecibo) {
            setModalOpen(true);
        }
    }, [cuotaGenerarRecibo]);

    useEffect(() => {
        if (cuotasxPago && modalCronogramaOpen) {
            setModalCronogramaOpen(true);
        }
    }, [cuotasxPago]);

    useEffect(() => {
        if (modalAddCuotaInicialOpen == false && modalGenerarCuotasOpen == false) {
            getCuotasxPago();
            getDataPago();
        }
    }, [modalAddCuotaInicialOpen, modalGenerarCuotasOpen]);

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
                        {/* <p className="text-lg">
                            <span className="text-green-700 font-bold">Saldo Inicial:</span> S/ {data?.saldo}
                        </p> */}
                        <p className="text-lg">
                            <span className="text-green-700 font-bold">Saldo Actual:</span> S/ {data?.saldo_actual}
                        </p>
                    </CardBody>
                </Card>
            </div>

            {/* Tabla de Pagos de cuota inicial */}
            <Card className="shadow-lg">
                <CardHeader floated={false} shadow={false} className="bg-gray-700 p-4 flex justify-between">
                    <h2 className="text-white text-lg font-bold">Pagos de cuota inicial </h2>
                    {
                        data && (data.precio_total - data.saldo_actual < data.cuota_inicial) &&
                        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded ml-2" onClick={() => setModalAddCuotaInicialOpen(true)}>
                            Registrar +
                        </button>
                    }
                </CardHeader>
                <CardBody className="pt-2">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-700 text-white">
                                    {/* <th className="p-3 border border-gray-300">Cuota</th> */}
                                    <th className="p-3 border border-gray-300">Monto (S/)</th>
                                    <th className="p-3 border border-gray-300">Fecha de Vencimiento</th>
                                    <th className="p-3 border border-gray-300">Fecha de Pago</th>
                                    <th className="p-3 border border-gray-300">Estado</th>
                                    <th className="p-3 border border-gray-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cuotasxPago.data && cuotasxPago.data.map((cuota, index) => {
                                    if (cuota.tipo === "INICIAL") {
                                        return <tr key={index} className="text-center border border-gray-300 odd:bg-gray-100">
                                            {/* <td className="p-3">{cuota.numero_cuota}</td> */}
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
                                                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded ml-2" onClick={() => removeItem(cuota.id)}>
                                                    <TrashIcon className="w-6 h-6" />
                                                </button>
                                            </td>
                                        </tr>
                                    }

                                }

                                )}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Tabla de Cuotas */}
            <Card className="shadow-lg">
                <CardHeader floated={false} shadow={false} className="bg-gray-700 p-4 flex justify-between">
                    <h2 className="text-white text-lg font-bold">Cronograma de Cuotas</h2>
                    {/* {
                        data && (data.precio_total - data.saldo_actual == data.cuota_inicial) && <button className="bg-cyan-700 hover:bg-cyan-800 text-white py-2 px-4 rounded ml-2" onClick={() => setModalGenerarCuotasOpen(true)}>
                            Generar Cuotas <i className="fas fa-download ml-2"></i>
                        </button>
                    } */}
                    {
                        cuotasxPago.data && cuotasxPago.data.length > 0 &&
                        <button className="bg-yellow-700 hover:bg-yellow-800 text-white py-2 px-4 rounded ml-2" onClick={() => setModalCronogramaOpen(true)}>
                            Descargar Cronograma <i className="fas fa-download ml-2"></i>
                        </button>
                    }
                </CardHeader>
                <CardBody className="pt-2">
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
                                {cuotasxPago.data && cuotasxPago.data.map((cuota, index) => {
                                    if (cuota.tipo === "MENSUAL") {
                                        return <React.Fragment key={index}><tr className="text-center border border-gray-300 odd:bg-gray-100">
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
                                                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded ml-2" onClick={() => removeItem(cuota.id)}>
                                                    <TrashIcon className="w-6 h-6" />
                                                </button>
                                            </td>
                                        </tr>
                                            {
                                                cuota.subcuota && cuota.subcuota.map((subcuota, subIndex) => (
                                                    <tr key={`sub-${subcuota.id}`} className="text-center border bg-blue-100 border-gray-300 odd:bg-gray-100">
                                                        <td className="p-3">
                                                            <div className="flex items-center justify-center font-extrabold">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="blue" className="w-5 h-5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499" />
                                                                </svg>
                                                                {cuota.numero_cuota}.{subcuota.numero_subcuota}
                                                            </div>
                                                        </td>
                                                        <td className="p-3">S/ {subcuota.monto}</td>
                                                        <td className="p-3">-</td>
                                                        <td className="p-3">{subcuota.fecha_pago && subcuota.fecha_pago.split("T")[0]}</td>
                                                        <td className="p-3">{subcuota.estado ? "Pagada" : "Pendiente"}</td>
                                                        <td className="p-3 flex justify-center">
                                                            <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded" onClick={() => eliminarSubCuota(subcuota.id)}>X</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </React.Fragment>
                                    }

                                })}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
            {cuotaGenerarRecibo && (<ReciboModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setCuotaGenerarRecibo(null); }} dataCuota={cuotaGenerarRecibo} dataGeneral={data} />)}
            {modalCronogramaOpen && (<CronogramaModal isOpen={modalCronogramaOpen} onClose={() => setModalCronogramaOpen(false)} dataGeneral={data} dataCuotas={cuotasxPago} />)}
            {modalAddCuotaInicialOpen && (<CuotaInicialModal isOpen={modalAddCuotaInicialOpen} onClose={() => setModalAddCuotaInicialOpen(false)} dataGeneral={data} dataCuotas={cuotasxPago} />)}
            {modalGenerarCuotasOpen && (<GenerarCuotasModal isOpen={modalGenerarCuotasOpen} onClose={() => setModalGenerarCuotasOpen(false)} dataGeneral={data} dataCuotas={cuotasxPago} />)}
        </div>
    );
};

export default Schedule;
