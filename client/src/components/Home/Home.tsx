import { User } from "components/App";
import { Link } from "react-router-dom";

export const Home = ({ user }: Props) => (
  <div>
    <Link to="/logout">Logout</Link>
    <pre>{JSON.stringify(user, null, 2)}</pre>
  </div>
);

interface Props {
  user: User;
}
