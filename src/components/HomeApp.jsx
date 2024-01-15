import React, { useCallback, useEffect, useState } from 'react'
import '../styles/Home.css'
import * as XLSX from 'xlsx';
import { CodeEditor } from './CodeEditor';
export const HomeApp = () => {
    const [file, setfile] = useState(null);
    const [datos, setdatos] = useState([]);
    const [hojas, sethojas] = useState([]);
    const [hojaActiva, setHojaActiva] = useState(0);
    const showTable = () => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.SheetNames[hojaActiva];
            sethojas(workbook.SheetNames);
            const dataSheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            setdatos(dataSheet);
        };
        reader.readAsArrayBuffer(file);
    };

    const downloadFile = (arr) => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(arr);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

        const link = document.createElement('a');
        const url = URL.createObjectURL(dataBlob);
        link.href = url;
        link.download = 'reporte.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    const handleDataProcess = useCallback((processFunction) => {
        try {
            const processedData = processFunction(datos);
            downloadFile(processedData);
        } catch (error) {
            console.error("Error al procesar los datos:", error);
        }
    }, [datos]);

    useEffect(() => {
        if (file) {
            showTable();
        }
    }, [file])

    useEffect(() => {
        showTable();
    }, [file, hojaActiva]);

    return (
        <>
            <div className="container">

                <h2>Procesador de archivos Excel</h2>
                <hr />
                <button className='btn-select'>Seleccionar archivo
                    <input type="file" onChange={(e) => setfile(e.target.files[0])} />
                </button>
                {
                    file && (
                        <div>
                            <div className='file-item'>
                                {file.name}
                            </div>
                            <br />
                            {
                                datos.length > 0 && (
                                    <div>
                                        <div className='hojas'>
                                            {
                                                hojas.map((x, idx) => (
                                                    <span onClick={() => setHojaActiva(idx)} key={x} className={`${hojaActiva == idx ? 'hoja-activa' : 'hoja'}`}>{x}</span>
                                                ))
                                            }
                                        </div>
                                        <table className='tabla'>
                                            <thead >
                                                <tr>
                                                    {
                                                        Object.keys(datos[0]).slice(0, 10).map(key => (
                                                            <th key={key}>{key}</th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    datos.slice(0, 10).map((item, idx) => (
                                                        <tr key={idx}>
                                                            {
                                                                Object.keys(item).slice(0, 10).map(key => (
                                                                    <td key={key + idx} className='celda'>{item[key]}</td>
                                                                ))
                                                            }
                                                        </tr>
                                                    ))
                                                }
                                                {
                                                    datos.length > 10 && (<tr>
                                                        {
                                                            Object.keys(datos[0]).slice(0, 10).map(key => (
                                                                <td key={key} className='celda'>...</td>
                                                            ))
                                                        }
                                                    </tr>)
                                                }
                                                {
                                                    datos.length > 11 && (<tr>
                                                        {
                                                            Object.keys(datos[datos.length - 1]).slice(0, 10).map(key => (
                                                                <td key={key} className='celda'>{datos[datos.length - 1][key]}</td>
                                                            ))
                                                        }
                                                    </tr>)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            }
                            {
                                datos.length == 0 && (<div className='screen-load mt-4'>
                                    <div className="head"></div>
                                    <div className="body"></div>
                                </div>)
                            }
                            <br />
                        </div>
                    )
                }
                <hr />
                <CodeEditor onDataProcess={handleDataProcess} />
                <br />
            </div>
        </>
    )
}

