import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from '../../theme';
import { loggedRoutes } from './routes';
import Protected from './protected';
import Login from '../Login';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {Object.values(loggedRoutes).map((route) => (
          <Route key={route.route} element={<Protected />}>
            <Route path={route.route} element={<route.component />} />
          </Route>
        ))}
        {!localStorage.getItem("token") && 
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