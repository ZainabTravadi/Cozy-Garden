import { useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "../services/api";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loggedOutRef = useRef(false);

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
      updateUser: setUser,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
