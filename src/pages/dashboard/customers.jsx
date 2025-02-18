import React from "react";
import Table from "@/custom/components/Table";

const customerData = [
    {
        id: 1,
        nombres: "John Michael",
        apellidos: "Kansas vegas",
        celular: "123456789",
    },
    {
        id: 2,
        nombres: "Alexa Liras",
        apellidos: "Kansas vegas",
        celular: "123456789",
    },
    {
        id: 3,
        nombres: "Laurent Perrier",
        apellidos: "Kansas vegas",
        celular: "123456789",
    },
    {
        id: 4,
        nombres: "Michael Levi",
        apellidos: "Kansas vegas",
        celular: "123456789",
    },
    {
        id: 5,
        nombres: "Michael Levi",
        apellidos: "Kansas vegas",
        celular: "123456789",
    },
]

export function Customers() {

    return (
        <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
            <Table title="Tabla de Clientes" data={customerData} />
        </div>
    );
}

export default Customers;
