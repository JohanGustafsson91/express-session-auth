import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProtectedRoute } from "./App.ProtectedRoute";
import { Login } from "components/Login";
import { Home } from "components/Home";
import { Logout } from "components/Logout";
import { AppContext } from "./App.useAppContext";
import { request } from "utils/request";

export const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userHasAuthenticated, setUserHasAuthenticated] = useState<boolean>(
    false
  );

  useEffect(() => {
    (async function authenticate() {
      try {
        const user = await request<User>("/api/sessions");
        if (!user.userId) throw new Error("Unathorized");
        setUser(user);
        setUserHasAuthenticated(true);
      } catch (error) {
        setUser(null);
        setUserHasAuthenticated(true);
      }
    })();
  }, []);

  if (!userHasAuthenticated) return null;

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/">
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          </Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
};

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
