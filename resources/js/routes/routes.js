import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Archive from "../pages/Archive";
import NoMatch from "../pages/NoMatch";
import User from "../pages/User";
import Course from "../pages/Course";

const routes = [
  {
    path: "/",
    exact: true,
    auth: true,
    component: Dashboard,
    fallback: Home
  },
  {
    path: "/login",
    exact: true,
    auth: false,
    component: Login
  },
  {
    path: "/register",
    exact: true,
    auth: false,
    component: Register
  },
  {
    path: "/forgot-password",
    exact: true,
    auth: false,
    component: ForgotPassword
  },
  {
    path: "/reset-password",
    exact: true,
    auth: false,
    component: ResetPassword
  },
  {
    path: "/archive",
    exact: true,
    auth: true,
    component: Archive
  },
  {
    path: "/user",
    exact: true,
    auth: true,
    component: User
  },
  {
    path: "/course",
    exact: true,
    auth: true,
    component: Course
  },
  {
    path: "",
    exact: false,
    auth: false,
    component: NoMatch
  }
];

export default routes;
