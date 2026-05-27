import { useNavigate, type NavigateOptions } from "react-router";
import type { Route } from "./routes";

export function useRouter() {
  const navigate = useNavigate();

  function goTo(route: Route, params?: Record<string, string>, options?: NavigateOptions): void {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    navigate(route + query, options);
  }

  return { goTo };
}
