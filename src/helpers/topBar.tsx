import React, { ReactNode } from 'react';
import logo from '../assets/logo.png';
import { Tab, Tabs, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  children: ReactNode;
}

const TopBar: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isWorker = localStorage.getItem('workerToken');
  const page = location.pathname.split('/')[1];

  const handleChange = (_: any, newVal: string) => {
    navigate(newVal);
  }

  const handleLogOut = () => {
    localStorage.removeItem('validToken');
    localStorage.removeItem('workerToken');
    localStorage.removeItem('userData');
    window.location.href = '/Login'
  }

  return (
    <div style={{ width: '100wh', height: '100vh', margin: 0, padding: 0 }}>
      <div style={{ display: 'flex', flex: 'row' }}>
        {!isWorker ?
          <img src={logo} style={{ width: '45px', cursor: 'pointer' }} onClick={() => window.location.href = 'Inicio'}></img>
          :
          <img src={logo} style={{ width: '45px' }}></img>
        }
        {!isWorker &&
          <Tabs
            value={page}
            onChange={handleChange}
            style={{ marginLeft: 10 }}
            textColor="primary"
            indicatorColor="primary"
            aria-label="primary tabs example"
          >
            <Tab value="Inicio" label="Inicio" />
            <Tab value="Eficiencia" label="Eficiencia" />
          </Tabs>
        }
        <Typography
        onClick={handleLogOut}
        color='gray' 
        style={{ marginLeft: 'auto', marginRight: 30, marginTop: 'auto', marginBottom: 'auto', cursor: 'pointer' }}>Cerrar sesión</Typography>
      </div>
      {children}
    </div>
  )
}

export default TopBar