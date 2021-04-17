import { useAppContext, User } from "components/App";
import { FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "utils/request";

export const Register = () => {
  const { setUser } = useAppContext();
  const [error, setError] = useState(false);
  const refFirstName = useRef<HTMLInputElement>(null);
  const refLastName = useRef<HTMLInputElement>(null);
  const refEmail = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(false);

    try {
      const user = await request<User>("/api/users", {
        method: "POST",
        body: JSON.stringify({
          firstName: refFirstName.current?.value,
          lastName: refLastName.current?.value,
          email: refEmail.current?.value,
          password: refPassword.current?.value,
        }),
      });

      setUser(user);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div style={{ width: "50%", margin: "0 auto", marginTop: "25vh" }}>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <input
          ref={refFirstName}
          name="firstName"
          placeholder="Enter first name"
          type="string"
        />
        <input
          ref={refLastName}
          name="lastName"
          placeholder="Enter last name"
          type="string"
        />
        <input
          ref={refEmail}
          name="email"
          placeholder="Enter email *"
          type="email"
        />
        <input
          ref={refPassword}
          name="password"
          type="password"
          placeholder="Enter password *"
        />
        <button type="submit">Register</button>
        {error && <i>Could not register account</i>}
      </form>
      <p>
        or <Link to="/login">login</Link>
      </p>
    </div>
  );
};
