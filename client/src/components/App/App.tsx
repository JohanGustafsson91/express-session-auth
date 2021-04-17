import { JSXElementConstructor, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "components/Login";
import { Home } from "components/Home";
import { Logout } from "components/Logout";
import { AppContext } from "./App.useAppContext";
import { request } from "utils/request";
import { Redirect } from "react-router-dom";
import { Register } from "components/Register";

export const App = () => {
  const [user, setUser] = useState<User | null | "pending">("pending");

  useEffect(() => {
    (async function authenticate() {
      try {
        const user = await request<User>("/api/sessions");
        if (!user.email) throw new Error("Unathorized");
        setUser(user);
      } catch (error) {
        setUser(null);
      }
    })();
  }, []);

  return user !== "pending" ? (
    <AppContext.Provider value={{ user, setUser }}>
      <Router>
        <Switch>
          <Route path="/login" component={unprotectedPage(Login, user)} />
          <Route path="/register" component={unprotectedPage(Register, user)} />
          <Route path="/logout" component={protectPage(Logout, user)} />
          <Route path="/" component={protectPage(Home, user)} />
        </Switch>
      </Router>
    </AppContext.Provider>
  ) : null;
};

const protectPage = (
  Component: JSXElementConstructor<any>,
  user: User | null
) => () => (user ? <Component user={user} /> : <Redirect to="/login" />);

const unprotectedPage = (
  Component: JSXElementConstructor<any>,
  user: User | null
) => () => (!user ? <Component user={user} /> : <Redirect to="/" />);

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}
