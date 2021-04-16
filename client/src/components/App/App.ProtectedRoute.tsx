import { PropsWithChildren } from "react";
import { useAppContext } from ".";
import { Redirect } from "react-router-dom";

export const ProtectedRoute = ({ children }: PropsWithChildren<{}>) => {
  const { user } = useAppContext();
  return user ? <>{children}</> : <Redirect to="/login" />;
};
