import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getMateriasCatedratico } from '../../services/api';

export default function MisMaterias() {
  const [materias, setMaterias] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario'));
    if (!user || user.rol !== 'Catedrático') {
      router.push('/');
      return;
    }
    setUsuario(user);
    cargarMaterias(user.idCatedratico);
  }, []);

  const cargarMaterias = async (idCatedratico) => {
    try {
      const data = await getMateriasCatedratico(idCatedratico);
      setMaterias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const verEstudiantes = (idGrupo, nombreMateria, numeroGrupo) => {
    router.push({
      pathname: '/catedratico/ingresar-notas',
      query: { idGrupo, nombreMateria, numeroGrupo }
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Mis Materias</h1>
        <button onClick={() => { localStorage.clear(); router.push('/'); }} style={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </div>
      
      <div style={styles.content}>
        {materias.length === 0 ? (
          <p>No tienes materias asignadas</p>
        ) : (
          materias.map((m) => (
            <div key={m.idgrupo} style={styles.card}>
              <h3>{m.nombremateria}</h3>
              <p>Código: {m.codigomateria}</p>
              <p>Grupo: {m.numerogrupo}</p>
              <button onClick={() => verEstudiantes(m.idgrupo, m.nombremateria, m.numerogrupo)} style={styles.btn}>
                Ver Estudiantes
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  logoutBtn: { padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  content: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  btn: { marginTop: '10px', padding: '10px', backgroundColor: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }
};
