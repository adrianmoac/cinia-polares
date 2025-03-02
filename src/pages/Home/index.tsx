import { useEffect, useState } from 'react';
import HomeView from './homeView';
import { collection, getDocs, orderBy, query, startAfter, limit, where, getCountFromServer, setDoc } from 'firebase/firestore';
import { fs } from '../../firebase';

type Props = {}

const HomeWrapper: React.FC<Props> = () => {
  const [data, setData] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [firstDoc, setFirstDoc] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [searchName, setSearchName] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string | null>(null);
  const [docsInCache, setDocsInCache] = useState<any[]>([]);
  const [totalDocumentsNum, setTotalDocumentsNum] = useState<number>(0);
  const [totalDocumentsNumWillNotChange, setTotalDocumentsNumWillNotChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const rowsPerPage = 3;

  // Función para cargar datos paginados y rendimiento
  const fetchData = async (pageChange: number) => {
    setIsLoading(true);

    // Verificar si los datos ya están en el caché
    if (docsInCache[pageChange]) {
      setData(docsInCache[pageChange]);
      setIsLoading(false);
      return;
    }

    // Referencias a las colecciones en Firestore
    const workersRef = collection(fs, "workers");

    let qWorkers;

    if (lastDoc) {
      qWorkers = query(workersRef, orderBy("nombre"), startAfter(lastDoc), limit(rowsPerPage));
    } else {
      qWorkers = query(workersRef, orderBy("nombre"), limit(rowsPerPage));
    }

    try {
      // Obtener trabajadores
      const workersSnapshot = await getDocs(qWorkers);

      let workersData: any = [];

      for (const doc of workersSnapshot.docs) {
        const registrosRef = collection(fs, "workers", doc.id, "rendimiento");
        const q = query(
          registrosRef,
          where("fecha", "==", new Date().toISOString().split('T')[0])
        );
        
        const snapshot = await getDocs(q);
      
        if (!snapshot.empty) {
          snapshot.docs.forEach((rendimientoDoc) => {
            const worker = { ...doc.data(), ...rendimientoDoc.data() };
            workersData.push(worker); 
          });
        } else {
          workersData.push(doc.data()); 
        }
      }

      // Almacenamos los datos de la página en caché
      const updatedCache = [...docsInCache];
      updatedCache[pageChange] = workersData;
      setDocsInCache(updatedCache);

      // Actualizamos el estado según si es una nueva página
      if (page >= pageChange) {
        setPage(e => e + 1);
      } else {
        setPage(e => e - 1);
      }

      // Actualizamos los datos de la página actual
      setData(workersData);
      setFirstDoc(workersSnapshot.docs[0]);
      setLastDoc(workersSnapshot.docs[workersSnapshot.docs.length - 1]);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (name: string) => {
    setIsLoading(true);
  
    try {
      const workersRef = collection(fs, "workers");
  
      const q = query(workersRef, where("fullName", ">=", name), where("fullName", "<=", name + "\uf8ff"));
  
      const snapshot = await getDocs(q);
  
      if (!snapshot.empty) {
        let foundWorkers: any[] = [];
  
        for (const doc of snapshot.docs) {
          const registrosRef = collection(fs, "workers", doc.id, "rendimiento");
          const q = query(
            registrosRef,
            where("fecha", "==", new Date().toISOString().split('T')[0])
          );
  
          const rendimientoSnapshot = await getDocs(q);
  
          if (!rendimientoSnapshot.empty) {
            rendimientoSnapshot.docs.forEach((rendimientoDoc) => {
              const worker = { ...doc.data(), ...rendimientoDoc.data() };
              foundWorkers.push(worker);
            });
          } else {
            foundWorkers.push(doc.data());
          }
        }
        setPage(0);
        setTotalDocumentsNum(foundWorkers.length)
        setData(foundWorkers);
      } else {
        setData([]);
      }
  
    } catch (error) {
      console.error("Error searching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCleanSearch = () => {
    setData(docsInCache[0]);
    setSearchName('')
    setTotalDocumentsNum(totalDocumentsNumWillNotChange);
  }

  useEffect(() => {
    const fetchTotalDocsNumber = async () => {
      const workersRef = collection(fs, "workers");
      const countSnapshot = await getCountFromServer(workersRef);
      setTotalDocumentsNum(countSnapshot.data().count); 
      setTotalDocumentsNumWillNotChange(countSnapshot.data().count); 
    };

    fetchTotalDocsNumber();
    fetchData(0);
  }, []);

  return (
    <HomeView
      data={data}
      loading={isLoading}
      totalDocumentsNum={totalDocumentsNum}
      rowsPerPage={rowsPerPage}
      searchName={searchName}
      setSearchName={setSearchName}
      handlePageChange={fetchData}
      handleSearch={handleSearch}
      handleCleanSearch={handleCleanSearch}
    />
  );
};

export default HomeWrapper;
