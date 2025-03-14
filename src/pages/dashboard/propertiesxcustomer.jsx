import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Input, Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ToastContainer } from "react-toastify";
import { getPrediosSelectModal, getPrediosxCustomer } from "@/requests/reqPredios";
import usePagination from "@/customhooks/usePagination";
import Swal from "sweetalert2";
import PredioxClienteModal from "@/widgets/me/predioxcliente/PredioxClienteModal";
import { getClientes } from "@/requests/reqClientes";

export function PropertiesXCustomer() {
    const className = "py-3 px-5";
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { currentData, currentPage, totalPages, nextPage, prevPage } = usePagination(results, 5);
    const [resultsClientes, setResultsClientes] = useState([]);
    const [resultsPredios, setResultsPredios] = useState([]);

    async function searchData(name) {
        if (!name || name.length == 0) return;
        setLoading(true);
        const data = await getPrediosxCustomer(name);
        if(data.message=="exito" && data.data.length==0){
            Swal.fire({
                icon: 'error',
                text: 'El cliente no tiene predios registrados!',
                customClass: {
                    confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
                }
            })
        }
        setResults(data.data);
        setLoading(false);
    }

    function removeItem(id) {

    }
    function handleClose() {
        setIsOpen(false);
    }
    useEffect(() => {
        async function getDataClientes() {
            const data = await getClientes();
            setResultsClientes(data.data);
        }
        getDataClientes();
        async function getDataPredios() {
            const data = await getPrediosSelectModal();
            setResultsPredios(data.data);
        }
        getDataPredios();
    }, []);
    return (
        <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h5" color="white" className="text-center">
                        Predios por Cliente
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <div className="flex justify-between px-4">
                        <Button variant="gradient" color="green" size="md" className="flex items-center gap-3" onClick={() => setIsOpen(true)}>
                            <PlusIcon className="h-4 w-4" />
                            Relacionar
                        </Button>
                        <input
                            className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Buscar"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    searchData(e.target.value);
                                }
                            }}

                        />
                    </div>
                    {/* <div className="flex justify-between px-4 mt-4 gap-2">
                        <Input label="Buscar predios para..." size="md"
                            containerProps={{ className: "w-18 min-w-[100px]" }}
                        />
                        <Button variant="gradient" color="blue" size="md" className="flex items-center gap-3">
                            <MagnifyingGlassIcon className="h-4 w-4" />
                            Buscar
                        </Button>
                    </div> */}

                    {results && results.length ? (
                        <>
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                ID
                                            </Typography>
                                        </th>
                                        <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Nombre Cliente
                                            </Typography>
                                        </th>
                                        <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Apellido Cliente
                                            </Typography>
                                        </th>
                                        <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Manzana
                                            </Typography>
                                        </th>
                                        <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                Lote
                                            </Typography>
                                        </th>
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
                                                    {
                                                        el.id
                                                    }
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-md font-normal text-blue-gray-500">
                                                    {
                                                        el.nombre_cliente
                                                    }
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-md font-normal text-blue-gray-500">
                                                    {
                                                        el.apellido_cliente
                                                    }
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-md font-normal text-blue-gray-500">
                                                    {
                                                        el.manzana
                                                    }
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-md font-normal text-blue-gray-500">
                                                    {
                                                        el.lote
                                                    }
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                            <div onClick={() => removeItem(el.id)} className="cursor-pointer">
                                                    <TrashIcon className="h-4 w-4 hover:text-red-700 cursor-pointer" />
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
            <PredioxClienteModal isOpen={isOpen} onClose={handleClose} dataClientes={resultsClientes} dataPredios={resultsPredios} />
        </div>
    );
}

export default PropertiesXCustomer;
