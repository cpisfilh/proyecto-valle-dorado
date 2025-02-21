import React, { useEffect, useState } from "react";
import Table from "@/custom/components/Table";
import { getManzanas } from "@/requests/reqManzanas";
import { Outlet, useLocation } from "react-router-dom";

export function Blocks() {
    const [blockData, setBlockData] = useState([]);
    const location = useLocation();
    const [loading , setLoading] = useState(true);
    //campos de la tabla para crear manzanas con algunas propiedades
    const blockFields = [{
        name: "valor",
        disabled: false,
        type : "text",
        required: true,
        maxLength: 2,
        minLength: 1
    }];
    async function getData() {
        const data = await getManzanas()
        setBlockData(data.data);
        setLoading(false);
    }

    useEffect(() => {
        if(location.pathname.endsWith("/manzanas")){
            getData();
        }
    }, [location]);

    const isManzanasRoute = location.pathname.endsWith("/manzanas");

    return (
        <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
            {isManzanasRoute && 
                <Table 
                    title="Tabla de Manzanas"
                    loading={loading} 
                    entity="Manzana" data={blockData} 
                    fields={blockFields}
                    getData={getData}
                     />}
            <Outlet />
        </div>
    );
}

export default Blocks;
