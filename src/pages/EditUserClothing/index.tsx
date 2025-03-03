import React from 'react'
import EditUserClothingView from './EditUserClothingView'
import { useLocation } from 'react-router-dom';

type Props = {}

const EditUserClothing: React.FC<Props> = ({ }) => {
  const location = useLocation();
  const userData: any = localStorage.getItem('userData')
  const { isAdmin } = JSON.parse(userData);

  return (
    <EditUserClothingView
    user={location.state.user}
    dateProp={location.state.dateProp}
    isAdmin={isAdmin}
    ></EditUserClothingView>
  )
}

export default EditUserClothing