import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Spinner
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import SelectPredioModal from "./SelectPredioModal";
import SelectClienteModal from "./SelectClienteModal";
import { useState } from "react";
import Swal from "sweetalert2";
import { postRelateClientProperty } from "@/requests/reqPredios";

const PredioxClienteModal = ({ isOpen, onClose, dataClientes, dataPredios, refresh }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      clientes: [""], // arreglo de IDs
      predio: ""
    }
  });

  const clientes = watch("clientes");
  const [loading, setLoading] = useState(false);
  const [isOpenSelectPredioModal, setIsOpenSelectPredioModal] = useState(false);
  const [isOpenSelectClienteModal, setIsOpenSelectClienteModal] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const responses = await Promise.all(
        data.clientes
          .filter((id) => id) // evita vacíos
          .map((clienteId) =>
            postRelateClientProperty(Number(clienteId), Number(data.predio))
          )
      );

      if (responses.every((r) => r.message === "exito")) {
        Swal.fire({
          icon: "success",
          text: "Relación(es) registrada(s)!",
          customClass: {
            confirmButton: "bg-green-500 text-white rounded hover:bg-green-600"
          },
          target: document.getElementById("pxcParentModal")
        }).then(() => {
          onClose();
          refresh();
        });
      } else {
        throw new Error("Error en alguna relación");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Ocurrió un error!",
        customClass: {
          confirmButton: "bg-red-500 text-white rounded hover:bg-red-600"
        },
        target: document.getElementById("pxcParentModal")
      });
    } finally {
      setLoading(false);
      reset();
    }
  };

  const addCliente = () => {
    setValue("clientes", [...clientes, ""]);
  };

  const removeCliente = (index) => {
    const newClientes = [...clientes];
    newClientes.splice(index, 1);
    setValue("clientes", newClientes);
  };

  return (
    <Dialog id="pxcParentModal" open={isOpen} handler={onClose} size="md">
      <DialogHeader>Relacionar Predios a Clientes</DialogHeader>
      <DialogBody className="space-y-4 overflow-auto max-h-[80vh]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Clientes múltiples */}
          <label className="block text-sm font-medium text-gray-900">Clientes</label>
          {clientes.map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                {...register(`clientes.${index}`, {
                  required: "Seleccione un cliente"
                })}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              >
                <option value="">Seleccione un cliente</option>
                {dataClientes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.dni + " - " + item.nombres + " " + item.apellidos}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                color="red"
                variant="text"
                onClick={() => removeCliente(index)}
                disabled={clientes.length === 1}
              >
                ✖
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addCliente} color="blue">
            + Agregar Cliente
          </Button>

          {/* Predio */}
          <label className="block text-sm font-medium text-gray-900">Predio</label>
          <div>
            <select
              {...register("predio", { required: true })}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
            >
              <option value="">Seleccione un Predio</option>
              {dataPredios.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.manzana + " - " + item.lote}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="space-x-2 flex flex-wrap">
            <Button color="gray" variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" color="blue">
              {loading ? <Spinner /> : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogBody>

      <SelectPredioModal isOpen={isOpenSelectPredioModal} onClose={() => setIsOpenSelectPredioModal(false)} />
      <SelectClienteModal isOpen={isOpenSelectClienteModal} onClose={() => setIsOpenSelectClienteModal(false)} />
    </Dialog>
  );
};

export default PredioxClienteModal;
