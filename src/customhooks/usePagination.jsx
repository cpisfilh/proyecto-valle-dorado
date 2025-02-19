import { useState, useMemo, useEffect } from "react";

const usePagination = (data, itemsPerPage = 5) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    useEffect(() => {
        // Si la página actual está vacía y no es la primera, retrocede a la anterior
        if (currentPage > totalPages && currentPage > 1) {
            setCurrentPage(totalPages);
        }
    }, [data, totalPages, currentPage]);

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return { currentData, currentPage, totalPages, nextPage, prevPage, setCurrentPage };
};

export default usePagination;
