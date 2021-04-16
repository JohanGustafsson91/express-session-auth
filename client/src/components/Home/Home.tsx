import { useAppContext } from "components/App";
import { Link } from "react-router-dom";

export const Home = () => {
  const { user } = useAppContext();

  return (
    <div>
      <Link to="/logout">Logout</Link>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
