import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Input, Typography } from "@material-tailwind/react";
import { CalendarDaysIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ToastContainer } from "react-toastify";
import { getPrediosSelectModal } from "@/requests/reqPredios";
import usePagination from "@/customhooks/usePagination";
import { getPagos, postDeletePago } from "@/requests/reqPagos";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getClientes } from "@/requests/reqClientes";
import Swal from "sweetalert2";

export function Payments() {
    const className = "py-3 px-5";
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [resultsClientes, setResultsClientes] = useState([]);
    const [resultsPredios, setResultsPredios] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { currentData, currentPage, totalPages, nextPage, prevPage } = usePagination(results, 5);

    async function removeItem(id) {
        try {
            const result = await Swal.fire({
                icon: 'question',
                text: '¿Desea eliminar el pago?',
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
                    title: 'Procesando ...',
                    text: 'Por favor, espere...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                const resp = await postDeletePago(id);

                if (resp.message === "exito") {
                    Swal.fire({
                        icon: 'success',
                        text: 'Pago eliminado con exito!',
                        customClass: {
                            confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                        }
                    }).then(() => {
                        getDataPagos();
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

    function goToCreate() {
        navigate("create", { state: { resultsPredios, resultsClientes } });
    }

    function goToEdit(element) {
        navigate("edit", { state: { resultsPredios, resultsClientes, data: element } });
    }

    function goToCronograma(element) {
        navigate("cronograma", { state: { data: element } });
    }

    async function getDataPagos() {
        try {
            setLoading(true);
            const data = await getPagos();
            setResults(data.data);
        } catch (error) {
            throw Error(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {

        async function getDataPredios() {
            try {
                // setLoading(true);
                const data = await getPrediosSelectModal();
                setResultsPredios(data.data);
            } catch (error) {
                throw Error(error);
            } finally {
                // setLoading(false);
            }
        }
        async function getDataClientes() {
            try {
                // setLoading(true);
                const data = await getClientes();
                setResultsClientes(data.data);
            } catch (error) {
                throw Error(error);
            } finally {
                // setLoading(false);
            }
        }
        getDataPredios();
        getDataClientes();
    }, []);

    useEffect(() => {
        isLotesRoute && getDataPagos();
    }, [navigate]);

    const isLotesRoute = location.pathname.endsWith("/pagos");
    return (
        <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
            {isLotesRoute && <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h5" color="white" className="text-center">
                        Pagos
                    </Typography>
                </CardHeader>
                <div className="flex justify-between px-4">
                        <Button variant="gradient" color="green" size="sm" className="flex items-center gap-3" onClick={goToCreate}>
                            <PlusIcon className="h-4 w-4" />
                            Crear
                        </Button>
                    </div>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    
                    {/* <div className="flex justify-between px-4 mt-4 gap-2">
                        <Input label="Buscar predios para..." size="md"
                            containerProps={{ className: "w-18 min-w-[100px]" }}
                        />
                        <Button variant="gradient" color="blue" size="md" className="flex items-center gap-3">
                            <MagnifyingGlassIcon className="h-4 w-4" />
                            Buscar
                        </Button>
                    </div> */}

                    {currentData && currentData.length ? (
                        <>
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Id Pago
                                            </Typography>
                                        </th>
                                        <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Predio
                                            </Typography>
                                        </th>
                                        <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Propietarios
                                            </Typography>
                                        </th>
                                        <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Precio Total
                                            </Typography>
                                        </th>
                                        <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Cuota Inicial
                                            </Typography>
                                        </th>
                                        {/* <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Saldo
                                            </Typography>
                                        </th> */}
                                        <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Acciones
                                            </Typography>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((el) => (
                                        <tr key={el.id}>
                                            <td className={className}>
                                                <Typography className="text-md font-normal text-blue-gray-500">
                                                    {el.id}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-md font-normal text-blue-gray-500">
                                                    {
                                                        el.predio.manzana + "-" + el.predio.lote
                                                    }
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                {
                                                    el.cliente_pago && el.cliente_pago.map((el) => (
                                                        <Typography key={el.cliente_id} className="text-md font-normal text-blue-gray-500">
                                                            {el.cliente_dni + " - " + el.cliente_nombre + " " + el.cliente_apellido}
                                                        </Typography>
                                                    ))
                                                }
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-md font-normal text-blue-gray-500">
                                                    {
                                                        Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(el.precio_total)
                                                    }
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-md font-normal text-blue-gray-500">
                                                    {
                                                        Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(el.cuota_inicial)
                                                    }
                                                </Typography>
                                            </td>
                                            {/* <td className={className}>
                                                <Typography className="text-md font-normal text-blue-gray-500">
                                                    {
                                                        Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(el.saldo)
                                                    }
                                                </Typography>
                                            </td> */}
                                            <td className={className}>
                                                <div className="flex justify-center items-center gap-2">
                                                    {/* <div onClick={() => goToEdit(el)} className="cursor-pointer">
                                                        <PencilIcon className="h-4 w-4 hover:text-yellow-700 cursor-pointer" />
                                                    </div> */}
                                                    <div onClick={() => removeItem(el.id)} className="cursor-pointer">
                                                        <TrashIcon className="h-4 w-4 hover:text-red-700 cursor-pointer" />
                                                    </div>
                                                    <div onClick={() => goToCronograma(el)} className="cursor-pointer">
                                                        <CalendarDaysIcon className="h-4 w-4 hover:text-blue-700 cursor-pointer" />
                                                    </div>
                                                </div>
                                            </td>


                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginación */}
                            {
                                totalPages !== 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-4">
                                        <Button variant="outlined" color="gray" size="sm" onClick={prevPage} disabled={currentPage === 1}>
                                            Anterior
                                        </Button>
                                        <Typography variant="small" className="font-medium">
                                            Página {currentPage} de {totalPages}
                                        </Typography>
                                        <Button variant="outlined" color="gray" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
                                            Siguiente
                                        </Button>
                                    </div>
                                )
                            }
                        </>
                    ) : loading ? (
                        <Typography variant="h6" color="blue-gray" className="text-center">
                            Cargando...
                        </Typography>
                    ) : (
                        <Typography className="text-lg font-semibold text-blue-gray-600 text-center">
                            No hay datos
                        </Typography>
                    )}
                    <ToastContainer />
                </CardBody>
            </Card>
            }
            <Outlet />
        </div>
    );
}

export default Payments;
