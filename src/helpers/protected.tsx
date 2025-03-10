import { Navigate, Outlet, useLocation } from "react-router-dom";
import TopBar from "./topBar";
import { get, ref } from "firebase/database";
import { db, fs } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Protected = () => {
  const location = useLocation();
  const token: any = localStorage.getItem('token')
  const dbRef = ref(db, `Users/${token}`)
  let validToken = localStorage.getItem('validToken');
  let workerToken = localStorage.getItem('workerToken');

if(!validToken && location.pathname === '/Login') {
  get(dbRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      localStorage.removeItem('token');
      localStorage.setItem('validToken', token || '');
      const userData = snapshot.val()
      localStorage.setItem('userData', JSON.stringify(userData))
      validToken = token;
      window.location.href = '/Inicio'
    } else {
      // Snapshot doesn't exist, search Firestore
      const firestoreDocRef: any = doc(fs, 'workers', token);
      getDoc(firestoreDocRef)
        .then((firestoreSnapshot: any) => {
          if (firestoreSnapshot.exists()) {
            // Handle snapshot from Firestore
            localStorage.removeItem('token');
            localStorage.setItem('workerToken', token || '');
            const userData = firestoreSnapshot.data();
            localStorage.setItem('userData', JSON.stringify(userData));
            workerToken = token;
            window.location.href = '/RegistrarRendimiento';
          } else {
            console.error('No user data found in Firestore.');
          }
        })
        .catch((error) => {
          console.error('Error fetching data from Firestore:', error);
        });
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

  if (validToken) {
    return (
      <TopBar>
        <Outlet />
      </TopBar>
    )
  } else if (workerToken) {
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