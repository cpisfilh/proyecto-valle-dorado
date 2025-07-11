import usePagination from "@/customhooks/usePagination";
import { remove } from "@/requests/reqGenerics";
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Table = ({ title, loading, data, entity, fields, getData, relatedData }) => {
    const navigate = useNavigate();
    const columns = data && data.length ? Object.keys(data[0]).slice(0, 5) : [];
    const className = "py-3 px-5";
    const currentUrl = window.location.pathname;

    const { currentData, currentPage, totalPages, nextPage, prevPage } = usePagination(data, 5); // 5 elementos por página

    function sendDataToShow(data) {
        navigate(`${currentUrl}/show`, { state: { data, entity,relatedData,fields } });
    }

    function goToCreate() {
        navigate(`${currentUrl}/create`, { state: { fields, entity, relatedData } });
    }

    function goToEdit(data) {
        navigate(`${currentUrl}/edit`, { state: { fields, data, entity } });
    }

    function removeItem(id) {
        remove({ id }, entity + "/delete").then((response) => {
            if (response.message == "exito") {
                toast.success("Registro eliminado!", {
                    autoClose: 2500
                })
                getData()
            } else {
                toast.error("Ocurrió un problema!")
            }
        });
    }
    

    return (
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                <Typography variant="h5" color="white" className="text-center">
                    {title.toUpperCase()}
                </Typography>
            </CardHeader>
            <div className="flex justify-between px-4">
                    <Button variant="gradient" color="green" size="sm" className="flex items-center gap-3" onClick={goToCreate}>
                        <PlusIcon className="h-4 w-4" />
                        Crear
                    </Button>
                </div>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                
                {currentData && currentData.length ? (
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
                                {currentData.map((el) => (
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
                                                <div onClick={() => sendDataToShow(el)} className="cursor-pointer">
                                                    <EyeIcon className="h-4 w-4 hover:text-blue-500" />
                                                </div>
                                                <div onClick={() => goToEdit(el)} className="cursor-pointer">
                                                    <PencilIcon className="h-4 w-4 hover:text-yellow-700 cursor-pointer" />
                                                </div>
                                                <div onClick={() => removeItem(el.id)} className="cursor-pointer">
                                                    <TrashIcon className="h-4 w-4 hover:text-red-700 cursor-pointer" />
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
    );
};

export default Table;
