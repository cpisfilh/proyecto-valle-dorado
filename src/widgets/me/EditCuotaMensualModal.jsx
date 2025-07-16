import {
    Dialog,
    DialogHeader,
    DialogBody,
    Input,
    Button,
    Card,
    Typography,
    CardBody,
    CardFooter,
    Spinner,
} from "@material-tailwind/react";
import { useState } from "react";
import { useForm} from "react-hook-form";
import { postEditCuotaMensual } from "@/requests/reqCuotas";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const EditCuotaMensualModal = ({ isOpen, onClose,dataGeneral,dataCuotas,tipo }) => {
  console.log(dataGeneral);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            numero_cuota: dataGeneral.numero_cuota ?? null, // Número de cuota
            monto: dataGeneral.monto ?? "", // Monto
            fecha_pago: dataGeneral.fecha_pago && dataGeneral.fecha_pago.split("T")[0], // Fecha de pago
            fecha_vencimiento: dataGeneral.fecha_vencimiento && dataGeneral.fecha_vencimiento.split("T")[0], // Fecha de vencimiento
            estado: dataGeneral.estado ? "1" : "0", // Estado por defecto
        }
    });

    async function onSubmit(data) {
        setLoading(true);
        const fPago = data.fecha_pago ? new Date(data.fecha_pago) : null;
        const fVen = data.fecha_vencimiento ? new Date(data.fecha_vencimiento) : null;
        try {
          const resp = await postEditCuotaMensual({id: dataGeneral.id,id_pago:data.id_pago, ...data,fecha_vencimiento:fVen, fecha_pago:fPago , estado: data.estado === "0" ? false : true });
          onClose();
          if (resp.message === "exito") {
            Swal.fire({
              icon: 'success',
              text: 'Pago actualizado con éxito!',
              customClass: {
                confirmButton: 'bg-green-500 text-white rounded hover:bg-green-600'
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              text: resp.error,
              customClass: {
                confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
              }
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            text: 'Ocurrió un error!',
            customClass: {
              confirmButton: 'bg-red-500 text-white rounded hover:bg-red-600'
            }
          });
        } finally {
          setLoading(false);
        }
      }
    
    
    return (
        <Dialog open={isOpen} handler={onClose} size="lg">
            <DialogHeader>EDITAR CUOTA</DialogHeader>
            <DialogBody className="space-y-4 overflow-auto max-h-[80vh]">
            <Card>
      {/* <CardHeader variant="gradient" color="gray" className="mb-4 p-6 text-center rounded-t-lg">
        <Typography variant="h5" color="white">EDITAR CUOTA</Typography>
      </CardHeader> */}
      <CardBody className="px-6 py-4">
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Número de cuota */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">Número de cuota</label>
            <Input type="number" {...register("numero_cuota", { required: "Campo requerido", setValueAs: (value) => value ? Number(value) : null })} />
            {errors.numero_cuota && <Typography className="text-red-500 text-sm font-bold">{errors.numero_cuota.message}</Typography>}
          </div>

          {/* Monto */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">Monto</label>
            <Input type="number" {...register("monto", { required: "Campo requerido" })} />
            {errors.monto && <Typography className="text-red-500 text-sm font-bold">{errors.monto.message}</Typography>}
          </div>

          {/* Fecha de pago */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">Fecha de pago</label>
            <Input type="date" {...register("fecha_pago")} />
            {errors.fecha_pago && <Typography className="text-red-500 text-sm font-bold">{errors.fecha_pago.message}</Typography>}
          </div>

          {/* Fecha de vencimiento */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">Fecha de vencimiento</label>
            <Input type="date" {...register("fecha_vencimiento", { required: "Campo requerido"})} />
            {errors.fecha_vencimiento && <Typography className="text-red-500 text-sm font-bold">{errors.fecha_vencimiento.message}</Typography>}
          </div>

          <CardFooter className="flex justify-between">
            <Button type="button" color="gray" variant="outlined" onClick={()=>onClose()}>
              Cancelar
            </Button>
            <Button type="submit" color="blue" disabled={loading}>
              {loading ? <Spinner color="green" /> : "Editar Cuota"}
            </Button>
          </CardFooter>
          <ToastContainer />
        </form>
      </CardBody>
    </Card>
            </DialogBody>
        </Dialog>
    );
};

export default EditCuotaMensualModal;
