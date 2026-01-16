import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getEstudiantesGrupo, ingresarNotas } from '../../services/api';

export default function IngresarNotas() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();
  const { idGrupo, nombreMateria, numeroGrupo } = router.query;

  useEffect(() => {
    if (idGrupo) {
      cargarEstudiantes();
    }
  }, [idGrupo]);

  const cargarEstudiantes = async () => {
    try {
      const data = await getEstudiantesGrupo(idGrupo);
      setEstudiantes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotaChange = (index, campo, valor) => {
    const nuevosEstudiantes = [...estudiantes];
    nuevosEstudiantes[index][campo] = parseFloat(valor) || 0;
    setEstudiantes(nuevosEstudiantes);
  };

  const guardarNotas = async (estudiante) => {
    try {
      await ingresarNotas({
        idInscripcion: estudiante.idinscripcion,
        nota1: estudiante.nota1 || 0,
        nota2: estudiante.nota2 || 0,
        nota3: estudiante.nota3 || 0
      });
      setMensaje('Notas guardadas correctamente');
      setTimeout(() => setMensaje(''), 3000);
      cargarEstudiantes();
    } catch (error) {
      setMensaje('Error al guardar notas');
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => router.back()} style={styles.backBtn}>← Volver</button>
      <h1>{nombreMateria} - Grupo {numeroGrupo}</h1>
      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Expediente</th>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Nota 1</th>
            <th style={styles.th}>Nota 2</th>
            <th style={styles.th}>Nota 3</th>
            <th style={styles.th}>Final</th>
            <th style={styles.th}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est, index) => (
            <tr key={est.idestudiante}>
              <td style={styles.td}>{est.expediente}</td>
              <td style={styles.td}>{est.nombre} {est.apellidos}</td>
              <td style={styles.td}>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={est.nota1 || ''}
                  onChange={(e) => handleNotaChange(index, 'nota1', e.target.value)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={est.nota2 || ''}
                  onChange={(e) => handleNotaChange(index, 'nota2', e.target.value)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={est.nota3 || ''}
                  onChange={(e) => handleNotaChange(index, 'nota3', e.target.value)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>{est.notafinal || '-'}</td>
              <td style={styles.td}>
                <button onClick={() => guardarNotas(est)} style={styles.btn}>Guardar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' },
  backBtn: { padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' },
  mensaje: { padding: '10px', backgroundColor: '#10b981', color: 'white', borderRadius: '8px', marginBottom: '20px' },
  table: { width: '100%', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  th: { padding: '15px', textAlign: 'left', backgroundColor: '#1e40af', color: 'white' },
  td: { padding: '12px', borderBottom: '1px solid #e5e7eb' },
  input: { width: '80px', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' },
  btn: { padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};
