import { Box, Button, TextField, Typography } from '@mui/material'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../fireabase'
import image from '../../assets/ciniaSinFondo.png'
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
<div style={{ display: "flex", height: "100vh", alignItems: "center" }}>
  <Box
    sx={{
      width: "30vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <img src={image} alt="logo" style={{ height: "auto", width: "80%" }} />
  </Box>

  <Box
    sx={{
      width: '600px',
      height: '80vh',
      borderRadius: 5,
      border: "1px solid lightgray",
      padding: 5,
      marginX: "auto"
    }}
  >
    <Typography fontWeight={"semibold"} sx={{ textAlign: 'center' }} fontSize={25} marginTop={20} marginBottom={3}>
      CINIA Polares
    </Typography>
    <Typography>Ingresa el correo</Typography>
    <form onSubmit={onSubmit}>
      <TextField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
        fullWidth
        sx={{ marginBottom: 5 }}
      />
      <Typography>Ingresa la contraseña</Typography>
      <TextField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        size="small"
        fullWidth
        sx={{ marginBottom: 4 }}
      />
      <div style={{ display: "flex", marginTop: "2rem" }}>
        <Button
          sx={{ marginLeft: "auto", marginRight: 0 }}
          fullWidth
          type="submit"
          variant="contained"
          onClick={onSubmit}
        >
          Continuar
        </Button>
      </div>
    </form>

    {error && <Typography color="error">{error}</Typography>}
  </Box>
</div>

  );
};

export default Login;
