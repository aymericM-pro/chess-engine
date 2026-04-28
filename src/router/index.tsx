import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import { ReplayPage } from "../modules/replay";
import { SettingsPage } from "../modules/settings/SettingsPage";
import { Board } from "../modules/game/Board";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/replay" replace /> },
      { path: "replay", element: <ReplayPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "board", element: <Board /> },
    ],
  },
]);
