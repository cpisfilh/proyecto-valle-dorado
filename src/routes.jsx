import {
  BanknotesIcon,
  CalendarIcon,
  HomeIcon,
  MapIcon,
  MapPinIcon,
  UserIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import Customers from "./pages/dashboard/customers";
import Show from "./custom/components/Show";
import Create from "./custom/components/Create";
import Edit from "./custom/components/Edit";
import Blocks from "./pages/dashboard/blocks";
import Lots from "./pages/dashboard/lots";
import Properties from "./pages/dashboard/property";
import PropertiesXCustomer from "./pages/dashboard/propertiesxcustomer";
import Payments from "./pages/dashboard/payments";
import CreatePayment from "./custom/components/pagos/CreatePayment";
import EditPayment from "./custom/components/pagos/EditPayment";
import Quotas from "./pages/dashboard/quotas";
import CreateQuota from "./custom/components/cuotas/CreateQuota";
import EditQuota from "./custom/components/cuotas/EditQuota";

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
        element: <Properties />,
        children: [
          {
            name: "Mostrar Predio",
            path: "show",
            element: <Show />,
          },
          {
            name: "Crear Predio",
            path: "create",
            element: <Create />,
          },
          {
            name: "Editar Predio",
            path: "edit",
            element: <Edit />,
          }
        ],
      },
      {
        icon: <MapIcon {...icon} />,
        name: "Predios x Clientes",
        path: "/prediosxclientes",
        element: <PropertiesXCustomer />,
        // children: [
        //   {
        //     name: "Predios por Cliente",
        //     path: "search",
        //     element: <PropertiesByClient />,
        //   },
          // {
          //   name: "Crear Manzana",
          //   path: "create",
          //   element: <Create />,
          // },
          // {
          //   name: "Editar Manzana",
          //   path: "edit",
          //   element: <Edit />,
          // }
        // ],
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "Pagos",
        path: "/pagos",
        element: <Payments />,
        children: [
          {
            name: "Crear Pago",
            path: "create",
            element: <CreatePayment />,
          },
          {
            name: "Editar Predio",
            path: "edit",
            element: <EditPayment />,
          }
        ],
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
            name: "Crear Pago",
            path: "create",
            element: <CreatePayment />,
          },
          {
            name: "Editar Pago",
            path: "edit",
            element: <EditPayment />,
          }
        ],
      },
      {
        icon: <CalendarIcon {...icon} />,
        name: "Cuotas",
        path: "/cuotas",
        element: <Quotas />,
        children: [
          {
            name: "Crear Cuota",
            path: "create",
            element: <CreateQuota />,
          },
          {
            name: "Editar Cuota",
            path: "edit",
            element: <EditQuota />,
          }
        ],
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
