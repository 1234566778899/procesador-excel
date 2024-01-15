import React, { useState } from 'react';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

export const CodeEditor = ({ onDataProcess }) => {

    const defaultFunction = `
    return data;
   `;

    const [code, setCode] = useState(defaultFunction);

    const handleExecute = () => {
        // Ejecutar la función segura
        try {
            // eslint-disable-next-line no-new-func
            const userFunction = new Function("data", code);
            onDataProcess(userFunction);
        } catch (error) {
            console.error("Error al ejecutar el código:", error);
        }
    };

    return (
        <div>
            <AceEditor
                mode="javascript"
                theme="github"
                value={code}
                onChange={setCode}
                name="codeEditor"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    useWorker: false // Desactiva el worker para evitar errores
                }}
                style={{ height: '400px', width: '100%' }}
            />
            <button className='btn-select mt-3' onClick={handleExecute}>Exportar Excel <i class="fa-solid fa-download ms-2"></i></button>
        </div>
    );
};
