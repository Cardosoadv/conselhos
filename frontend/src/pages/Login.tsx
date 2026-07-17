import { useState, useContext, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div style={styles.container}>
      <div className="card" style={styles.card}>
        <div className="card-header" style={styles.header}>
          <h2>Entrar</h2>
          <p>Bem-vindo ao Conselhos</p>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label>E-mail</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Senha</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={styles.button}>
              Entrar
            </button>
          </form>
          <div style={styles.footer}>
            <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f6fa'
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px'
  },
  header: {
    textAlign: 'center' as const,
    borderBottom: 'none',
    paddingBottom: '0'
  },
  formGroup: {
    marginBottom: '15px'
  },
  button: {
    width: '100%',
    marginTop: '10px'
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center' as const
  }
};
