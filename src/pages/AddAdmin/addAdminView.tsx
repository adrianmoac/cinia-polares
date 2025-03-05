import React from 'react';
import { Alert, Box, Button, Checkbox, FormControlLabel, Grid2, TextField, Typography, FormHelperText } from '@mui/material';
import Datepicker from '../../helpers/datepicker';
import dayjs from 'dayjs';
import Loading from '../../helpers/loading';

interface AdminData {
  name: string;
  lastName: string;
  email: string;
  birthDate: string | null;
  password: string;
  repeteadPassword: string;
  isAdmin: boolean;
}

interface AddAdminViewProps {
  adminData: AdminData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddAdmin: () => void;
  handleDateChange: (e: any) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  loading: boolean;
  formErrors: {
    name: boolean;
    lastName: boolean;
    email: boolean;
    birthDate: boolean;
    password: boolean;
    repeteadPassword: boolean;
  };
}

const AddAdminView: React.FC<AddAdminViewProps> = ({
  adminData,
  handleChange,
  handleAddAdmin,
  handleDateChange,
  handleCheckboxChange,
  loading,
  error,
}) => {
  return (
    <Box margin={4}>
      {error && (
        <Alert severity="error" sx={{ position: 'absolute', zIndex: 50, right: 40 }}>
          {error}
        </Alert>
      )}
      {loading &&
        <Loading />
      }
      <Typography variant="h5">Agregar usuario</Typography>

      <Grid2 container spacing={5} sx={{ marginTop: 5 }}>
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

      <Grid2 container spacing={5} sx={{ marginTop: 5 }}>
        <Grid2 size={{ lg: 5.8, xs: 12 }}>
          <Typography>Fecha de nacimiento</Typography>
          <Datepicker size="small" maxDate={dayjs(new Date())} onChange={handleDateChange} value={adminData.birthDate} />
        </Grid2>
        <Grid2 size={{ lg: 5.8, xs: 12 }}>
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

      <Grid2 container spacing={5} sx={{ marginTop: 5 }}>
        <Grid2 size={{ lg: 5.8, xs: 12 }}>
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
        <Grid2 size={{ lg: 5.8, xs: 12 }}>
          <Typography>Confirmar contraseña</Typography>
          <TextField
            name="repeteadPassword"
            size="small"
            type="password"
            fullWidth
            onChange={handleChange}
            value={adminData.repeteadPassword}
            id="outlined-error-helper-text"
          />
          {adminData.repeteadPassword && adminData.repeteadPassword !== adminData.password && (
            <FormHelperText error sx={{ color: 'orange' }}>
              Las contraseñas no coinciden
            </FormHelperText>
          )}
        </Grid2>
      </Grid2>

      <Box marginTop={3}>
        <FormControlLabel
          control={<Checkbox name="isAdmin" checked={adminData.isAdmin} onChange={handleCheckboxChange} />}
          label="Administrador"
        />
        <Typography variant="body2" color="textSecondary">
          El usuario podrá crear usuarios, ver y administrar los salarios, así como realizar cualquier otra acción en la plataforma.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }} gap={2}>
        <Button disabled={loading} variant="outlined" onClick={() => (window.location.href = 'Inicio')}>
          Cancelar
        </Button>
        <Button disabled={loading} variant="contained" onClick={handleAddAdmin}>
          Aceptar
        </Button>
      </Box>
    </Box>
  );
};

export default AddAdminView;
