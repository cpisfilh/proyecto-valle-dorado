import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { useState } from "react";
import useAuthStore from "./store/authStore";

function App() {
  const user = useAuthStore((state) => state.currentUser);
  return (
    <Routes>
      {user ? (
        <>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
