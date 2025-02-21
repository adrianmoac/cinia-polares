import React from 'react'
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Tooltip } from '@mui/material'
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';

type Props = {}

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
        // Reset on touch devices, it doesn't add specificity
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

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    flex: 1,
    valueGetter: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  {
    field: ' ',
    headerName: ' ',
    sortable: false,
    width: 60,
    renderCell: (_) => (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
          <Tooltip title="Modificar">
            <IconButton>
              <EditIcon />
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

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


const HomeView: React.FC<Props> = ({ }) => {
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
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
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