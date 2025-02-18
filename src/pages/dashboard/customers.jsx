import React, { useEffect, useState } from "react";
import Table from "@/custom/components/Table";
import { getClientes } from "@/requests/reqClientes";
import { Outlet, useLocation } from "react-router-dom";

export function Customers() {
    const [customerData, setCustomerData] = useState([]);
    const location = useLocation();

    function getData() {
        getClientes().then((res) => {
            setCustomerData(res.data);
        });
    }

    useEffect(() => {
        getData();
    }, []);

    const isClientesRoute = location.pathname.endsWith("/clientes");

    return (
        <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
            {isClientesRoute && <Table title="Tabla de Clientes" entity="Cliente" data={customerData} />}
            <Outlet />
        </div>
    );
}

export default Customers;
