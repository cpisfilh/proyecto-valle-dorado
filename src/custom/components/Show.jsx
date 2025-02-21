import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, CardHeader, Typography, Divider, CardFooter, Button } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";

const Show = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data || {};
  const entity = location.state?.entity || 'Entidad';
  
  const currentUrl = window.location.pathname;

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
            <Typography className="font-medium text-gray-600">{key.toUpperCase()}</Typography>
            <Typography className="font-light text-gray-900">{typeof data[key] === "boolean" ? data[key] ? "Activo" : "Inactivo" : data[key] }</Typography>
          </div>
        ))}
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button type="button" color="gray" variant="outlined" className="flex items-center gap-2" onClick={() => { navigate(`${currentUrl.replace("/show", "")}`); }}>
          <ArrowLeftIcon className="w-5 h-5"/> Regresar a lista
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Show;
