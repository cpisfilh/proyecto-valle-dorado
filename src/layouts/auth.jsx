import { Routes, Route, Navigate } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { SignIn, SignUp } from "@/pages/auth";

export function Auth() {
  const icon = {
    className: "w-5 h-5 text-inherit",
  };
  const navbarRoutes = [
    {
      name: "dashboard",
      path: "/dashboard/home",
      icon: ChartPieIcon,
    },
    {
      name: "profile",
      path: "/dashboard/home",
      icon: UserIcon,
    },
    {
      name: "sign up",
      path: "/auth/sign-up",
      icon: UserPlusIcon,
    },
    {
      name: "sign in",
      path: "/auth/sign-in",
      icon: ArrowRightOnRectangleIcon,
    },
  ];
  
  const routes = [{
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  }]

  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
        <Route path="*" element={<Navigate to="/auth/sign-in" />} />
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
