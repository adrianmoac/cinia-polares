import Login from "../Login"
import App from "./App";

export const loggedRoutes = [
  {
    route: 'Inicio',
    name: 'Inicio',
    component: App
  },
  {
    route: 'Eficiencia',
    name: 'Eficiencia',
    component: ''
  },
  {
    route: 'AgregarColaborador',
    name: 'Agregar colaborador',
    component: ''
  },
  {
    route: '*',
    name: 'all',
    component: App
  }
]

export const defaultRoutes = [
    {
    route: 'Login',
    name: 'Log In',
    component: Login 
    },
    {
      route: '*',
      name: 'all',
      component: Login
    }
];