import AddEmployee from "../AddEmployee";
import AddAdmin from "../AddAdmin";
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
    route: 'AgregarAdministrador',
    name: 'Agregar administrador',
    component: AddAdmin
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

export const workerRoutes = [
  {
    route: 'RegistrarRendimiento',
    name: 'Registrar rendimiento',
    component: EditUserClothing
  },
  {
    route: '*',
    name: 'all',
    component: EditUserClothing
  }
]