import { Navigate, Outlet, useLocation } from "react-router-dom";
import TopBar from "./topBar";
import { get, ref } from "firebase/database";
import { db } from "../firebase";

const Protected = () => {
  const location = useLocation();
  const token = localStorage.getItem('token')
  const dbRef = ref(db, `Users/${token}`); 
  let validToken = localStorage.getItem('validToken');

if(!validToken && location.pathname === '/Login')
  get(dbRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      localStorage.removeItem('token');
      localStorage.setItem('validToken', token || '');
      validToken = token;
      window.location.href = 'Inicio'
    } 
  })
  .catch((error) => {
    console.error(error);
  });

  if (validToken) {
    return (
      <TopBar>
        <Outlet />
      </TopBar>
    )
  } else {
    return <Navigate to="/Login" />;
  }
};

export default Protected;