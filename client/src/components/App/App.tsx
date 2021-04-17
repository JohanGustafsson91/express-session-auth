import { ReactElement, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "components/Login";
import { Home } from "components/Home";
import { Logout } from "components/Logout";
import { AppContext } from "./App.useAppContext";
import { request } from "utils/request";
import { Redirect } from "react-router-dom";

export const App = () => {
  const [user, setUser] = useState<User | null | "pending">("pending");

  useEffect(() => {
    (async function authenticate() {
      try {
        const user = await request<User>("/api/sessions");
        if (!user.userId) throw new Error("Unathorized");
        setUser(user);
      } catch (error) {
        setUser(null);
      }
    })();
  }, []);

  if (user === "pending") return null;

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
          <Route path="/" component={protectRoute(<Home />, user)}></Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
};

const protectRoute = (page: ReactElement, user: User | null) => () =>
  user ? page : <Redirect to="/login" />;

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
