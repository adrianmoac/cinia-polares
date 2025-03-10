import { useEffect, useState } from 'react';
import ManageUsersView from './manageUsersView';
import { getDatabase, ref, get, query, orderByChild, startAt, endAt, limitToFirst, remove } from "firebase/database";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

type Props = {}

const ManageUsers: React.FC<Props> = () => {
  const [data, setData] = useState<any[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [searchName, setSearchName] = useState<string>('');
  const [docsInCache, setDocsInCache] = useState<any[]>([]);
  const [totalDocumentsNum, setTotalDocumentsNum] = useState<number>(0);
  const [totalDocumentsNumWillNotChange, setTotalDocumentsNumWillNotChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false); // State for modal visibility
  const [userToDelete, setUserToDelete] = useState<string | null>(null); // User ID to delete

  const userData: any = localStorage.getItem('userData');
  const { isAdmin } = JSON.parse(userData);

  const rowsPerPage = 3;
  const db = getDatabase(); // Get Realtime Database instance

  // Function to fetch paginated user data
  const fetchData = async (pageChange: number) => {
    setIsLoading(true);

    // Check cache first
    if (docsInCache[pageChange]) {
      setData(docsInCache[pageChange]);
      setIsLoading(false);
      return;
    }

    try {
      const usersRef = ref(db, "Users");
      let usersQuery;

      if (lastKey) {
        usersQuery = query(usersRef, orderByChild("name"), startAt(lastKey), limitToFirst(rowsPerPage + 1));
      } else {
        usersQuery = query(usersRef, orderByChild("name"), limitToFirst(rowsPerPage));
      }

      const snapshot = await get(usersQuery);
      const usersData: any[] = [];

      if (snapshot.exists()) {
        const users = snapshot.val();
        let keys = Object.keys(users);
        
        keys.forEach((userId, index) => {
          const user = users[userId];

          usersData.push({
            id: userId,
            name: user.name,
            lastName: user.lastName,
          });

          // Save last key for pagination
          if (index === keys.length - 1) {
            setLastKey(userId); // Update the last key here
          }
        });

        // Cache the data
        let updatedCache: any[] = [];
        updatedCache = [...docsInCache];
        updatedCache[pageChange] = usersData;
        
        setDocsInCache(updatedCache);

        if (page >= pageChange) {
          setPage(e => e + 1);
        } else {
          setPage(e => e - 1);
        }
  
        // Actualizamos los datos de la página actual
        setData(usersData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true);
    try {  
      // Delete user from Realtime Database
      await remove(ref(db, `Users/${userId}`));
  
      // Remove from local state
      setData(prevData => prevData.filter(user => user.id !== userId));
      setOpenModal(false); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle the delete button click
  const openDeleteModal = (userId: string) => {
    setUserToDelete(userId); // Set the user ID to be deleted
    setOpenModal(true); // Show the confirmation modal
  };

  const handleModalClose = () => {
    setOpenModal(false); // Close the modal
  };

  const handleModalConfirm = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete); // Confirm and delete the user
    }
  };

  // Function to search by name
  const handleSearch = async (name: string) => {
    setIsLoading(true);

    try {
      const usersQuery = query(ref(db, "Users"), orderByChild("name"), startAt(name), endAt(name + "\uf8ff"));
      const snapshot = await get(usersQuery);

      let foundUsers: any[] = [];

      if (snapshot.exists()) {
        const users = snapshot.val();

        for (const userId in users) {
          const user = users[userId];

          foundUsers.push({
            id: userId,
            name: user.name,
            lastName: user.lastName,
          });
        }

        setData(foundUsers);
        setTotalDocumentsNum(foundUsers.length);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error searching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset search
  const handleCleanSearch = () => {
    setData(docsInCache[0]);
    setSearchName('');
    setTotalDocumentsNum(totalDocumentsNumWillNotChange);
  };

  // Fetch total documents count
  useEffect(() => {
    const fetchTotalDocsNumber = async () => {
      const snapshot = await get(ref(db, "Users"));
      if (snapshot.exists()) {
        const totalUsers = Object.keys(snapshot.val()).length;
        setTotalDocumentsNum(totalUsers);
        setTotalDocumentsNumWillNotChange(totalUsers);
      }
    };

    fetchTotalDocsNumber();
    fetchData(0);
  }, []);

  return (
    <>
      <ManageUsersView
        data={data}
        loading={isLoading}
        isAdmin={isAdmin}
        totalDocumentsNum={totalDocumentsNum}
        rowsPerPage={rowsPerPage}
        searchName={searchName}
        setSearchName={setSearchName}
        handlePageChange={fetchData}
        handleSearch={handleSearch}
        handleCleanSearch={handleCleanSearch}
        handleDeleteUser={openDeleteModal} // Pass openDeleteModal to trigger modal
      />

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleModalClose}>
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
          <Button onClick={handleModalClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleModalConfirm} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageUsers;