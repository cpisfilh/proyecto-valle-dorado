import React, { useEffect, useState } from "react";
import Table from "@/custom/components/Table";
import { Outlet, useLocation } from "react-router-dom";
import { getPredios } from "@/requests/reqPredios";
import axiosInstance from "@/requests/axiosConfig";

export function Properties() {
    const [propertyData, setPropertyData] = useState([]);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    //campos de la tabla para crear predios con algunas propiedades
    const propertyFields = [{
        name: "manzana",
        disabled: false,
        type: "select",
        required: true,
        maxLength: 8,
        minLength: 8
    }, {
        name: "lote",
        disabled: false,
        type: "select",
        required: true,
        maxLength: 50,
        minLength: 2
    }];

    const selectFields = propertyFields.filter((field) => field.type === "select")
    const [selectState, setSelectState] = useState(
        selectFields.reduce((acc, field) => ({ ...acc, [field.name]: [] }), {})
    );
    async function getData() {
        const data = await getPredios()
        setPropertyData(data.data);
        setLoading(false);
    }

    useEffect(() => {
        if (location.pathname.endsWith("/predios")) {
            getData();
        }
        if (selectFields.length === 0) return
        selectFields.forEach(async (field) => {
            try {
                const response = await axiosInstance.get(`/${field.name}`);
                setSelectState((prev) => ({ ...prev, [field.name]: response.data }));
            } catch (error) {
                console.error(`Error al cargar ${field.name}:`, error);
            }
        });
    }, [location]);

    const isPrediosRoute = location.pathname.endsWith("/predios");

    return (
        <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
            {isPrediosRoute &&
                <Table
                    title="Tabla de Predios"
                    loading={loading}
                    entity="Predio" data={propertyData}
                    fields={propertyFields}
                    getData={getData}
                    relatedData={{
                        manzana: selectState.manzana.data,
                        lote: selectState.lote.data
                    }}
                />}
            <Outlet />
        </div>
    );
}

export default Properties;
