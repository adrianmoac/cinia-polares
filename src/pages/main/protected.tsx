import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/Login" />;
  }
};

export default Protected;