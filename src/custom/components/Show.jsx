import axiosInstance from "@/requests/axiosConfig";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, CardHeader, Typography, Divider, CardFooter, Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Show = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data || {};
  const entity = location.state?.entity || 'Entidad';
  const relatedData = location.state?.relatedData || [];
  const fields = location.state?.fields || [];

  const selectFields = fields.filter((field) => field.type === "select")

  // Crear estado dinámico con los nombres de los objetos
  const [selectState, setSelectState] = useState(
    selectFields.reduce((acc, field) => ({ ...acc, [field.name]: [] }), {})
  );

  const currentUrl = window.location.pathname;

  // Fetch de datos cuando el componente se monta
  useEffect(() => {
    if (selectFields.length === 0) return
    fields.forEach(async (field) => {
      try {
        const response = await axiosInstance.get(`/${field.name}`);
        setSelectState((prev) => ({ ...prev, [field.name]: response.data }));
      } catch (error) {
        console.error(`Error al cargar ${field.name}:`, error);
      }
    });
  }, [ ]);

  return (
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-4 p-6 text-center rounded-t-lg">
        <Typography variant="h5" color="white">
          DETALLES DEL {entity.toUpperCase()}
        </Typography>
      </CardHeader>
      <CardBody className="px-6 py-4">
        {data && Object.keys(data).map((key) => (
          <div key={key} className="flex justify-between items-center py-2">
            <Typography className="font-medium text-gray-600">{key.includes("_id") ? key.split("_")[0].toUpperCase() : key.toUpperCase()}</Typography>
            <Typography className="font-light text-gray-900">{typeof data[key] === "boolean" ? (data[key] ? "Activo" : "Inactivo") : key.includes("_id") ? selectState[key.split("_")[0]]?.data?.find((item) => item.id === data[key])?.valor || "Desconocido" : data[key]}</Typography>
          </div>
        ))}
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button type="button" color="gray" variant="outlined" className="flex items-center gap-2" onClick={() => { navigate(`${currentUrl.replace("/show", "")}`); }}>
          <ArrowLeftIcon className="w-5 h-5" /> Regresar a lista
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Show;
