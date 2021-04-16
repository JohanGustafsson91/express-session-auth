import { useAppContext, User } from "components/App";
import { FormEvent, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { request } from "utils/request";

export const Login = () => {
  const { user, setUser } = useAppContext();
  const [error, setError] = useState(false);
  const refEmail = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(false);

    try {
      const user = await request<User>("/api/sessions", {
        method: "POST",
        body: JSON.stringify({
          email: refEmail.current?.value,
          password: refPassword.current?.value,
        }),
      });

      setUser(user);
    } catch (error) {
      setError(true);
    }
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div style={{ width: "50%", margin: "0 auto", marginTop: "25vh" }}>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <input
          ref={refEmail}
          name="email"
          defaultValue="first.usersson@example.com"
        />
        <input
          ref={refPassword}
          name="password"
          type="password"
          defaultValue="test123"
        />
        <button type="submit">Login</button>
        {error && <i>Could not login</i>}
      </form>
    </div>
  );
};
