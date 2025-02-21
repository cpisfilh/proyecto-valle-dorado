import React, { useEffect, useState } from "react";
import Table from "@/custom/components/Table";
import { getClientes } from "@/requests/reqClientes";
import { Outlet, useLocation } from "react-router-dom";

export function Customers() {
    const [customerData, setCustomerData] = useState([]);
    const location = useLocation();
    const [loading , setLoading] = useState(true);
    //campos de la tabla para crear clientes con algunas propiedades
    const customerFields = [{
        name: "dni",
        disabled: false,
        type : "text",
        required: true,
        maxLength: 8,
        minLength: 8
    },{
        name: "nombres",
        disabled: false,
        type : "text",
        required: true,
        maxLength: 50,
        minLength: 2
    },{
        name: "apellidos",
        disabled: false,
        type : "text",
        required: true,
        maxLength: 50,
        minLength: 2
    },{
        name: "celular",
        disabled: false,
        type : "number",
        required: true,
        maxLength: 9,
        minLength: 9
    }];
    async function getData() {
        const data = await getClientes()
        setCustomerData(data.data);
        setLoading(false);
    }

    useEffect(() => {
        if(location.pathname.endsWith("/clientes")){
            getData();
        }
    }, [location]);

    const isClientesRoute = location.pathname.endsWith("/clientes");

    return (
        <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
            {isClientesRoute && 
                <Table 
                    title="Tabla de Clientes"
                    loading={loading} 
                    entity="Cliente" data={customerData} 
                    fields={customerFields}
                    getData={getData}
                     />}
            <Outlet />
        </div>
    );
}

export default Customers;
