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
"[project]/frontend-web/pages/catedratico/mis-materias.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>MisMaterias
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
function MisMaterias() {
    const [materias, setMaterias] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [usuario, setUsuario] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const user = JSON.parse(localStorage.getItem('usuario'));
        if (!user || user.rol !== 'Catedrático') {
            router.push('/');
            return;
        }
        setUsuario(user);
        cargarMaterias(user.idCatedratico);
    }, []);
    const cargarMaterias = async (idCatedratico)=>{
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$services$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getMateriasCatedratico"])(idCatedratico);
            setMaterias(data);
        } catch (error) {
            console.error(error);
        }
    };
    const verEstudiantes = (idGrupo, nombreMateria, numeroGrupo)=>{
        router.push({
            pathname: '/catedratico/ingresar-notas',
            query: {
                idGrupo,
                nombreMateria,
                numeroGrupo
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: styles.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        children: "Mis Materias"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            localStorage.clear();
                            router.push('/');
                        },
                        style: styles.logoutBtn,
                        children: "Cerrar Sesión"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: styles.content,
                children: materias.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    children: "No tienes materias asignadas"
                }, void 0, false, {
                    fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
                    lineNumber: 47,
                    columnNumber: 11
                }, this) : materias.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: styles.card,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                children: m.nombremateria
                            }, void 0, false, {
                                fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
                                lineNumber: 51,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                children: [
                                    "Código: ",
                                    m.codigomateria
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
                                lineNumber: 52,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                children: [
                                    "Grupo: ",
                                    m.numerogrupo
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
                                lineNumber: 53,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>verEstudiantes(m.idgrupo, m.nombremateria, m.numerogrupo),
                                style: styles.btn,
                                children: "Ver Estudiantes"
                            }, void 0, false, {
                                fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
                                lineNumber: 54,
                                columnNumber: 15
                            }, this)
                        ]
                    }, m.idgrupo, true, {
                        fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
                        lineNumber: 50,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-web/pages/catedratico/mis-materias.js",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
    },
    logoutBtn: {
        padding: '10px 20px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
    },
    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    btn: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#1e40af',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '100%'
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__404de976._.js.map