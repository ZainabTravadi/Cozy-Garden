import { useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "../services/api";
import { AuthContext } from "./authContext";
import { trackEvent } from "../services/analytics";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loggedOutRef = useRef(false);
  const firstUserSeenRef = useRef(false);
  const userId = user?.id;

  useEffect(() => {
    apiRequest("/auth/me")
      .then(({ user: currentUser }) => {
        if (!loggedOutRef.current) setUser(currentUser);
      })
      .catch(() => {
        if (!loggedOutRef.current) setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!userId) return;
    if (!firstUserSeenRef.current) {
      firstUserSeenRef.current = true;
      let returning = false;
      try {
        returning = localStorage.getItem("cozy-garden-seen-player") === "yes";
        localStorage.setItem("cozy-garden-seen-player", "yes");
      } catch { /* Analytics remains optional when storage is unavailable. */ }
      if (returning) trackEvent("return_session");
    }
    const startedAt = Date.now();
    let reported = false;
    const reportDuration = () => {
      if (reported) return;
      reported = true;
      trackEvent("game_session_duration", { duration_seconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)) });
    };
    const handlePageHide = () => reportDuration();
    window.addEventListener("pagehide", handlePageHide, { once: true });
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      reportDuration();
    };
  }, [userId]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (values) => {
        loggedOutRef.current = false;
        const result = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify(values),
        });
        setUser(result.user);
        return result.user;
      },
      signup: async (values) => {
        loggedOutRef.current = false;
        const result = await apiRequest("/auth/signup", {
          method: "POST",
          body: JSON.stringify(values),
        });
        setUser(result.user);
        return result.user;
      },
      logout: async () => {
        loggedOutRef.current = true;
        setUser(null);
        await apiRequest("/auth/logout", { method: "POST" });
      },
      deleteAccount: async (password) => {
        await apiRequest("/player/account", { method: "DELETE", body: JSON.stringify({ password }) });
        loggedOutRef.current = true;
        setUser(null);
      },
      updateUser: setUser,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
