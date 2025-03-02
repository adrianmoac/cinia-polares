import AddAdminView from './addAdminView';
import { db } from '../../firebase';
import { ref, set } from 'firebase/database';
import { useState } from 'react';

type AdminData = {
  name: string;
  lastName: string;
  email: string;
  birthDate: string | null;
  password: string;
  repeteadPassword: string;
  isAdmin: boolean;
};

const AddAdmin = () => {
  const [adminData, setAdminData] = useState<AdminData>({
    name: '',
    lastName: '',
    email: '',
    birthDate: null,
    password: '',
    repeteadPassword: '',
    isAdmin: false,
  });

  const [formErrors] = useState({
    name: false,
    lastName: false,
    email: false,
    birthDate: false,
    password: false,
    repeteadPassword: false,
  });

  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (e: any) => {
    setAdminData((prevData) => ({ ...prevData, birthDate: e }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData((prevData) => ({ ...prevData, isAdmin: e.target.checked }));
  };

  const validateForm = () => {
    const passwordsMatch = adminData.password === adminData.repeteadPassword || adminData.repeteadPassword === '';
    const isFormValid =
      Object.values(formErrors).every((error) => !error) &&
      passwordsMatch &&
      Object.values(adminData).every((field) => field !== '' && field !== null);

    return isFormValid;
  };

  const handleAddAdmin = () => {

    if (!validateForm()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const sanitizedEmail = adminData.email.replace(/\./g, '%2N');
    const adminRef = ref(db, `Users/${sanitizedEmail}`);

    set(adminRef, {
      name: adminData.name,
      last: adminData.lastName,
      birthDate: new Date(adminData.birthDate || Date.now()).toLocaleDateString('es-ES'),
      isAdmin: adminData.isAdmin,
    })
      .then(() => console.log('Admin added successfully!'))
      .catch((error) => console.error('Error adding admin:', error));
  };

  return (
    <AddAdminView
      adminData={adminData}
      handleChange={handleChange}
      handleDateChange={handleDateChange}
      handleAddAdmin={handleAddAdmin}
      handleCheckboxChange={handleCheckboxChange}
      error={error}
      formErrors={formErrors}
    />
  );
};

export default AddAdmin;
