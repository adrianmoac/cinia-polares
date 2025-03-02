import React, { useState } from 'react'
import { Box, Button, Grid2, TextField, Typography } from '@mui/material'
import { doc, setDoc } from 'firebase/firestore';
import { fs } from '../../firebase';
import Datepicker from '../../helpers/datepicker';
import dayjs, { Dayjs } from 'dayjs';

interface User {
  workerID: string;
  nombre: string;
  apellido: string;
  confecciones_minimas: string;
  discapacidad: string;
  fecha_nacimiento: any;
  salario_base: string;
  salario_total?: string;
  confecciones_totales?: string;
}

interface Props {
  user: User;
  dateProp: any;
}

const EditUserClothingView: React.FC<Props> = ({ user, dateProp }) => {
  const [ _, setError ] = useState<string>('');
  const [ baseClothing, setBaseClothing ] = useState<string>(user.confecciones_minimas || "0");
  const [ totalClothing, setTotalClothing ] = useState<string>(user.confecciones_totales || "0");
  const [ baseSalary,  setBaseSalary] = useState<string>(user.salario_base || "0");
  const [ totalSalary, setTotalSalary ] = useState<string>(user.salario_total || "0");
  const [ date, setDate ] = useState<Dayjs | Date>(new Date(dateProp.$d));

  const handleChange = (e: any) => {
    setError('');
    if(!e.target) {
      setDate(dayjs(new Date(e)));
    } else {
      const { value, name } = e.target;
      const regex = /^\d+$/;
      if(regex.test(value) || value === '') {
        if(name === 'baseClothing') {
          setBaseClothing(value);
        } else if(name === 'totalClothing') {
          setTotalClothing(value);
        } else if(name === 'baseSalary') {
          setBaseSalary(value);
        } else if(name === 'totalSalary') {
          setTotalSalary(value);
        }
      }
    }
  }
const handleSubmit = async () => {
  const formattedDate = dayjs(date).toDate(); // Convert dayjs to a native Date object

  const docRef = doc(fs, "workers", user.workerID, "rendimiento", formattedDate.toISOString().split('T')[0]);

  await setDoc(docRef, {
    confecciones_minimas: baseClothing,
    confecciones_totales: totalClothing,
    salario_base: baseSalary,
    salario_total: totalSalary,
    fecha: formattedDate.toISOString().split('T')[0] // Ensure the format is consistent with Firebase's expected format
  });
  window.location.href = '/Inicio';
}

  return (
    <Box margin={4}>
      {/* {error &&
        <Alert severity="error" sx={{ position: 'absolute', zIndex: 50, right: 40 }}>{error}</Alert>
      } */}
      <Typography variant='h5'>{user.nombre + ' ' + user.apellido}</Typography>
      <Grid2 container>
  {/* First Grid - Takes 2/3 of the screen */}
  <Grid2 container flex={2} sx={{ width: '66.66%' }}>
    <Grid2 container display={'flex'} flexDirection={'row'} gap={5} sx={{ width: '100%', marginTop: 5, justifyContent: 'space-between' }}>
      <Grid2 size={{ lg: 5.4, xs: 12 }}>
        <Typography>Confecciones mínimas</Typography>
        <TextField name="baseClothing" size='small' fullWidth onChange={handleChange} value={baseClothing} />
        <Typography sx={{ fontSize: 10 }}>Se modificará este parámetro para todos los registros de días posteriores</Typography>
      </Grid2>
      <Grid2 size={{ lg: 5.4, xs: 12 }}>
        <Typography>Confecciones realizadas</Typography>
        <TextField name="totalClothing" size='small' fullWidth onChange={handleChange} value={totalClothing} />
      </Grid2>
    </Grid2>
    <Grid2 container display={'flex'} flexDirection={'row'} gap={5} sx={{ width: '100%', marginTop: {lg: 15, xs: 5}, justifyContent: 'space-between' }}>
      <Grid2 size={{ lg: 5.4, xs: 12 }}>
        <Typography>Salario base</Typography>
        <TextField size='small' fullWidth name="baseSalary" onChange={handleChange} value={baseSalary} />
      </Grid2>
      <Grid2 size={{ lg: 5.4, xs: 12 }}>
        <Typography>Salario total</Typography>
        <TextField name="totalSalary" size='small' fullWidth onChange={handleChange} value={totalSalary} />
      </Grid2>
    </Grid2>
    <Box sx={{ display: 'flex', marginTop: 5, marginLeft: 'auto', marginRight: 0 }} gap={2}>
      <Button variant='outlined' onClick={() => window.location.href = 'Inicio'}>Cancelar</Button>
      <Button variant='contained' onClick={handleSubmit}>Aceptar</Button>
    </Box>
  </Grid2>
  
      {/* Second Grid - Takes 1/3 of the screen */}
      <Grid2 container flex={1} sx={{ width: '33.33%', display: 'flex', justifyContent: 'center' }}>
        <Datepicker size='small' onChange={handleChange} value={dayjs(date)}></Datepicker>
      </Grid2>
    </Grid2>
    </Box>
  )
}

export default EditUserClothingView