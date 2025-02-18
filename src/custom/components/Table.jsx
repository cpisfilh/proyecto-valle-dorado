import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

const Table = ({ title, data,entity }) => {
    const navigate = useNavigate();
    const columns = data && data.length ? Object.keys(data[0]) : [];
    const className = "py-3 px-5";
    const currentUrl = window.location.pathname;

    function sendDataToShow(data) {
        navigate(`${currentUrl}/show`, { state: {data, entity} });  // Navegar y pasar los datos en el estado
    }

    function goToCreate() {
        navigate(`${currentUrl}/create`);
    }

    return (
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6 ">
                <Typography variant="h5" color="white" className="text-center">
                    {title.toUpperCase()}
                </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <div className="flex justify-start px-4">
                    <Button variant="gradient" color="green" size="sm" className="flex items-center gap-3" onClick={goToCreate}>
                        <PlusIcon className="h-4 w-4" />
                        Crear
                    </Button>
                </div>
                {
                    data && data.length ? (
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {[...columns, "acciones"].map((el) => (
                                        <th
                                            key={el}
                                            className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                        >
                                            <Typography
                                                variant="small"
                                                className="text-[11px] font-bold uppercase "
                                            >
                                                {el}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(
                                    (el) => (
                                        <tr key={el.id}>
                                            {
                                                columns.map((column, index) => (
                                                    <td className={className} key={column}>
                                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                                            {el[columns[index]]}
                                                        </Typography>
                                                    </td>
                                                ))
                                            }
                                            <td className={className}>
                                                <div className="flex items-center gap-4">
                                                    <div onClick={()=>sendDataToShow(el)} className="cursor-pointer">
                                                        <Typography
                                                            className="text-xs font-semibold text-blue-gray-600"
                                                        >
                                                            <EyeIcon className="h-4 w-4 hover:text-blue-500" />
                                                        </Typography>
                                                    </div>
                                                    <Typography
                                                        as="a"
                                                        href="#"
                                                        className="text-xs font-semibold text-blue-gray-600"
                                                    >
                                                        <PencilIcon className="h-4 w-4 hover:text-yellow-700" />
                                                    </Typography>
                                                    <Typography
                                                        as="a"
                                                        href="#"
                                                        className="text-xs font-semibold text-blue-gray-600"
                                                    >
                                                        <TrashIcon className="h-4 w-4 hover:text-red-700" />
                                                    </Typography>
                                                </div>
                                            </td>
                                        </tr>
                                    )

                                )}
                            </tbody>
                        </table>
                    ) : <Typography
                        as="a"
                        href="#"
                        className="text-lg font-semibold text-blue-gray-600 text-center"
                    >
                        No hay datos
                    </Typography>
                }
            </CardBody>
        </Card>
    )
}
export default Table