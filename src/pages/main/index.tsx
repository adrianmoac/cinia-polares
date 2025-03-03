import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from '../../theme';
import { loggedRoutes } from './routes';
import Protected from '../../helpers/protected';
import Login from '../Login';

const App = () => {
  const authToken = localStorage.getItem('token');

  return (
    <ThemeProvider theme={theme}>
        <Routes>
          {Object.values(loggedRoutes).map((route) => (
            <Route key={route.route} element={<Protected />}>
              <Route path={route.route} element={<route.component />} />
            </Route>
          ))}
          {!authToken && 
            <Route path="/Login" element={<Login />} />
          }
        </Routes>
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);