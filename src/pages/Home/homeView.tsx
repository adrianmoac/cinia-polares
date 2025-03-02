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
  totalDocumentsNum: number;
  rowsPerPage: number;
  searchName: string;
  setSearchName: any;
  handlePageChange: (page: number) => {};
  handleSearch: (name: string) => {};
  handleCleanSearch: () => void;
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




const HomeView: React.FC<Props> = ({ loading, data: rowData, totalDocumentsNum, rowsPerPage, searchName, setSearchName, handlePageChange, handleSearch, handleCleanSearch }) => {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: 'nombre', headerName: 'Nombre', width: 100 },
    { field: 'apellido', headerName: 'Apellido', width: 150 },
    { field: 'confecciones_minimas', headerName: 'Confecciones mínimas', width: 200 },
    { field: 'confecciones_totales', headerName: 'Confecciones realizadas', width: 200, renderCell: (row: any) => row.row.confecciones_totales ? row.row.confecciones_totales : 'No asignado' },
    { field: 'salario_base', headerName: 'Salario base ($)', width: 130 },
    { field: 'salario_total', headerName: 'Salario total ($)', width: 130, flex: 1, renderCell: (row: any) => row.row.salario_total ? row.row.salario_total : 'No asignado' },
    { field: 'eficiencia', 
      headerName: 'Eficiencia (%)', 
      width: 120,
      flex: 1, 
      renderCell: (row: any) => row.row.confecciones_totales ? Math.floor(Number(row.row.confecciones_totales) * 100 / Number(row.row.confecciones_minimas)) : 'No asignado' },
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

  return (
    <Box sx={{ marginX: 5, marginTop: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
          <Button variant='contained' sx={{ textTransform: 'none', width: 250, marginRight: 0, marginLeft: 'auto', marginBottom: 3 }} onClick={() => window.location.href = 'AgregarAdministrador'}>Agregar administrador </Button>
          <Button variant='contained' sx={{ textTransform: 'none', width: 250, marginRight: 0, marginLeft: 'auto', marginBottom: 3 }} onClick={() => window.location.href = 'AgregarColaborador'}>Agregar empleado</Button>
        </Box>
          <Box display={'flex'} flexDirection={'row'} gap={5}>
            <Box display={'flex'} width={'60%'}>
              <TextField size='small' placeholder='Buscar por nombre' value={searchName} onChange={(e) => setSearchName(e.target.value)} sx={{ width: 450 }}></TextField>
              <Button variant='outlined' onClick={() => handleSearch(searchName)} sx={{ paddingX: 5}}>Buscar</Button>
              <Button variant='outlined' onClick={handleCleanSearch} sx={{ paddingX: 5, color: 'gray', borderColor: 'gray' }}>Limpiar</Button>
            </Box>
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
          rowCount={totalDocumentsNum}
          paginationMode='server'
          getRowId={(row) => row.workerID}
          loading={loading}
          rows={rowData}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: rowsPerPage } },
          }}
          onPaginationModelChange={(e) => handlePageChange(e.page)}       
          pageSizeOptions={[rowsPerPage]}
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