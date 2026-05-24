import { createBrowserRouter } from "react-router";
import App from "../App";
import { ReplayPage } from "../modules/replay";
import { SettingsPage } from "../modules/settings/SettingsPage";
import { Board } from "../modules/game/Board";
import { LivePage } from "../modules/live/LivePage";
import { LandingPage } from "../modules/landing/LandingPage";
import { HistoryPage } from "../modules/history/HistoryPage";
import { PlayersPage } from "../modules/players/PlayersPage";
import { ProfilePage } from "../modules/profile/ProfilePage";
import { PlayPage } from "../modules/play/PlayPage";
import { LoginPage } from "../modules/auth/LoginPage";
import { RegisterPage } from "../modules/auth/RegisterPage";
import { ForgotPasswordPage } from "../modules/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../modules/auth/ResetPasswordPage";
import { RequireAuth, RequireGuest } from "../modules/auth/RequireAuth";

export const router = createBrowserRouter([
  { path: "/login",           element: <RequireGuest><LoginPage /></RequireGuest> },
  { path: "/register",        element: <RequireGuest><RegisterPage /></RequireGuest> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password",  element: <ResetPasswordPage /> },
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "replay",   element: <ReplayPage /> },
      { path: "settings", element: <RequireAuth><SettingsPage /></RequireAuth> },
      { path: "board",    element: <RequireAuth><Board /></RequireAuth> },
      { path: "players",  element: <RequireAuth><PlayersPage /></RequireAuth> },
      { path: "live",     element: <RequireAuth><LivePage /></RequireAuth> },
      { path: "history",  element: <RequireAuth><HistoryPage /></RequireAuth> },
      { path: "profile",  element: <RequireAuth><ProfilePage /></RequireAuth> },
      { path: "play",     element: <RequireAuth><PlayPage /></RequireAuth> },
    ],
  },
]);
