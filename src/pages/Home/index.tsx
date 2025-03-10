import { useEffect, useState } from 'react';
import HomeView from './homeView';
import { collection, getDocs, orderBy, query, startAfter, limit, where, getCountFromServer, deleteDoc, doc } from 'firebase/firestore';
import { fs } from '../../firebase';
import dayjs, { Dayjs } from 'dayjs';
import { Dialog, Button, Typography, DialogTitle, DialogActions, DialogContent } from '@mui/material';

type Props = {}

const HomeWrapper: React.FC<Props> = () => {
  const [data, setData] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [searchName, setSearchName] = useState<string>('');
  const [searchDate, setSearchDate] = useState<Dayjs | Date>(dayjs(new Date()));
  const [docsInCache, setDocsInCache] = useState<any[]>([]);
  const [totalDocumentsNum, setTotalDocumentsNum] = useState<number>(0);
  const [totalDocumentsNumWillNotChange, setTotalDocumentsNumWillNotChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Modal open state
  const [workerToDelete, setWorkerToDelete] = useState<string | null>(null); // Store worker ID to delete
  const userData: any = localStorage.getItem('userData');
  const { isAdmin } = JSON.parse(userData);

  const rowsPerPage = 3;

  // Función para cargar datos paginados y rendimiento
  const fetchData = async (pageChange: number, dateChange?: boolean) => {
    setIsLoading(true);

    if (!dateChange && docsInCache[pageChange]) {
      setData(docsInCache[pageChange]);
      setIsLoading(false);
      return;
    }

    const workersRef = collection(fs, "workers");
    let qWorkers;

    if (!dateChange && lastDoc) {
      qWorkers = query(workersRef, orderBy("nombre"), startAfter(lastDoc), limit(rowsPerPage));
    } else {
      qWorkers = query(workersRef, orderBy("nombre"), limit(rowsPerPage));
    }

    try {
      const workersSnapshot = await getDocs(qWorkers);
      let workersData: any = [];

      for (const doc of workersSnapshot.docs) {
        const registrosRef = collection(fs, "workers", doc.id, "rendimiento");
        const q = query(
          registrosRef,
          where("fecha", "==", searchDate.toISOString().split('T')[0])
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

      let updatedCache: any[] = [];
      if (!dateChange) {
        updatedCache = [...docsInCache];
      }
      updatedCache[pageChange] = workersData;
      setDocsInCache(updatedCache);

      if (page >= pageChange) {
        setPage(e => e + 1);
      } else {
        setPage(e => e - 1);
      }

      setData(workersData);
      setLastDoc(workersSnapshot.docs[workersSnapshot.docs.length - 1]);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (workerToDelete) {
      const workerRef = doc(fs, "workers", workerToDelete);
      try {
        // Delete the worker
        await deleteDoc(workerRef);
  
        // Close the delete modal
        setOpenDeleteModal(false);
  
        // Remove the deleted worker from cache
        const updatedCache = [...docsInCache];
        const pageIndex = Math.floor(page / rowsPerPage); // Get the current page index
  
        // Ensure the page data exists before filtering
        if (updatedCache[pageIndex]) {
          updatedCache[pageIndex] = updatedCache[pageIndex].filter((worker: { workerID: string }) => worker.workerID !== workerToDelete);
          setDocsInCache(updatedCache);
        }
  
        // Refresh data after deletion (reload data)
        fetchData(0);  // This will trigger the data reload after deletion
  
      } catch (error) {
        console.error("Error deleting worker:", error);
      }
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
            where("fecha", "==", new Date(String(searchDate)).toISOString().split('T')[0])
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
  };

  useEffect(() => {
    const fetchDataOnDateChange = async () => {
      setPage(0);
      await fetchData(0, true);
    };
  
    fetchDataOnDateChange();
  }, [searchDate]);

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
    <>
      <HomeView
        data={data}
        loading={isLoading}
        isAdmin={isAdmin}
        totalDocumentsNum={totalDocumentsNum}
        rowsPerPage={rowsPerPage}
        searchName={searchName}
        searchDate={searchDate}
        setSearchName={setSearchName}
        setSearchDate={setSearchDate}
        handlePageChange={fetchData}
        handleSearch={handleSearch}
        handleCleanSearch={handleCleanSearch}
        setOpenDeleteModal={setOpenDeleteModal}
        setWorkerToDelete={setWorkerToDelete}
      />
      
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>
          <Typography variant="h6" component="h2">
            Confirmación de Eliminación
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar este usuario?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HomeWrapper;
