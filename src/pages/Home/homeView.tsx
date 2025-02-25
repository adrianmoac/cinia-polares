import React from 'react'
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Tooltip } from '@mui/material'
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

interface Props {
  data: any;
  loading: boolean;
}

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));




const HomeView: React.FC<Props> = ({ loading, data }) => {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: 'nombre', headerName: 'Nombre', width: 100 },
    { field: 'apellido', headerName: 'Apellido', width: 150 },
    { field: 'confecciones', headerName: 'Confecciones mínimas', width: 200 },
    { field: 'confeccionesTotales', headerName: 'Confecciones realizadas', width: 200 },
    { field: 'salario', headerName: 'Salario base', width: 120 },
    { field: 'salarioTotal', headerName: 'Salario total', width: 120, flex: 1 },
    { field: 'eficiencia', headerName: 'Eficiencia', width: 120, flex: 1 },
    {
      field: ' ',
      headerName: ' ',
      sortable: false,
      width: 60,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
            <Tooltip title="Modificar">
              <IconButton>
                <EditIcon onClick={() => navigate('/EditarConfecciones', { state: { user: row.row } })}/>
              </IconButton>
            </Tooltip>
          </Box>
      ),
    },
    {
      field: '  ',
      headerName: ' ',
      sortable: false,
      width: 60,
      renderCell: (_) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
            <Tooltip title="Ver información">
              <IconButton>
                <ArrowForwardIcon />
              </IconButton>
            </Tooltip>
          </Box>
      ),
    },
  ];
  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <Box sx={{ marginX: 5, marginTop: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Button variant='contained' sx={{ textTransform: 'none', width: 250, marginRight: 0, marginLeft: 'auto', marginBottom: 3 }} onClick={() => window.location.href = 'AgregarColaborador'}>Agregar empleado</Button>
          <Box display={'flex'} flexDirection={'row'} gap={5}>
            <TextField size='small' placeholder='Buscar por empleado' sx={{ width: 450 }}></TextField>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" size={'small'}>Ingresa fecha</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size='small'
                value={10}
                label="Ingresa fecha"
                // onChange={handleChange}
              >
                <MenuItem value={10}>Hoy</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
      <Paper sx={{ height: 400, width: '100%' }}>
        <StripedDataGrid
          loading={loading}
          rows={data}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[3]}
          disableColumnMenu={true}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'odd' : 'even'
          }
        />
      </Paper>
    </Box>
  )
}

export default HomeView