import { createContext } from 'react';

// Create and export the context
export const authContext = createContext<{token: string, setToken: (e: string) => void}>({ token: '', setToken: () => {} });