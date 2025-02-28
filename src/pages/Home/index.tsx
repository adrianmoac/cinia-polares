import { useEffect, useState } from 'react';
import HomeView from './homeView';
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { fs } from '../../firebase';

type Props = {}

const HomeWrapper: React.FC<Props> = ({ }) => {
  const [data, setData] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [firstDoc, setFirstDoc] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar datos paginados
  const fetchData = async (nextPage: boolean) => {
    setIsLoading(true);
    const ref = collection(fs, "workers");
    let q;

    // if (nextPage && lastDoc) {
    //   q = query(ref, orderBy("nombre"), startAfter(lastDoc), limit(3));
    // } else {
    //   q = query(ref, orderBy("nombre"), limit(3));
    // }
    if (nextPage && lastDoc) {
      // Pagination + Date filter
      q = query(
        ref,
        // where("workingDays", "==", new Date().toISOString().split('T')[0]),
        orderBy("nombre"),
        startAfter(lastDoc),
        limit(3)
      );
    } else {
      // Pagination for first page + Date filter
      q = query(
        ref,
        // where("workingDays", "==", new Date().toISOString().split('T')[0]),
        orderBy("nombre"),
        limit(3)
      );
    }

    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setData(newData);
    setFirstDoc(querySnapshot.docs[0]); 
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  console.log('data', data)

  // Cambiar página
  // const handleNextPage = () => {
  //   setPage((prev) => prev + 1);
  //   fetchData(true);
  // };

  // const handlePrevPage = async () => {
  //   setIsLoading(true);
  //   const ref = collection(fs, "tu_coleccion");
  //   let q = query(ref, orderBy("campoOrden"), limit(3));

  //   const querySnapshot = await getDocs(q);
  //   const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  //   setData(newData);
  //   setFirstDoc(querySnapshot.docs[0]);
  //   setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
  //   setPage((prev) => prev - 1);
  //   setIsLoading(false);
  // };

  return (
    <HomeView
    data={data}
    loading={isLoading}
    ></HomeView>
  )
}

export default HomeWrapper