import React, { useEffect, useState } from "react";
import Table from "@/custom/components/Table";
import { getLotes } from "@/requests/reqLotes";
import { Outlet, useLocation } from "react-router-dom";

export function Lots() {
    const [lotData, setLotData] = useState([]);
    const location = useLocation();
    const [loading , setLoading] = useState(true);
    //campos de la tabla para crear lotes con algunas propiedades
    const lotFields = [{
        name: "valor",
        disabled: false,
        type : "text",
        required: true,
        maxLength: 2,
        minLength: 1
    }];
    async function getData() {
        const data = await getLotes()
        setLotData(data.data);
        setLoading(false);
    }

    useEffect(() => {
        if(location.pathname.endsWith("/lotes")){
            getData();
        }
    }, [location]);

    const isLotesRoute = location.pathname.endsWith("/lotes");

    return (
        <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
            {isLotesRoute && 
                <Table 
                    title="Tabla de Lotes"
                    loading={loading} 
                    entity="Lote" data={lotData} 
                    fields={lotFields}
                    getData={getData}
                     />}
            <Outlet />
        </div>
    );
}

export default Lots;
