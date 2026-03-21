import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardBody,
  Spinner,
} from "@material-tailwind/react";
import {
  BanknotesIcon,
  UsersIcon,
  CalendarIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/solid";
import * as XLSX from "xlsx";
import CronogramaModal from "@/widgets/me/CronogramaModal";
import { getFirstToExpire } from "@/requests/reqCuotas";
import { useQuery } from "@tanstack/react-query";
import ReciboModalNew from "@/widgets/me/ReciboModalNew";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Today's Money",
    value: "$53k",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "gray",
    icon: UsersIcon,
    title: "Today's Users",
    value: "2,300",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  }
];

export function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCronogramaOpen, setModalCronogramaOpen] = useState(false);

  const { data: cuotasPorVencer, isLoading: loading, refetch, isRefetching } = useQuery({
    queryKey: ["cuotasPorVencer"],
    queryFn: getFirstToExpire,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-1">
        <Card className="mt-6">
          <CardBody>
            <div
              variant="gradient"
              color="blue"
              className="flex items-center justify-between mb-4"
            >
              <Typography variant="h3">
                Cuotas cercanas a vencer 
              </Typography>
              <Button className="flex justify-center" onClick={refetch}>
                Recargar
              </Button>
            </div>
            {/* <Typography> */}
            {(!loading && !isRefetching) ? (
              cuotasPorVencer.data.length > 0 ? (
                <ul>
                  {cuotasPorVencer.data.map((cuota) => (
                    <li
                      className="mb-2 p-1 rounded-lg border border-black"
                      key={cuota.idCuota}
                    >
                      {cuota.manzana + "-" + cuota.lote} | {cuota.clientes[0]} |{" "}
                      {cuota.fecha_vencimiento?.split("T")[0]} |{" "}
                      {Number(cuota.monto).toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-500">No hay cuotas por vencer.</div>
              )
            ) : (
              <div className="flex justify-center items-center gap-2">
                Consultando... <Spinner color="blue" />
              </div>
            )}


            {/* </Typography> */}
          </CardBody>
          {/* <CardFooter className="pt-0">
            <Button>Read More</Button>
          </CardFooter> */}
        </Card>
      </div>
      <Button className="flex items-center gap-3" onClick={() => setModalOpen(true)}>Generar Recibo <DocumentChartBarIcon strokeWidth={2} className="h-4 w-4 " /></Button>
      <Button className="flex items-center gap-3 mt-2" onClick={() => setModalCronogramaOpen(true)}>Generar Cronograma de pagos <CalendarIcon strokeWidth={2} className="h-4 w-4 " /></Button>
      <ReciboModalNew isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <CronogramaModal isOpen={modalCronogramaOpen} onClose={() => setModalCronogramaOpen(false)} />
    </div>
  );
}

export default Home;
