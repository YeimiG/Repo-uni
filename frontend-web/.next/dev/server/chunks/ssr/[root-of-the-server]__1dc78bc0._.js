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
    baseURL: 'http://192.168.1.213:3000/api',
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
    try {
        const response = await API.get(`/catedratico/materias/${idCatedratico}`);
        return response.data;
    } catch (error) {
        console.log('Backend no disponible, usando datos de prueba');
        return [
            {
                idmateria: 1,
                codigomateria: 'MAT101',
                nombremateria: 'Matemática I',
                idgrupo: 1,
                numerogrupo: '01'
            },
            {
                idmateria: 2,
                codigomateria: 'ING101',
                nombremateria: 'Inglés I',
                idgrupo: 2,
                numerogrupo: '02'
            }
        ];
    }
};
const getEstudiantesGrupo = async (idGrupo)=>{
    try {
        const response = await API.get(`/catedratico/estudiantes/${idGrupo}`);
        return response.data;
    } catch (error) {
        console.log('Backend no disponible, usando datos de prueba');
        return [
            {
                idestudiante: 1,
                expediente: 'E001',
                nombre: 'Juan',
                apellidos: 'Pérez',
                nota1: 8.5,
                nota2: 7.0,
                nota3: 9.0,
                notafinal: 8.17,
                idinscripcion: 1
            },
            {
                idestudiante: 2,
                expediente: 'E002',
                nombre: 'María',
                apellidos: 'García',
                nota1: null,
                nota2: null,
                nota3: null,
                notafinal: null,
                idinscripcion: 2
            }
        ];
    }
};
const ingresarNotas = async (data)=>{
    try {
        const response = await API.post('/catedratico/notas', data);
        return response.data;
    } catch (error) {
        console.log('Backend no disponible');
        const notaFinal = ((data.nota1 + data.nota2 + data.nota3) / 3).toFixed(2);
        return {
            ...data,
            notafinal: notaFinal
        };
    }
};
const getUsuarios = async ()=>{
    try {
        const response = await API.get('/admin/usuarios');
        return response.data;
    } catch (error) {
        console.log('Backend no disponible, usando datos de prueba');
        return [
            {
                idusuario: 1,
                correo: 'admin@ieproes.edu.sv',
                nombrerol: 'Administrador'
            },
            {
                idusuario: 2,
                correo: 'cate@ieproes.edu.sv',
                nombrerol: 'Catedrático'
            },
            {
                idusuario: 3,
                correo: 'est@ieproes.edu.sv',
                nombrerol: 'Estudiante'
            }
        ];
    }
};
const crearUsuario = async (data)=>{
    try {
        const response = await API.post('/admin/usuarios', data);
        return response.data;
    } catch (error) {
        console.log('Backend no disponible');
        return {
            idusuario: Math.random(),
            ...data
        };
    }
};
const crearEstudiante = async (data)=>{
    try {
        const response = await API.post('/admin/estudiantes', data);
        return response.data;
    } catch (error) {
        console.log('Backend no disponible');
        return {
            idestudiante: Math.random(),
            ...data
        };
    }
};
const crearCatedratico = async (data)=>{
    try {
        const response = await API.post('/admin/catedraticos', data);
        return response.data;
    } catch (error) {
        console.log('Backend no disponible');
        return {
            idcatedratico: Math.random(),
            ...data
        };
    }
};
const crearMateria = async (data)=>{
    try {
        const response = await API.post('/admin/materias', data);
        return response.data;
    } catch (error) {
        console.log('Backend no disponible');
        return {
            idmateria: Math.random(),
            ...data
        };
    }
};
const __TURBOPACK__default__export__ = API;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend-web/pages/admin/dashboard.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Dashboard
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
function Dashboard() {
    const [usuarios, setUsuarios] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [mostrarForm, setMostrarForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const user = JSON.parse(localStorage.getItem('usuario'));
        if (!user || user.rol !== 'Administrador') {
            router.push('/');
            return;
        }
        cargarUsuarios();
    }, []);
    const cargarUsuarios = async ()=>{
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$services$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getUsuarios"])();
        setUsuarios(data);
    };
    const handleSubmit = async (e, tipo)=>{
        e.preventDefault();
        try {
            if (tipo === 'usuario') {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$services$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["crearUsuario"])(formData);
            } else if (tipo === 'estudiante') {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$services$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["crearEstudiante"])(formData);
            } else if (tipo === 'catedratico') {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$services$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["crearCatedratico"])(formData);
            } else if (tipo === 'materia') {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$web$2f$services$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["crearMateria"])(formData);
            }
            alert('Creado exitosamente');
            setMostrarForm('');
            setFormData({});
            cargarUsuarios();
        } catch (error) {
            alert('Error al crear');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: styles.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        children: "Panel de Administración"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 49,
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
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: styles.buttons,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMostrarForm('usuario'),
                        style: styles.btn,
                        children: "Crear Usuario"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMostrarForm('estudiante'),
                        style: styles.btn,
                        children: "Crear Estudiante"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMostrarForm('catedratico'),
                        style: styles.btn,
                        children: "Crear Catedrático"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMostrarForm('materia'),
                        style: styles.btn,
                        children: "Crear Materia"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            mostrarForm === 'usuario' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: (e)=>handleSubmit(e, 'usuario'),
                style: styles.form,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        children: "Crear Usuario"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "Correo",
                        onChange: (e)=>setFormData({
                                ...formData,
                                correo: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "Contraseña",
                        type: "password",
                        onChange: (e)=>setFormData({
                                ...formData,
                                clave: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                        onChange: (e)=>setFormData({
                                ...formData,
                                idRol: e.target.value
                            }),
                        style: styles.input,
                        required: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Seleccionar Rol"
                            }, void 0, false, {
                                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "1",
                                children: "Estudiante"
                            }, void 0, false, {
                                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "2",
                                children: "Catedrático"
                            }, void 0, false, {
                                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "3",
                                children: "Administrador"
                            }, void 0, false, {
                                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        style: styles.submitBtn,
                        children: "Crear"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                lineNumber: 63,
                columnNumber: 9
            }, this),
            mostrarForm === 'estudiante' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: (e)=>handleSubmit(e, 'estudiante'),
                style: styles.form,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        children: "Crear Estudiante"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "Expediente",
                        onChange: (e)=>setFormData({
                                ...formData,
                                expediente: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "Nombre",
                        onChange: (e)=>setFormData({
                                ...formData,
                                nombre: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "Apellidos",
                        onChange: (e)=>setFormData({
                                ...formData,
                                apellidos: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "ID Usuario",
                        type: "number",
                        onChange: (e)=>setFormData({
                                ...formData,
                                idUsuario: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "ID Carrera",
                        type: "number",
                        onChange: (e)=>setFormData({
                                ...formData,
                                idCarrera: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        style: styles.submitBtn,
                        children: "Crear"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                lineNumber: 78,
                columnNumber: 9
            }, this),
            mostrarForm === 'catedratico' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: (e)=>handleSubmit(e, 'catedratico'),
                style: styles.form,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        children: "Crear Catedrático"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "Nombre",
                        onChange: (e)=>setFormData({
                                ...formData,
                                nombre: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "Apellidos",
                        onChange: (e)=>setFormData({
                                ...formData,
                                apellidos: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "ID Usuario",
                        type: "number",
                        onChange: (e)=>setFormData({
                                ...formData,
                                idUsuario: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        style: styles.submitBtn,
                        children: "Crear"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                lineNumber: 90,
                columnNumber: 9
            }, this),
            mostrarForm === 'materia' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: (e)=>handleSubmit(e, 'materia'),
                style: styles.form,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        children: "Crear Materia"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "Código",
                        onChange: (e)=>setFormData({
                                ...formData,
                                codigoMateria: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "Nombre",
                        onChange: (e)=>setFormData({
                                ...formData,
                                nombreMateria: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "Unidades Valorativas",
                        type: "number",
                        onChange: (e)=>setFormData({
                                ...formData,
                                unidadesValorativas: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        placeholder: "ID Carrera",
                        type: "number",
                        onChange: (e)=>setFormData({
                                ...formData,
                                idCarrera: e.target.value
                            }),
                        style: styles.input,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        style: styles.submitBtn,
                        children: "Crear"
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                lineNumber: 100,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                style: {
                    marginTop: '40px'
                },
                children: "Usuarios Registrados"
            }, void 0, false, {
                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                style: styles.table,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                    style: styles.th,
                                    children: "ID"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                    style: styles.th,
                                    children: "Correo"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                    style: styles.th,
                                    children: "Rol"
                                }, void 0, false, {
                                    fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                        children: usuarios.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                        style: styles.td,
                                        children: u.idusuario
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                        lineNumber: 122,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                        style: styles.td,
                                        children: u.correo
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                        lineNumber: 123,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                        style: styles.td,
                                        children: u.nombrerol
                                    }, void 0, false, {
                                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, u.idusuario, true, {
                                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend-web/pages/admin/dashboard.js",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend-web/pages/admin/dashboard.js",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f3f4f6',
        minHeight: '100vh'
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
    buttons: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
    },
    btn: {
        padding: '10px 20px',
        backgroundColor: '#1e40af',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
    },
    form: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        maxWidth: '500px'
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '6px',
        border: '1px solid #ddd'
    },
    submitBtn: {
        padding: '10px 20px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
    },
    table: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden'
    },
    th: {
        padding: '15px',
        textAlign: 'left',
        backgroundColor: '#1e40af',
        color: 'white'
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #e5e7eb'
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1dc78bc0._.js.map