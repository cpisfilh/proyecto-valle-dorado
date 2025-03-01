const DropdownInput = ({size="250px",data=["hola","nuevo"]}) => {
    return (
        <div style={{ width: size }}>
            <input
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Buscar"
            />
            <div>
            {
                data.length > 0 && data.map((item,index)=>
                    <div key={index} className="flex items-center space-x-4">
                        <div>hola</div>
                    </div>
                )
            }
            </div>
        </div>
    )
}
export default DropdownInput