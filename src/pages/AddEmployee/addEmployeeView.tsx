import React, { useState } from 'react'
import { Alert, Box, Button, Grid2, TextField, Typography } from '@mui/material'
import { doc, setDoc } from 'firebase/firestore';
import { auth, fs } from '../../firebase';
import Datepicker from '../../helpers/datepicker';
import dayjs from 'dayjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Loading from '../../helpers/loading';

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
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ confPassword, setConfPassword ] = useState<string>('');
  const [ emailError, setEmailError ] = useState<boolean>(false);
  const [ passwordError, setPasswordError ] = useState<boolean>(false);
  const [ confPasswordError, setConfPasswordError ] = useState<boolean>(false);
  const [ salary, setSalary ] = useState<string>('');
  const [ loading, setLoading ] = useState<boolean>(false);

  const handleCreateEmployee = async () => {
    setLoading(true);
    if(validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        const docRef = doc(fs, "workers", userId)
        await setDoc(docRef, {
          nombre: name,
          apellido: lastname,
          discapacidad: disability,
          fecha_nacimiento: new Date(birthday || Date.now()),
          salario_base: salary,
          area: area,
          subarea: subarea,
          numero_empleado: employeeNumber,
          fullName: name + ' ' + lastname,
          workerID: userId
        });
        window.location.href = 'Inicio';

      } catch (error) {
        console.error('Error creating admin:', error);
        setError('Error al crear el empleado. Verifique los datos e intente nuevamente.');
      }
    } 
    setLoading(false);
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
    } else if (!email) {
      setError('Ingresa el correo del empleado');
      valid = false;
    } else if (!password || passwordError) {
      setError('Ingresa la contraseña del usuario');
      valid = false;
    } else if (!confPassword || confPasswordError) {
      setError('Confirma la contraseña del usuario');
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
      } else if(name === 'password') {
        setPassword(value);
        if(value.length < 6) {
          setPasswordError(true);
        } else {
          setPasswordError(false);
        }
      } else if(name === 'confPassword') {
        if(password !== value) {
          setConfPasswordError(true);
        } else {
          setConfPasswordError(false)
        }
        setConfPassword(value);
      } else if(name === 'email') {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setEmailError(!regex.test(value))
        setEmail(value);
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
      {loading &&
        <Loading />
      }
      <Typography variant='h5'>Agregar empleado</Typography>
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
      <Grid2 container display={'flex'} flexDirection={'row'} gap={5} sx={{ width: '100%', marginTop: 5, justifyContent: 'space-between' }}>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Correo electrónico</Typography>
          <TextField 
          name="email" 
          size='small' 
          fullWidth 
          onChange={handleChange} 
          error={emailError}
          helperText={emailError ? 'Formato incorrecto.' : ''}
          value={email}></TextField>
        </Grid2>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Contraseña</Typography>
          <TextField 
          name="password" 
          type='password' 
          size='small' 
          fullWidth 
          onChange={handleChange} 
          error={passwordError}
          helperText={passwordError ? 'La contaseña debe de tener mínimo 6 caracteres.' : ''}
          value={password}></TextField>
        </Grid2>
      </Grid2>
      <Grid2 container display={'flex'} flexDirection={'row'} gap={5} sx={{ width: '100%', marginTop: 5, justifyContent: 'space-between' }}>
        <Grid2 size={{ lg: 5.8, xs: 12}}>
          <Typography>Confirmar contraseña</Typography>
          <TextField 
          name="confPassword" 
          type='password'
          size='small' 
          fullWidth 
          onChange={handleChange} 
          error={confPasswordError}
          helperText={confPasswordError ? 'Las contraseñas no coinciden.' : ''}
          value={confPassword}></TextField>
        </Grid2>
      </Grid2>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }} gap={2}>
        <Button variant='outlined' disabled={loading} onClick={() => window.location.href = 'Inicio'}>Cancelar</Button>
        <Button variant='contained' disabled={loading} onClick={() => handleCreateEmployee()}>Aceptar</Button>
      </Box>
    </Box>
  )
}

export default AddEmployeeView