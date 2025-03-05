import React, { useState } from 'react';
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { Gauge } from '@mui/x-charts/Gauge';
import { fs } from '../../firebase';
import dayjs, { Dayjs } from 'dayjs';
import { processObj } from '../../helpers/processObj';

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
  isAdmin: boolean;
  isWorker: boolean;
}

interface Process {
  name: string;
  confecciones_minimas: string;
  confecciones_totales: string;
}

type SelectedProcess = Process[];

const EditUserClothingView: React.FC<Props> = ({ user, dateProp, isAdmin, isWorker }) => {
  const [_, setError] = useState<string>('');
  const [baseSalary, setBaseSalary] = useState<string>(user.salario_base || '0');
  const [totalSalary, setTotalSalary] = useState<string>(user.salario_total || '0');
  const [performance, setPerformance] = useState<number>(0);
  const [selectedProcess, setSelectedProcess] = useState<SelectedProcess>([]);
  const [workerSubmitted, setWorkerSubmitted] = useState<boolean>(false);
  const [date, setDate] = useState<Dayjs | Date>(dayjs(new Date(dateProp.$d)));

  const calculatePerformance = (salary: number, updatedSelectedProcess: SelectedProcess) => {
    let totalPerformance = 0;
    if(updatedSelectedProcess) {
      updatedSelectedProcess.forEach((proc) => {
        totalPerformance += Number(proc.confecciones_totales) * 100 / Number(proc.confecciones_minimas)
      })
    }
    setTotalSalary(String(Math.trunc(salary * totalPerformance / 100)))
    setPerformance(Math.trunc(totalPerformance));
  }

  const handleChange = (e: any) => {
    setError('');
    if (!e.target) {
      setDate(dayjs(new Date(e)));
    } else {
      const { value, name } = e.target;
      const regex = /^\d+$/;
      if (regex.test(value) || value === '') {
        if (name === 'baseSalary') {
          setBaseSalary(value);
        } else if (name === 'totalSalary') {
          setTotalSalary(value);
          calculatePerformance(Number(value), selectedProcess);
        }
      }
    }
  };

  const handleChangeProcessData = (e: any, processName: string) => {
    const { value, name } = e.target;

    const updatedSelectedProcess = selectedProcess.map((proc: Process) => {
      if (proc.name === processName) {
        if (name === 'baseClothing') {
          return { ...proc, confecciones_minimas: value };
        } else if (name === 'totalClothing') {
          return { ...proc, confecciones_totales: value };
        }
      }
      return proc;
    });
    calculatePerformance(Number(baseSalary), updatedSelectedProcess);
    setSelectedProcess(updatedSelectedProcess);
  };

  const handleProcessSelect = (e: any) => {
    const selectedProcesses = e.target.value;
  
    setSelectedProcess(prevSelectedProcess => {
      const newSelectedProcess = selectedProcesses.map((processName: string) => {
        if (!prevSelectedProcess.some(proc => proc.name === processName)) {
          return {
            name: processName,
            confecciones_minimas: processObj[processName].PZ_por_dia, 
            confecciones_totales: '0', 
          };
        }
        return null;
      }).filter((proc: Process | null) => proc !== null);
  
      const removedProcesses = prevSelectedProcess.filter(
        proc => !selectedProcesses.includes(proc.name)
      );
  
      return [
        ...prevSelectedProcess.filter(proc => !removedProcesses.includes(proc)),
        ...newSelectedProcess,
      ];
    });
  };

  const handleSubmit = async () => {
    const formattedDate = dayjs(date).toDate(); // Convert dayjs to a native Date object

    const docRef = doc(fs, 'workers', user.workerID, 'rendimiento', formattedDate.toISOString().split('T')[0]);

    await setDoc(docRef, {
      process: selectedProcess,
      salario_total: totalSalary,
      eficiencia: performance, 
      fecha: formattedDate.toISOString().split('T')[0], // Ensure the format is consistent with Firebase's expected format
    });
    if(user.salario_base !== baseSalary) {
      const salaryRef = doc(fs, 'workers', user.workerID);
      await updateDoc(salaryRef, {
        salario_base: baseSalary
      })

    }
    if(!isWorker) {
      window.location.href = '/Inicio';
    } else {
      localStorage.clear();
      localStorage.setItem(new Date().toLocaleDateString('es'), 'true')
      setWorkerSubmitted(true);
    }
  };

  if(isWorker && localStorage.getItem(new Date().toLocaleDateString('es')) || workerSubmitted) {
    return (
      <Typography variant='h4' sx={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>Has completado tu registro del día</Typography>
    )
  }

  return (
    <Box margin={4}>
      <Typography variant="h5">
        {user.nombre + ' ' + user.apellido}
      </Typography>
      <Grid2 container>
        <Grid2 container flex={2} sx={{ width: '66.66%' }}>
          {isAdmin && (
            <Grid2 container display={'flex'} flexDirection={'row'} gap={5} sx={{ width: '100%', marginTop: { lg: 5, xs: 5 }, justifyContent: 'space-between' }}>
              <Grid2 size={{ lg: 5.4, xs: 12 }}>
                <Typography>Salario base</Typography>
                <TextField size="small" fullWidth name="baseSalary" onChange={handleChange} value={baseSalary} />
              </Grid2>
              <Grid2 size={{ lg: 5.4, xs: 12 }}>
                <Typography>Salario total</Typography>
                <TextField disabled size="small" fullWidth value={totalSalary} />
              </Grid2>
            </Grid2>
          )}
          <FormControl fullWidth sx={{ marginTop: 5 }}>
            <InputLabel id="demo-simple-select-label" size="small">Selecciona el proceso</InputLabel>
            <Select
              size="small"
              sx={{ width: {lg: '45%', xs: '100%'} }}
              name="selectProcess"
              label={'demo-simple-select-label'}
              id="demo-simple-select-label"
              onChange={handleProcessSelect}
              value={selectedProcess.map((proc) => proc.name)}
              multiple={true}
              renderValue={(selected) => selected.join(', ')}
            >
              {Object.keys(processObj).map((proc) => (
                <MenuItem key={proc} value={proc}>
                  {proc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedProcess.map((proc: Process) => (
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ marginTop: 5, fontWeight: 'bold', fontSize: 18 }}>{proc.name}</Typography>
              <Grid2 container display={'flex'} flexDirection={'row'} gap={5} sx={{ width: '100%', justifyContent: 'space-between' }}>
                <Grid2 size={{ lg: 5.4, xs: 12 }}>
                  <Typography>Confecciones mínimas</Typography>
                  <TextField
                    name="baseClothing"
                    size="small"
                    fullWidth
                    onChange={(e) => handleChangeProcessData(e, proc.name)}
                    value={proc.confecciones_minimas}
                  />
                </Grid2>
                <Grid2 size={{ lg: 5.4, xs: 12 }}>
                  <Typography>Confecciones realizadas</Typography>
                  <TextField
                    name="totalClothing"
                    size="small"
                    fullWidth
                    onChange={(e) => handleChangeProcessData(e, proc.name)}
                    value={proc.confecciones_totales}
                  />
                </Grid2>
              </Grid2>
            </Box>
          ))}
          <Box sx={{ display: 'flex', marginTop: 5, marginLeft: 'auto', marginRight: 0, height: 40 }} gap={2}>
            <Button variant="outlined" onClick={() => window.location.href = 'Inicio'}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={selectedProcess.length === 0}>
              Aceptar
            </Button>
          </Box>
        </Grid2>

        <Grid2 container flex={1} sx={{ width: '33.33%', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: 5}}>
          <Typography sx={{ marginX: 'auto', marginBottom: 2 }} variant='h6'>{dayjs(date).toDate().toLocaleDateString('es')}</Typography>
          <Gauge sx={{ marginX: 'auto', width: '90%', height: '90%', fontSize: 25, fontWeight: 'semibold' }} text={`${performance}%`} value={performance} />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default EditUserClothingView;
