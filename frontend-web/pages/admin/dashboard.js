import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUsuarios, crearUsuario, crearEstudiante, crearCatedratico, crearMateria } from '../../services/api';

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarForm, setMostrarForm] = useState('');
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario'));
    if (!user || user.rol !== 'Administrador') {
      router.push('/');
      return;
    }
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  const handleSubmit = async (e, tipo) => {
    e.preventDefault();
    try {
      if (tipo === 'usuario') {
        await crearUsuario(formData);
      } else if (tipo === 'estudiante') {
        await crearEstudiante(formData);
      } else if (tipo === 'catedratico') {
        await crearCatedratico(formData);
      } else if (tipo === 'materia') {
        await crearMateria(formData);
      }
      alert('Creado exitosamente');
      setMostrarForm('');
      setFormData({});
      cargarUsuarios();
    } catch (error) {
      alert('Error al crear');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Panel de Administración</h1>
        <button onClick={() => { localStorage.clear(); router.push('/'); }} style={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </div>

      <div style={styles.buttons}>
        <button onClick={() => setMostrarForm('usuario')} style={styles.btn}>Crear Usuario</button>
        <button onClick={() => setMostrarForm('estudiante')} style={styles.btn}>Crear Estudiante</button>
        <button onClick={() => setMostrarForm('catedratico')} style={styles.btn}>Crear Catedrático</button>
        <button onClick={() => setMostrarForm('materia')} style={styles.btn}>Crear Materia</button>
      </div>

      {mostrarForm === 'usuario' && (
        <form onSubmit={(e) => handleSubmit(e, 'usuario')} style={styles.form}>
          <h3>Crear Usuario</h3>
          <input placeholder="Correo" onChange={(e) => setFormData({...formData, correo: e.target.value})} style={styles.input} required />
          <input placeholder="Contraseña" type="password" onChange={(e) => setFormData({...formData, clave: e.target.value})} style={styles.input} required />
          <select onChange={(e) => setFormData({...formData, idRol: e.target.value})} style={styles.input} required>
            <option value="">Seleccionar Rol</option>
            <option value="1">Estudiante</option>
            <option value="2">Catedrático</option>
            <option value="3">Administrador</option>
          </select>
          <button type="submit" style={styles.submitBtn}>Crear</button>
        </form>
      )}

      {mostrarForm === 'estudiante' && (
        <form onSubmit={(e) => handleSubmit(e, 'estudiante')} style={styles.form}>
          <h3>Crear Estudiante</h3>
          <input placeholder="Expediente" onChange={(e) => setFormData({...formData, expediente: e.target.value})} style={styles.input} required />
          <input placeholder="Nombre" onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={styles.input} required />
          <input placeholder="Apellidos" onChange={(e) => setFormData({...formData, apellidos: e.target.value})} style={styles.input} required />
          <input placeholder="ID Usuario" type="number" onChange={(e) => setFormData({...formData, idUsuario: e.target.value})} style={styles.input} required />
          <input placeholder="ID Carrera" type="number" onChange={(e) => setFormData({...formData, idCarrera: e.target.value})} style={styles.input} required />
          <button type="submit" style={styles.submitBtn}>Crear</button>
        </form>
      )}

      {mostrarForm === 'catedratico' && (
        <form onSubmit={(e) => handleSubmit(e, 'catedratico')} style={styles.form}>
          <h3>Crear Catedrático</h3>
          <input placeholder="Nombre" onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={styles.input} required />
          <input placeholder="Apellidos" onChange={(e) => setFormData({...formData, apellidos: e.target.value})} style={styles.input} required />
          <input placeholder="ID Usuario" type="number" onChange={(e) => setFormData({...formData, idUsuario: e.target.value})} style={styles.input} required />
          <button type="submit" style={styles.submitBtn}>Crear</button>
        </form>
      )}

      {mostrarForm === 'materia' && (
        <form onSubmit={(e) => handleSubmit(e, 'materia')} style={styles.form}>
          <h3>Crear Materia</h3>
          <input placeholder="Código" onChange={(e) => setFormData({...formData, codigoMateria: e.target.value})} style={styles.input} required />
          <input placeholder="Nombre" onChange={(e) => setFormData({...formData, nombreMateria: e.target.value})} style={styles.input} required />
          <input placeholder="Unidades Valorativas" type="number" onChange={(e) => setFormData({...formData, unidadesValorativas: e.target.value})} style={styles.input} required />
          <input placeholder="ID Carrera" type="number" onChange={(e) => setFormData({...formData, idCarrera: e.target.value})} style={styles.input} required />
          <button type="submit" style={styles.submitBtn}>Crear</button>
        </form>
      )}

      <h2 style={{marginTop: '40px'}}>Usuarios Registrados</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Correo</th>
            <th style={styles.th}>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.idusuario}>
              <td style={styles.td}>{u.idusuario}</td>
              <td style={styles.td}>{u.correo}</td>
              <td style={styles.td}>{u.nombrerol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  logoutBtn: { padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  buttons: { display: 'flex', gap: '10px', marginBottom: '20px' },
  btn: { padding: '10px 20px', backgroundColor: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  form: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', maxWidth: '500px' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd' },
  submitBtn: { padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  table: { width: '100%', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' },
  th: { padding: '15px', textAlign: 'left', backgroundColor: '#1e40af', color: 'white' },
  td: { padding: '12px', borderBottom: '1px solid #e5e7eb' }
};
