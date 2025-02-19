import { Button, TextField, Typography } from '@mui/material'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../fireabase'
import React from 'react'

interface Props {}

const Login: React.FC<Props> = () => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("token", user.email || '');

      window.location.href = '/Inicio';
    } catch (error) {
      console.log('Error during login:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <Typography>Ingresa el correo</Typography>
      <TextField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
        fullWidth
      />
      <Typography>Ingresa la contraseña</Typography>
      <TextField
        type="password"  
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        size="small"
        fullWidth
      />
      <div style={{ display: 'flex', marginTop: '1rem' }}>
        <Button variant="contained" onClick={onSubmit}>
          Continuar
        </Button>
      </div>
      
      {error && <Typography color="error">{error}</Typography>} 
    </div>
  );
};

export default Login;
