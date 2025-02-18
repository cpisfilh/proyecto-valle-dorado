import { Card, CardBody, CardHeader, Typography, Divider } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";

const Show = () => {
  const location = useLocation();
  const data = location.state?.data || {};
  const entity = location.state?.entity || 'Entidad';

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
              <Typography className="font-light text-gray-900">{data[key]}</Typography>
            </div>
          ))}
        </CardBody>
      </Card>
  );
}

export default Show;
