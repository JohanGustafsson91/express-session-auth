import { useAppContext } from "components/App";
import { useEffect } from "react";
import { Redirect } from "react-router-dom";

export const Logout = () => {
  const { user, setUser } = useAppContext();

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

  if (!user) return <Redirect to="/login" />;

  return null;
};
