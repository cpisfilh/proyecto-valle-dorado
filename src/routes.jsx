import {
  BanknotesIcon,
  CalendarIcon,
  HomeIcon,
  MapPinIcon,
  UserIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Customers from "./pages/dashboard/customers";
import { Children } from "react";
import Show from "./custom/components/Show";
import Create from "./custom/components/Create";
import Edit from "./custom/components/Edit";
import Blocks from "./pages/dashboard/blocks";
import Lots from "./pages/dashboard/lots";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: null,
        name: "Tablero",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Clientes",
        path: "/clientes",
        element: <Customers />,
        children: [
          {
            name: "Mostrar Cliente",
            path: "show",
            element: <Show />,
          },
          {
            name: "Crear Cliente",
            path: "create",
            element: <Create />,
          },
          {
            name: "Editar Cliente",
            path: "edit",
            element: <Edit />,
          }
        ],
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "Predios",
        path: "/predios",
        element: <Home />,
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "Pagos",
        path: "/pagos",
        element: <Home />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Manzanas",
        path: "/manzanas",
        element: <Blocks />,
        children: [
          {
            name: "Mostrar Manzana",
            path: "show",
            element: <Show />,
          },
          {
            name: "Crear Manzana",
            path: "create",
            element: <Create />,
          },
          {
            name: "Editar Manzana",
            path: "edit",
            element: <Edit />,
          }
        ],
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Lotes",
        path: "/lotes",
        element: <Lots />,
        children: [
          {
            name: "Mostrar Lote",
            path: "show",
            element: <Show />,
          },
          {
            name: "Crear Lote",
            path: "create",
            element: <Create />,
          },
          {
            name: "Editar Manzana",
            path: "edit",
            element: <Edit />,
          }
        ],
      },
      {
        icon: <CalendarIcon {...icon} />,
        name: "Cuotas",
        path: "/cuotas",
        element: <Home />,
      }
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/profile",
      //   element: <Profile />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "tables",
      //   path: "/tables",
      //   element: <Tables />,
      // },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
