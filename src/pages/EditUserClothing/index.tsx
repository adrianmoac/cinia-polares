import React from 'react'
import EditUserClothingView from './EditUserClothingView'
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

type Props = {}

const EditUserClothing: React.FC<Props> = ({ }) => {
  const location = useLocation();
  const userData: any = localStorage.getItem('userData')
  const { isAdmin } = JSON.parse(userData);
  console.log(location.state.user)

  return (
    <EditUserClothingView
    user={location.state?.user || JSON.parse(userData)}
    dateProp={location.state?.dateProps || dayjs(new Date())}
    isAdmin={isAdmin}
    isWorker={!location.state?.user && true}
    ></EditUserClothingView>
  )
}

export default EditUserClothing