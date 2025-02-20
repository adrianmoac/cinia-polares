import HomeWrapper from "../Home";

export const loggedRoutes = [
  {
    route: 'Inicio',
    name: 'Inicio',
    component: HomeWrapper
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
    component: HomeWrapper
  }
]