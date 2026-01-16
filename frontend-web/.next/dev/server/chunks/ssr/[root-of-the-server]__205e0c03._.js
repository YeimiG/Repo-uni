module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/frontend-web/services/api.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "crearCatedratico",
    ()=>crearCatedratico,
    "crearEstudiante",
    ()=>crearEstudiante,
    "crearMateria",
    ()=>crearMateria,
    "crearUsuario",
    ()=>crearUsuario,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getEstudiantesGrupo",
    ()=>getEstudiantesGrupo,
    "getMateriasCatedratico",
    ()=>getMateriasCatedratico,
    "getUsuarios",
    ()=>getUsuarios,
    "ingresarNotas",
    ()=>ingresarNotas,
    "login",
    ()=>login
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$frontend$2d$web$2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/frontend-web/node_modules/axios)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$frontend$2d$web$2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$frontend$2d$web$2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const API = __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$frontend$2d$web$2f$node_modules$2f$axios$29$__["default"].create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000
});
const login = async (correo, clave)=>{
    const response = await API.post('/auth/login', {
        correo,
        clave
    });
    return response.data;
};
const getMateriasCatedratico = async (idCatedratico)=>{
    const response = await API.get(`/catedratico/materias/${idCatedratico}`);
    return response.data;
};
const getEstudiantesGrupo = async (idGrupo)=>{
    const response = await API.get(`/catedratico/estudiantes/${idGrupo}`);
    return response.data;
};
const ingresarNotas = async (data)=>{
    const response = await API.post('/catedratico/notas', data);
    return response.data;
};
const getUsuarios = async ()=>{
    const response = await API.get('/admin/usuarios');
    return response.data;
};
const crearUsuario = async (data)=>{
    const response = await API.post('/admin/usuarios', data);
    return response.data;
};
const crearEstudiante = async (data)=>{
    const response = await API.post('/admin/estudiantes', data);
    return response.data;
};
const crearCatedratico = async (data)=>{
    const response = await API.post('/admin/catedraticos', data);
    return response.data;
};
const crearMateria = async (data)=>{
    const response = await API.post('/admin/materias', data);
    return response.data;
};
const __TURBOPACK__default__export__ = API;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend-web/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Login
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-web/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$services$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-web/services/api.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$services$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$services$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function Login() {
    const [correo, setCorreo] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [clave, setClave] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$services$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["login"])(correo, clave);
            if (data.success) {
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                if (data.usuario.rol === 'Administrador') {
                    router.push('/admin/dashboard');
                } else if (data.usuario.rol === 'Catedrático') {
                    router.push('/catedratico/mis-materias');
                } else {
                    setError('Este portal es solo para administradores y catedráticos');
                }
            }
        } catch (err) {
            setError('Credenciales incorrectas');
        }
    };
    const entrarDirecto = (rol)=>{
        const usuarioDemo = {
            idUsuario: 1,
            correo: 'demo@ieproes.edu.sv',
            rol: rol,
            idCatedratico: rol === 'Catedrático' ? 1 : null,
            nombre: 'Demo',
            apellidos: 'Usuario'
        };
        localStorage.setItem('usuario', JSON.stringify(usuarioDemo));
        if (rol === 'Administrador') {
            router.push('/admin/dashboard');
        } else {
            router.push('/catedratico/mis-materias');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: styles.container,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: styles.card,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    style: styles.title,
                    children: "IEPROES - Portal Web"
                }, void 0, false, {
                    fileName: "[project]/frontend-web/pages/index.js",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            type: "email",
                            placeholder: "Correo",
                            value: correo,
                            onChange: (e)=>setCorreo(e.target.value),
                            style: styles.input,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/frontend-web/pages/index.js",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            type: "password",
                            placeholder: "Contraseña",
                            value: clave,
                            onChange: (e)=>setClave(e.target.value),
                            style: styles.input,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/frontend-web/pages/index.js",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "submit",
                            style: styles.button,
                            children: "Ingresar"
                        }, void 0, false, {
                            fileName: "[project]/frontend-web/pages/index.js",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend-web/pages/index.js",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    style: styles.error,
                    children: error
                }, void 0, false, {
                    fileName: "[project]/frontend-web/pages/index.js",
                    lineNumber: 72,
                    columnNumber: 19
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: styles.demoButtons,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            style: styles.demoText,
                            children: "Acceso directo:"
                        }, void 0, false, {
                            fileName: "[project]/frontend-web/pages/index.js",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>entrarDirecto('Administrador'),
                            style: styles.demoBtn,
                            children: "Admin"
                        }, void 0, false, {
                            fileName: "[project]/frontend-web/pages/index.js",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>entrarDirecto('Catedrático'),
                            style: styles.demoBtn,
                            children: "Catedrático"
                        }, void 0, false, {
                            fileName: "[project]/frontend-web/pages/index.js",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend-web/pages/index.js",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend-web/pages/index.js",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend-web/pages/index.js",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#1e40af'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        width: '400px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#1e40af'
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#1e40af',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: '10px'
    },
    demoButtons: {
        marginTop: '20px',
        borderTop: '1px solid #ddd',
        paddingTop: '20px'
    },
    demoText: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '10px',
        fontSize: '14px'
    },
    demoBtn: {
        width: '48%',
        padding: '10px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginRight: '4%',
        fontSize: '14px'
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__205e0c03._.js.map