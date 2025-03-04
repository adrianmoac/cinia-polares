import AddEmployee from "../AddEmployee";
import AddAdmin from "../AddAdmin";
import ManageUsers from "../ManageUsers";
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
    route: 'AdministrarUsuarios',
    name: 'Administrar usuarios',
    component: ManageUsers
  },
  {
    route: 'CrearAdministrador',
    name: 'Crear administrador',
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