import React, { ReactNode } from 'react';
import logo from '../assets/logo.png';
import { Tab, Tabs } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  children: ReactNode;
}

const TopBar: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const page = location.pathname.split('/')[1];

  const handleChange = (_: any, newVal: string) => {
    navigate(newVal);
  }

  return (
    <div style={{ width: '100wh', height: '100vh', margin: 0, padding: 0 }}>
      <div style={{ display: 'flex', flex: 'row' }}>
        <img src={logo} style={{ width: '45px'}}></img>
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
      </div>
      {children}
    </div>
  )
}

export default TopBar