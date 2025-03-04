import React, { useState } from 'react'
import { Alert, Box, Button, Grid2, TextField, Typography } from '@mui/material'
import { collection, doc, setDoc } from 'firebase/firestore';
import { fs } from '../../firebase';
import Datepicker from '../../helpers/datepicker';
import dayjs from 'dayjs';

type Props = {}

const AddEmployeeView: React.FC<Props> = ({ }) => {
  const [ error, setError ] = useState<string>('');
  const [ name, setName ] = useState<string>('');
  const [ lastname, setLastname ] = useState<string>('');
  const [ birthday,  setBirthday] = useState<Date | null>(null);
  const [ disability, setDisability ] = useState<string>('');
  const [ area, setArea ] = useState<string>('');
  const [ subarea, setSubarea ] = useState<string>('');
  const [ employeeNumber, setEmployeeNumber ] = useState<string>('');
  const [ salary, setSalary ] = useState<string>('');

  const handleCreateEmployee = async () => {
    if(validateForm()) {
      try {
        const docRef = doc(collection(fs, "workers"))
        await setDoc(docRef, {
          nombre: name,
          apellido: lastname,
          discapacidad: disability,
          fecha_nacimiento: new Date(birthday || Date.now()),
          salario_base: salary,
          area: area,
          subarea: subarea,
          numero_empleado: employeeNumber,
          workerID: docRef.id
        });
    
        window.location.href = 'Inicio'
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } 
  }

  const validateForm = () => {
    let valid = true;
    if(!name) {
      setError('Ingresa un nombre');
      valid = false;
    } else if (!lastname) {
      setError('Ingresa apellidos');
      valid = false;
    } else if (!birthday) {
      setError('Ingresa fecha de nacimiento');
      valid = false;
    } else if (!disability) {
      setError('Ingresa discapacidad');
      valid = false;
    } else if (!salary) {
      setError('Ingresa salario');
      valid = false;
    } else if (!area) {
      setError('Ingresa área');
      valid = false;
    } else if (!subarea) {
      setError('Ingresa subárea');
      valid = false;
    } else if (!employeeNumber) {
      setError('Ingresa número de empleado');
      valid = false;
    }
    return valid;
  }

  const handleChange = (e: any) => {
    setError('');
    if(!e.target) {
      setBirthday(e);
    } else {
      const { value, name } = e.target;
      if(name === 'name') {
        setName(value);
      } else if(name === 'lastname') {
        setLastname(value);
      } else if(name === 'disability') {
        setDisability(value);
      } else if(name === 'area') {
        setArea(value);
      } else if(name === 'subarea') {
        setSubarea(value);
      } else if(name === 'employeeNumber') {
        const regex = /^\d+$/;
        if(regex.test(value)) {
          setEmployeeNumber(value);
        }
      } else if(name === 'salary') {
        const regex = /^\d+$/;
        if(regex.test(value)) {
          setSalary(value);
        }
      } 
    }
  }


  return (
    <Box margin={4}>
      {error &&
        <Alert severity="error" sx={{ position: 'absolute', zIndex: 50, right: 40 }}>{error}</Alert>
      }
      <Typography variant='h5'>Agregar colaborador</Typography>
      <Grid2 container display={'flex'} flexDirection={'row'} gap={5} sx={{ width: '100%', marginTop: 5, justifyContent: 'space-between' }}>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Nombre</Typography>
          <TextField name="name" size='small' fullWidth onChange={handleChange} value={name}></TextField>
        </Grid2>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Apellidos</Typography>
          <TextField name="lastname" size='small' fullWidth onChange={handleChange} value={lastname}></TextField>
        </Grid2>
      </Grid2>
      <Grid2 container display={'flex'} flexDirection={'row'} gap={5} sx={{ width: '100%', marginTop: 5, justifyContent: 'space-between' }}>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Fecha de nacimiento</Typography>
          <Datepicker size='small' maxDate={dayjs(new Date())} onChange={handleChange} value={birthday}></Datepicker>
        </Grid2>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Discapacidad</Typography>
          <TextField name="disability" size='small' fullWidth onChange={handleChange} value={disability}></TextField>
        </Grid2>
      </Grid2>
      <Grid2 container display={'flex'} flexDirection={'row'} gap={5} sx={{ width: '100%', marginTop: 5, justifyContent: 'space-between' }}>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Área</Typography>
          <TextField name="area" size='small' fullWidth onChange={handleChange} value={area}></TextField>
        </Grid2>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Subárea</Typography>
          <TextField name="subarea" size='small' fullWidth onChange={handleChange} value={subarea}></TextField>
        </Grid2>
      </Grid2>
      <Grid2 container display={'flex'} flexDirection={'row'} gap={5} sx={{ width: '100%', marginTop: 5, justifyContent: 'space-between' }}>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Número de empleado</Typography>
          <TextField name="employeeNumber" size='small' fullWidth onChange={handleChange} value={employeeNumber}></TextField>
        </Grid2>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Salario base</Typography>
          <TextField name="salary" size='small' fullWidth onChange={handleChange} value={salary}></TextField>
        </Grid2>
      </Grid2>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }} gap={2}>
        <Button variant='outlined' onClick={() => window.location.href = 'Inicio'}>Cancelar</Button>
        <Button variant='contained' onClick={() => handleCreateEmployee()}>Aceptar</Button>
      </Box>
    </Box>
  )
}

export default AddEmployeeView