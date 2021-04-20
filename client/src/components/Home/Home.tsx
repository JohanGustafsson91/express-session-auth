import { User } from "components/App";
import { Link } from "react-router-dom";

export const Home = ({ user: { firstName } }: Props) => (
  <div style={{ padding: "16px" }}>
    <h1>Welcome{firstName ? ` ${firstName}` : ""}!</h1>
    <p>
      <Link to="/logout">Logout</Link>
    </p>
  </div>
);

interface Props {
  user: User;
}
