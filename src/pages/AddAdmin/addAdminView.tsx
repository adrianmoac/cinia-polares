import React from 'react';
import { Alert, Box, Button, Grid2, TextField, Typography } from '@mui/material';
import Datepicker from '../../helpers/datepicker';

export interface AdminData {
  name: string;
  lastName: string;
  email: string;
  birthDate: string | null;
  password: string;
  repeteadPassword: string;
}

interface AddAdminViewProps {
  adminData: AdminData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddAdmin: () => void;
  handleDateChange: (e: any) => void;
  error: string;
}

const AddAdminView: React.FC<AddAdminViewProps> = ({ adminData, handleChange, handleAddAdmin, handleDateChange, error }) => {
  return (
    <Box margin={4}>
      {error && (
        <Alert severity="error" sx={{ position: 'absolute', zIndex: 50, right: 40 }}>
          {error}
        </Alert>
      )}
      <Typography variant="h5">Agregar administrador</Typography>
      <Grid2
        container
        display="flex"
        flexDirection="row"
        gap={5}
        sx={{ width: '100%', marginTop: 5, justifyContent: 'space-between' }}
      >
        <Grid2 size={{ lg: 5.8, xs: 12 }}>
          <Typography>Nombre</Typography>
          <TextField
            name="name"
            size="small"
            fullWidth
            onChange={handleChange}
            value={adminData.name}
          />
        </Grid2>
        <Grid2 size={{ lg: 5.8, xs: 12 }}>
          <Typography>Apellidos</Typography>
          <TextField
            name="lastName"
            size="small"
            fullWidth
            onChange={handleChange}
            value={adminData.lastName}
          />
        </Grid2>
      </Grid2>
      <Grid2
        container
        display="flex"
        flexDirection="row"
        gap={5}
        sx={{ width: '100%', marginTop: 5, justifyContent: 'space-between' }}
      >
        <Grid2 flex={1} size={{ lg: 5.8, xs: 12 }}>
          <Typography>Fecha de nacimiento</Typography>
          <Datepicker
            size="small"
            onChange={handleDateChange}
            value={adminData.birthDate}
          />
        </Grid2>
        <Grid2 flex={1} size={{ lg: 5.8, xs: 12 }}>
          <Typography>Correo electrónico</Typography>
          <TextField
            name="email"
            size="small"
            fullWidth
            onChange={handleChange}
            value={adminData.email}
          />
        </Grid2>
      </Grid2>
      <Grid2
        container
        display="flex"
        flexDirection="row"
        gap={5}
        sx={{ width: '100%', marginTop: 5, justifyContent: 'space-between' }}
      >
        <Grid2 flex={1} size={{ lg: 5.8, xs: 12 }}>
          <Typography>Contraseña</Typography>
          <TextField
            name="password"
            size="small"
            type="password"
            fullWidth
            onChange={handleChange}
            value={adminData.password}
          />
        </Grid2>
        <Grid2 flex={1} size={{ lg: 5.8, xs: 12 }}>
          <Typography>Confirmar contraseña</Typography>
          <TextField
            name="repeteadPassword"
            size="small"
            type="password"
            fullWidth
            onChange={handleChange}
            value={adminData.repeteadPassword}
          />
        </Grid2>
      </Grid2>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }} gap={2}>
        <Button variant="outlined" onClick={() => (window.location.href = 'Inicio')}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleAddAdmin}>
          Aceptar
        </Button>
      </Box>
    </Box>
  );
};

export default AddAdminView;