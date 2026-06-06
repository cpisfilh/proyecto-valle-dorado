import { Routes, Route, Navigate } from "react-router-dom";

import { Dashboard, Auth } from "@/layouts";

import { useEffect, useState } from "react";

import useAuthStore from "./store/authStore";

import { getuserByToken } from "./requests/auth";

function App() {

  const user = useAuthStore(
    (state) => state.currentUser
  );

  const setCurrentUser = useAuthStore(
    (state) => state.setCurrentUser
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const [loadingAuth, setLoadingAuth] =
    useState(true);

  useEffect(() => {

    const loadSession = async () => {

      try {

        const response =
          await getuserByToken();

        if (
          response.message === "exito"
        ) {

          setCurrentUser(
            response.data
          );

        } else {

          logout();
        }

      } catch (error) {

        logout();

      } finally {

        setLoadingAuth(false);
      }
    };

    loadSession();

  }, []);

  // ⏳ Esperar auth
  if (loadingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <>
    <Routes>

      {user ? (
        <>
          <Route
            path="/dashboard/*"
            element={<Dashboard />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard/home"
                replace
              />
            }
          />
        </>
      ) : (
        <>
          <Route
            path="/auth/*"
            element={<Auth />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/auth/sign-in"
                replace
              />
            }
          />
        </>
      )}

      </Routes>
    </>
  );
}

export default App;
