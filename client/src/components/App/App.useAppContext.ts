import { createContext, useContext } from "react";
import { User } from ".";

export const useAppContext = () => {
  const ctx = useContext(AppContext);

  if (!ctx)
    throw new Error(
      "[useAppContext]: You must wrap your component with <AppProvider />."
    );

  return { ...ctx };
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
