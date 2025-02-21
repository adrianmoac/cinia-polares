import { Navigate, Outlet } from "react-router-dom";
import TopBar from "./topBar";

const Protected = () => {
  const token = localStorage.getItem("token");

  if (token) {
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