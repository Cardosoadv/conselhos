import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register', { name, email, password });
      setSuccess('Usuário criado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar usuário');
    }
  };

  return (
    <div style={styles.container}>
      <div className="card" style={styles.card}>
        <div className="card-header" style={styles.header}>
          <h2>Cadastrar</h2>
          <p>Crie sua conta no Conselhos</p>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label>Nome</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              Registrar
            </button>
          </form>
          <div style={styles.footer}>
            <p>Já tem uma conta? <Link to="/login">Entrar</Link></p>
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
