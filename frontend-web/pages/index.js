import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../services/api';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(correo, clave);
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

  const entrarDirecto = (rol) => {
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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>IEPROES - Portal Web</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Ingresar</button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        
        <div style={styles.demoButtons}>
          <p style={styles.demoText}>Acceso directo:</p>
          <button onClick={() => entrarDirecto('Administrador')} style={styles.demoBtn}>Admin</button>
          <button onClick={() => entrarDirecto('Catedrático')} style={styles.demoBtn}>Catedrático</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1e40af' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '20px', width: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', marginBottom: '30px', color: '#1e40af' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center', marginTop: '10px' },
  demoButtons: { marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' },
  demoText: { textAlign: 'center', color: '#666', marginBottom: '10px', fontSize: '14px' },
  demoBtn: { width: '48%', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '4%', fontSize: '14px' }
};
