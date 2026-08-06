import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { RootLayout } from "./RootLayout";
import { AdminGuard } from "./AdminGuard.jsx";
import AuthGuard from "./AuthGuard.jsx"
import Loading from "./pages/Loading.jsx";
import NoMatch from "./pages/NoMatch.jsx";

import AuthHome from "./pages/AuthHome.jsx";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import About from "./pages/About.jsx";
import Rules from "./pages/Rules.jsx";
import FAQs from "./pages/FAQs.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Success from "./pages/Success.jsx";
import Games from "./pages/Games.jsx";

import Players from "./pages/Players.jsx";
import Teams from "./pages/Teams.jsx";
import Characters from "./pages/Characters.jsx";

import Player from "./pages/Player.jsx";
import Team from "./pages/Team.jsx";
import Character from "./pages/Character.jsx";

import RegisteredPlayers from "./pages/RegisteredPlayers.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import RegisterSuccess from "./pages/RegisterSuccess.jsx";
// Admin
import AdminEvent from "./pages/AdminEvent.jsx";
import AdminPlayers from "./pages/AdminPlayers.jsx";
import AdminPlayerUpsert from "./pages/AdminPlayerUpsert.jsx";

import { AppProviders } from "./AppProviders.jsx";
import { useUser } from "./context/UserContext.jsx";
import { useEvent } from "./context/EventContext.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import { usePlayer } from "./context/PlayerContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Public landing page
      { index: true, element: <Leaderboard />}, 
      // Auth Guard Layout wrapping all protected member routes
      {
        element: <AuthGuard />, 
        children: [
          { path: "/", element: <AuthHome/>},
          { path: "profile", element: <Profile /> },     // Protected profile page
        ]
      },

      // Unauthenticated routes
      { path: "register", element: <Register /> },
      { path: "register-success", element: <RegisterSuccess /> },
      // Public informational pages
      { path: "registered", element: <RegisteredPlayers/>},

      {
        path:"leaderboard/*",
        element:<Leaderboard/>
      },
      {
        path:"players/*",
        element:<Players/>
      },
      {      
        path:"teams/*",
        element:<Teams/>
      },
      {
        path:"characters/*",
        element:<Characters/>
      },
       {
        path:"player/:playerId/*",
        element:<Player standalone={true} forceExpanded={true}/>
      },
      {
        path:"team/:teamId/*",
        element: <Team/>
      },
      {
        path:"character/:characterId/*",
        element: <Character />
      },
      { path: "faqs", element: <FAQs /> },
      { path: "privacy", element: <Privacy /> },
      { path: "rules", element: <Rules /> },
      { path: "about", element: <About /> },
      { path: "success", element: <Success/>},
      // Admin dashboard layout (Nested inside RootLayout)
      {
        path: "admin",
        element: <AdminGuard />,
        children: [
          {
            path: "players",
            children: [
              { index: true, element: <AdminPlayers /> },
              { path: "create", element: <AdminPlayerUpsert /> },
              { path: ":id", element: <AdminPlayerUpsert /> },
            ],
          },
          { path: "event", element: <AdminEvent /> },
        ],
      },
      { path: "*", element: <NoMatch /> },
    ],
  },
]);

function App() {
  const { userLoading } = useUser();
  const { eventLoading } = useEvent();
  const { playerLoading } = usePlayer();

  if (userLoading || eventLoading || playerLoading) {
    return <Loading />;
  }

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);