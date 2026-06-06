import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Select,
    Option
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import useAuthStore from "@/store/authStore";

import {
  changeProject,
  logoutRequest
} from "@/requests/auth";

import {
  getProjects
} from "@/requests/reqProyectos";
import { useState } from "react";
import { useEffect } from "react";

export function DashboardNavbar() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const setCurrentUser = useAuthStore(
    (state) => state.setCurrentUser
  );

  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [projects, setProjects] =
    useState([]);

  const handleLogout = async () => {

    try {

      await logoutRequest();

      logout();

      window.location.href =
        "/auth/sign-in";

    } catch (error) {

      console.error(error);
    }
  };

  const handleChangeProject = async (
    proyectoId
  ) => {

    try {

      const response =
        await changeProject(
          Number(proyectoId)
        );

      if (
        response.message === "exito"
      ) {

        setCurrentUser({
          ...currentUser,
          proyecto:
            response.data.proyecto
        });

        // 🔥 recargar app tenant
        window.location.replace(
          "/dashboard/home"
        );
      }

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    const loadProjects = async () => {

      try {

        const response =
          await getProjects();

        if (
          response.message === "exito"
        ) {

          setProjects(
            response.data
          );
        }

      } catch (error) {

        console.error(error);
      }
    };

    loadProjects();

  }, []);

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""
              }`}
          >
            {/* <Link to={`/${layout}`}> */}
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal opacity-50 transition-all"
            >
              {layout}
            </Typography>
            {/* </Link> */}
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page ? page : "Dashboard"}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page ? page : "Dashboard"}
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          {/* <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton> */}
          {/* <Link to="/auth/sign-in"> */}
          {
            currentUser?.proyecto &&
              projects.length > 0 && (

              <div className="w-80">

                <Select
                  label="Proyecto"

                  value={String(
                    currentUser.proyecto.id
                  )}

                  onChange={
                    handleChangeProject
                  }
                >

                  {/* 🔥 temporal hardcode */}
                  {
                    projects.map((project) => (

                      <Option
                        key={project.id}
                        value={String(project.id)}
                      >
                        {project.nombre}
                      </Option>

                    ))
                  }

                </Select>

              </div>
            )
          }
            <Button
              variant="text"
              color="blue-gray"
              className="items-center gap-1 px-4 flex normal-case"
              onClick={handleLogout}
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              {currentUser ? currentUser.nombre : "Iniciar sesion"}
            </Button>
          {/* </Link> */}
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenSidenav(dispatch, true)}
          >
            <Bars3Icon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
