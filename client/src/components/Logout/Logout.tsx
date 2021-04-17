import { useAppContext } from "components/App";
import { useEffect } from "react";

export const Logout = () => {
  const { setUser } = useAppContext();

  useEffect(() => {
    (async function logout() {
      try {
        await fetch("/api/sessions", { method: "DELETE" });
        setUser(null);
      } catch (error) {
        setUser(null);
      }
    })();
  }, [setUser]);

  return null;
};
