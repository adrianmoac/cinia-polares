import AddEmployee from "../AddEmployee";
import EditUserClothing from "../EditUserClothing";
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
    component: AddEmployee
  },
  {
    route: 'EditarConfecciones',
    name: 'Editar confecciones',
    component: EditUserClothing
  },
  {
    route: '*',
    name: 'all',
    component: HomeWrapper
  }
]