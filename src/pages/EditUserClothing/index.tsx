import React from 'react'
import EditUserClothingView from './EditUserClothingView'
import { useLocation } from 'react-router-dom';

type Props = {}

const EditUserClothing: React.FC<Props> = ({ }) => {
  const location = useLocation();

  return (
    <EditUserClothingView
    user={location.state.user}
    dateProp={location.state.dateProp}
    ></EditUserClothingView>
  )
}

export default EditUserClothing