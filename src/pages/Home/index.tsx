import { useEffect, useState } from 'react';
import HomeView from './homeView';
import { collection, getDocs, orderBy, query, startAfter, limit, where } from 'firebase/firestore';
import { fs } from '../../fireabase';

type Props = {}

const HomeWrapper: React.FC<Props> = () => {
  const [data, setData] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  // const [firstDoc, setFirstDoc] = useState<any>(null);
  // const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar datos paginados y rendimiento
  const fetchData = async (nextPage: boolean) => {
    setIsLoading(true);
  
    // Referencias a las colecciones en Firestore
    const workersRef = collection(fs, "workers");
  
    let qWorkers;
  
    if (nextPage && lastDoc) {
      qWorkers = query(workersRef, orderBy("nombre"), startAfter(lastDoc), limit(3));
    } else {
      qWorkers = query(workersRef, orderBy("nombre"), limit(3));
    }
  
    try {
      // Obtener trabajadores
      const workersSnapshot = await getDocs(qWorkers);
  
      let workersData: any = [];
  
      for (const doc of workersSnapshot.docs) {  // Use 'for...of' here
        const registrosRef = collection(fs, "workers", doc.id, "rendimiento");
        const q = query(
          registrosRef,
          where("fecha", "==", new Date().toISOString().split('T')[0])
        );
        let worker: any;
  
        const snapshot = await getDocs(q);
        if(!snapshot.empty) {
          snapshot.forEach((rendimientoDoc) => {
            worker = { ...doc.data(), ...rendimientoDoc.data() };  // Merge the data
          });
        } else {
          worker = doc.data()
        }
        workersData.push(worker);
      }
  
      setData(Object.values(workersData));
      // setFirstDoc(workersSnapshot.docs[0]);
      setLastDoc(workersSnapshot.docs[workersSnapshot.docs.length - 1]);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };  
console.log(data)
  useEffect(() => {
    fetchData(true);
  }, []);

  return (
    <HomeView
      data={data}
      loading={isLoading}
    />
  );
};

export default HomeWrapper;
