import { createBrowserRouter } from "react-router";
import App from "../App";
import { ReplayPage } from "../modules/replay";
import { SettingsPage } from "../modules/settings/views/SettingsPage";
import { Board } from "../modules/game/views/Board";
import { LivePage } from "../modules/live/views/LivePage";
import { LandingPage } from "../modules/landing/views/LandingPage";
import { HistoryPage } from "../modules/history/views/HistoryPage";
import { PlayersPage } from "../modules/players/views/PlayersPage";
import { FriendsPage } from "../modules/friends/views/FriendsPage";
import { ProfilePage } from "../modules/profile/views/ProfilePage";
import { PlayPage } from "../modules/play/views/PlayPage";
import { LoginPage } from "../modules/auth/views/LoginPage";
import { RegisterPage } from "../modules/auth/views/RegisterPage";
import { ForgotPasswordPage } from "../modules/auth/views/ForgotPasswordPage";
import { ResetPasswordPage } from "../modules/auth/views/ResetPasswordPage";
import { RequireAuth, RequireGuest } from "../modules/auth/components/RequireAuth";

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
      { path: "friends",  element: <RequireAuth><FriendsPage /></RequireAuth> },
      { path: "live",     element: <RequireAuth><LivePage /></RequireAuth> },
      { path: "history",  element: <RequireAuth><HistoryPage /></RequireAuth> },
      { path: "profile",  element: <RequireAuth><ProfilePage /></RequireAuth> },
      { path: "play",     element: <RequireAuth><PlayPage /></RequireAuth> },
    ],
  },
]);
