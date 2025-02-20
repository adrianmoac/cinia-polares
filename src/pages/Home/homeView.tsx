import React from 'react'
import { Button, Grid2 } from '@mui/material'

type Props = {}

const HomeView = (props: Props) => {
  return (
    <Grid2 sx={{ width: '100wh' }}>
      <Button variant='contained' sx={{ textTransform: 'none', marginLeft: 'auto' }}>Agregar empleado</Button>
    </Grid2> 
  )
}

export default HomeView