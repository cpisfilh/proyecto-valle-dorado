import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Input, Spinner, Typography } from "@material-tailwind/react";
import { CalendarDaysIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ToastContainer } from "react-toastify";
import usePagination from "@/customhooks/usePagination";
import { postDeletePago, postSearchPagos } from "@/requests/reqPagos";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import usePaymentsStore from "@/store/usePaymentsStore";

export function Payments() {
    const className = "py-3 px-5";
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const {
        pagos,
        clientes,
        predios,
        fetchPagos,
        fetchClientes,
        fetchPredios,
        shouldReloadPagos,
        setShouldReloadPagos
    } = usePaymentsStore();

    const { currentData, currentPage, totalPages, nextPage, prevPage } = usePagination(pagos, 8);
    const isLotesRoute = location.pathname.endsWith("/pagos");

    useEffect(() => {
        fetchClientes();
        fetchPredios();
    }, []);

    useEffect(() => {
        if (isLotesRoute) {
            setLoading(true);
            fetchPagos().finally(() => setLoading(false));
        }
    }, [isLotesRoute]);

    function goToCreate() {
        navigate("create", { state: { resultsPredios: predios, resultsClientes: clientes } });
    }

    function goToEdit(element) {
        navigate("edit", { state: { resultsPredios: predios, resultsClientes: clientes, data: element } });
    }

    function goToCronograma(element) {
        navigate("cronograma", { state: { data: element } });
    }

    async function searchData(name) {
            if (!name || name.length == 0) return;
            setLoading(true);
            const data = await postSearchPagos(name);
            if (data.message == "exito" && data.data.length == 0) {
                Swal.fire({
                    icon: 'error',
                    text: 'No hay pagos para mostrar!',
                    customClass: {
                        confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                    }
                })
            }
            usePaymentsStore.setState({ pagos: data.data });
            setLoading(false);
        }

    async function removeItem(id) {
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
                    text: 'Pago eliminado con éxito!',
                    customClass: {
                        confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
                    }
                }).then(() => {
                    // Forzar recarga limpiando el array
                    usePaymentsStore.setState({ pagos: [] });
                    fetchPagos();
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

    useEffect(() => {
        if (isLotesRoute && shouldReloadPagos) {
            usePaymentsStore.setState({ pagos: [] });
            fetchPagos();
            setShouldReloadPagos(false);
        }
    }, [navigate]);
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
                    { loading ? <div className="flex items-center">
                            Cargando...<Spinner />
                        </div> : <input
                            className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="new-password"
                            placeholder="Buscar"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    searchData(e.target.value);
                                }
                            }}

                        />
                    }
                    
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
                                    {currentData.map((el) => (
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
