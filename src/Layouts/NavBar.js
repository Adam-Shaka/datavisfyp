import { Link, useMatch, useResolvedPath } from "react-router-dom";
export default function NavBar() {
  return (
    <nav className="nav">
      <Link to="/" className="Data Vis">
        Data Vis
      </Link>
      <ul>
        <CustomLink to="/UADataView">Ukraine Data</CustomLink>
        <CustomLink to="/ChartGen">Chart Generation</CustomLink>
        <CustomLink to="/Documentation">Documentation</CustomLink>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
