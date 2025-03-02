import AddAdminView from './addAdminView';
import { db } from '../../firebase';
import { ref, set } from "firebase/database";
import { useState } from 'react';

type AdminData = {
  name: string;
  lastName: string;
  email: string;
  birthDate: string | null;
  password: string;
  repeteadPassword: string;
};

const AddAdmin = () => {
  const [adminData, setAdminData] = useState<AdminData>({
    name: "",
    lastName: "",
    email: "",
    birthDate: null, 
    password: "",
    repeteadPassword: "",
  });

  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e: any) => {
      setAdminData({ ...adminData, birthDate: e });
  };

  const handleAddAdmin = () => {
    /* if (!adminData.name || !adminData.lastName || !adminData.email || !adminData.birthDate || !adminData.password) {
      setError('All fields are required!');
      return;
    }

    setError(''); */

    const sanitizedEmail = adminData.email.replace(/\./g, ","); // Replace '.' with ',' to prevent Firebase issues
    const adminRef = ref(db, `Users/${sanitizedEmail}`); // Use email as the key

    set(adminRef, {
      name: adminData.name,
      last: adminData.lastName,
      birthDate: new Date(adminData.birthDate || Date.now()).toLocaleDateString("es-ES"),
    })
      .then(() => console.log("Admin added successfully!", adminData.birthDate))
      .catch((error) => console.error("Error adding admin:", error));
  };

  return (
    <AddAdminView 
      adminData={adminData} 
      handleChange={handleChange} 
      handleDateChange={handleDateChange} 
      handleAddAdmin={handleAddAdmin}
      error={error}
    />
  );
};

export default AddAdmin;