import React from 'react'
import { Box, Button, IconButton, Paper, TextField, Tooltip } from '@mui/material'
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import Datepicker from '../../helpers/datepicker';
import dayjs, { Dayjs } from 'dayjs';
import { Delete } from '@mui/icons-material';

interface Props {
  data: any;
  loading: boolean;
  isAdmin: boolean;
  totalDocumentsNum: number;
  rowsPerPage: number;
  searchName: string;
  searchDate: Dayjs | Date | null;
  setSearchName: (e: any) => void;
  setSearchDate: (e: any) => void;
  handlePageChange: (page: number) => {};
  handleSearch: (name: string) => {};
  handleCleanSearch: () => void;
  setOpenDeleteModal: (open: boolean) => void;
  setWorkerToDelete: (workerId: string | null) => void;
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

const HomeView: React.FC<Props> = ({ loading, data: rowData, isAdmin, totalDocumentsNum, rowsPerPage, searchName, searchDate, setSearchName, setSearchDate, handlePageChange, handleSearch, handleCleanSearch, setOpenDeleteModal, setWorkerToDelete }) => {
  const navigate = useNavigate();

  const columns: any[] = [
    { field: 'numero_empleado', headerName: '# Empleado', width: 150 },
    { field: 'nombre', headerName: 'Nombre', width: 100 },
    { field: 'apellido', headerName: 'Apellido', width: 150 },
    { field: 'area', headerName: 'Área', width: 150 },
    { field: 'subarea', headerName: 'Subárea', width: 150 },
    isAdmin && { field: 'salario_base', headerName: 'Salario base ($)', width: 130 },
    isAdmin && { field: 'salario_total', headerName: 'Salario total ($)', width: 130, flex: 1, renderCell: (row: any) => row.row.salario_total ? row.row.salario_total : 'No calculado' },
    { field: 'eficiencia', 
      headerName: 'Eficiencia (%)', 
      width: 120,
      flex: 1, 
      renderCell: (row: any) => row.row.eficiencia ? row.row.eficiencia : 'No calculado' },
    {
      field: ' ',
      headerName: ' ',
      sortable: false,
      width: 60,
      renderCell: (row: any) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
            <Tooltip title="Modificar">
              <IconButton>
                <EditIcon onClick={() => navigate('/EditarConfecciones', { state: { user: row.row, dateProp: searchDate } })}/>
              </IconButton>
            </Tooltip>
          </Box>
      ),
    },
    isAdmin && {
      field: '  ',
      headerName: ' ',
      sortable: false,
      width: 60,
      renderCell: (row: any) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
            <Tooltip title="Borrar empleado">
              <IconButton onClick={() => {
                setWorkerToDelete(row.row.workerID); // Set worker ID to delete
                setOpenDeleteModal(true); // Open modal for deletion confirmation
              }}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
      ),
    },
  ].filter(Boolean);

  return (
    <Box sx={{ marginX: 5, marginTop: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {isAdmin &&
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 6, mb: 3 }}>
              <Button variant='contained' sx={{ textTransform: 'none', width: 250, marginRight: 0, marginLeft: 'auto', marginBottom: 3 }} onClick={() => window.location.href = 'AdministrarUsuarios'}>Administrar usuarios</Button>
              <Button variant='contained' sx={{ textTransform: 'none', width: 250, marginRight: 0, marginBottom: 3 }} onClick={() => window.location.href = 'AgregarColaborador'}>Agregar empleado</Button>
            </Box>
          }
          <Box display={'flex'} flexDirection={'row'} gap={5} justifyContent={'flex-end'}>
            <Box display={'flex'} width={'60%'}>
              <TextField size='small' placeholder='Buscar por nombre' value={searchName} onChange={(e) => setSearchName(e.target.value)} sx={{ width: 450 }}></TextField>
              <Button variant='outlined' onClick={() => handleSearch(searchName)} sx={{ paddingX: 5}}>Buscar</Button>
              <Button variant='outlined' onClick={handleCleanSearch} sx={{ paddingX: 5, color: 'gray', borderColor: 'gray' }}>Limpiar</Button>
            </Box>
              <Datepicker
                size='small'
                value={searchDate}
                onChange={(e) => setSearchDate(dayjs(new Date(e)))}
                maxDate={dayjs(new Date())}
              ></Datepicker>
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

export default HomeView;
