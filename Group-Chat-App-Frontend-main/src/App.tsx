import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import DashBoardLayout from "./layouts/DashBoardLayout";
import { lazy } from "react";
import Loadable from "./utils/LazyLoading";
import NotFound from "./pages/NotFoundPage";
import OpenRoute from "./components/openRoutes/OpenRoutes";
import PrivateRoute from "./components/privateRoutes/PrivateRoute";

const LoginPage = Loadable(lazy(() => import("./pages/LoginPage")));
const RegisterPage = Loadable(lazy(() => import("./pages/RegisterPage")));
const HomePage = Loadable(lazy(() => import("./pages/HomePage")));
const ProfilePage = Loadable(lazy(() => import("./pages/ProfilePage")));
const CreateGroupForm = Loadable(lazy(() => import("./pages/CreateGroupPage")));
const ChatScreenPage = Loadable(lazy(() => import("./pages/ChatPage")));
const AcceptInvitePage = Loadable(
  lazy(() => import("./pages/AcceptInvitePage"))
);
const AnalyticsPage = Loadable(lazy(() => import("./pages/AnalyticsPage")));

const App = () => {
  // throw new Error("Error thrown from App component")
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { element: <Navigate to={"login"} replace />, index: true },
        {
          path: "login",
          element: (
            <OpenRoute>
              <LoginPage />
            </OpenRoute>
          ),
        },
        {
          path: "register",
          element: (
            <OpenRoute>
              <RegisterPage />
            </OpenRoute>
          ),
        },
      ],
    },
    {
      path: "/",
      element: <DashBoardLayout />,
      children: [
        { element: <Navigate to={"app"} replace />, index: true },
        {
          path: "app",
          element: (
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          ),
        },
        {
          path: "app/profile",
          element: (
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          ),
        },
        {
          path: "app/:name/:id",
          element: (
            <PrivateRoute>
              <ChatScreenPage />
            </PrivateRoute>
          ),
        },
        {
          path: "app/createGroup",
          element: (
            <PrivateRoute>
              <CreateGroupForm />
            </PrivateRoute>
          ),
        },
        {
          path: "app/analytics",
          element: (
            <PrivateRoute>
              <AnalyticsPage />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: "/invite-acccptence/:token",
      element: <AcceptInvitePage />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
};

export default App;
