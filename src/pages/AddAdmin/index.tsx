import AddAdminView from './addAdminView';
import { db, auth } from '../../firebase';
import { ref, set } from 'firebase/database';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  

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

  const fieldNames: Record<Exclude<keyof AdminData, 'isAdmin'>, string> = {
    name: 'Nombre',
    lastName: 'Apellidos',
    email: 'Correo electrónico',
    birthDate: 'Fecha de nacimiento',
    password: 'Contraseña',
    repeteadPassword: 'Confirmación de contraseña',
  };

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>("");

  const navigate = useNavigate(); 

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
  
    for (const key in adminData) {
      if (key === 'isAdmin') continue;
  
      const typedKey = key as Exclude<keyof AdminData, 'isAdmin'>;
      if (adminData[typedKey] === '' || adminData[typedKey] === null) {
        setError(`Por favor, completa el campo ${fieldNames[typedKey]}`);
        return false;
      }
    }
  
    if (adminData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
  
    if (!passwordsMatch) {
      setError('Las contraseñas no coinciden');
      return false;
    }
  
    return true;
  };

  const handleAddAdmin = async () => {
    setError("");
    setSuccess(""); 
  
    if (!validateForm()) {
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, adminData.email, adminData.password);
      const userId = userCredential.user.uid;
  
      const adminRef = ref(db, `Users/${userId}`);
  
      await set(adminRef, {
        name: adminData.name,
        lastName: adminData.lastName,
        email: adminData.email,
        birthDate: new Date(adminData.birthDate || Date.now()).toLocaleDateString('es-ES'),
        isAdmin: adminData.isAdmin,
      });
  
      setSuccess("Usuario creado correctamente"); 

      setTimeout(() => {
        navigate('/'); 
      }, 2000);

    } catch (error) {
      console.error("Error creating admin:", error);
      setError("Error al crear usuario. Verifique los datos e intente nuevamente.");
    }
  };
  
  return (
    <AddAdminView
      adminData={adminData}
      handleChange={handleChange}
      handleDateChange={handleDateChange}
      handleAddAdmin={handleAddAdmin}
      handleCheckboxChange={handleCheckboxChange}
      error={error}
      success={success}
      formErrors={formErrors}
    />
  );
};

export default AddAdmin;
