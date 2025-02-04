import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Cours from "./pages/Cours";
import Workouts from "./pages/Workouts";
import Exercices from "./pages/Exercices";
import Plans from "./pages/Plans";
import Profil from "./pages/Profil";
import ClientDetails from "./pages/ClientDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/app/dashboard",
    element: <Dashboard />
  },
  {
    path: "/app/clients",
    element: <Clients />
  },
  {
    path: "/app/clients/:id",
    element: <ClientDetails />
  },
  {
    path: "/app/cours",
    element: <Cours />
  },
  {
    path: "/app/workouts",
    element: <Workouts />
  },
  {
    path: "/app/exercices",
    element: <Exercices />
  },
  {
    path: "/app/plans",
    element: <Plans />
  },
  {
    path: "/app/profil",
    element: <Profil />
  }
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

