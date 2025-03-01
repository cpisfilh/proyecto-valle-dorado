import React, { useEffect, useState } from "react";
import Table from "@/custom/components/Table";
import { Outlet, useLocation } from "react-router-dom";
import { getPredios } from "@/requests/reqPredios";
import axiosInstance from "@/requests/axiosConfig";
import { Button, Card, CardBody, CardHeader, Input, Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import { ToastContainer } from "react-toastify";
import DropdownInput from "@/widgets/me/DropdownInput";

export function PropertiesXCustomer() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

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
                        <Button variant="gradient" color="green" size="md" className="flex items-center gap-3">
                            <PlusIcon className="h-4 w-4" />
                            Relacionar
                        </Button>
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
                    <DropdownInput />
                    {results && results.length ? (
                        <>
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {[...columns, "acciones"].map((el) => (
                                            <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                                <Typography variant="small" className="text-[13px] font-bold uppercase">
                                                    {el.includes("_id") ? el.split("_id")[0] : el}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((el) => (
                                        <tr key={el.id}>
                                            {columns.map((column, index) => (
                                                <td className={className} key={column}>
                                                    <Typography className="text-md font-normal text-blue-gray-500">
                                                        {
                                                            typeof el[column] === "boolean" ? (el[column] ? "Activo" : "Inactivo") :
                                                                column.includes("_id") ? (relatedData[column.split("_id")[0]]?.find(item => item.id === el[column])?.valor || "-") : el[columns[index]]
                                                        }
                                                    </Typography>
                                                </td>
                                            ))}
                                            <td className={className}>
                                                <div className="flex items-center gap-4">
                                                    {/* <div onClick={() => sendDataToShow(el)} className="cursor-pointer"> */}
                                                    <EyeIcon className="h-4 w-4 hover:text-blue-500" />
                                                    {/* </div> */}
                                                    {/* <div onClick={() => goToEdit(el)} className="cursor-pointer"> */}
                                                    <PencilIcon className="h-4 w-4 hover:text-yellow-700 cursor-pointer" />
                                                    {/* </div> */}
                                                    {/* <div onClick={() => removeItem(el.id)} className="cursor-pointer"> */}
                                                    <TrashIcon className="h-4 w-4 hover:text-red-700 cursor-pointer" />
                                                    {/* </div> */}
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
        </div>
    );
}

export default PropertiesXCustomer;
