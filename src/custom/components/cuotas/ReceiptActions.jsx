import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

import {
  ChevronDownIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";

import {
  uploadReceipt,
  getReceiptUrl,
} from "@/requests/reqCuotas";

import Swal from "sweetalert2";

import { useRef, useState } from "react";

const ReceiptActions = ({
  cuota,
  onUploaded,
}) => {

  const [dragActive, setDragActive] =
    useState(false);

  const fileInputRef =
    useRef(null);

  async function uploadFile(
    file
  ) {

    if (!file) return;

    if (
      file.type !==
      "application/pdf"
    ) {

      Swal.fire({
        icon: "error",
        text: "Solo PDFs",
      });

      return;
    }

    try {

      Swal.fire({
        title: "Subiendo...",
        text: "Procesando PDF",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response =
        await uploadReceipt(
          cuota.id,
          file
        );

      Swal.fire({
        icon: "success",
        title: "Recibo subido",
        text:
          `PDF optimizado a ${response.data.compressed_size_mb} MB`,
      });

      onUploaded?.();

    } catch (error) {

      Swal.fire({
        icon: "error",
        text:
          error?.response?.data?.error ||
          "Error subiendo archivo",
      });

    } finally {

      setDragActive(false);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    }
  }

  async function handleUpload(
    event
  ) {

    const file =
      event.target.files?.[0];

    uploadFile(file);
  }

  async function handleDownload() {

    try {

      Swal.fire({
        title:
          "Generando enlace...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response =
        await getReceiptUrl(
          cuota.id
        );

      Swal.close();

      window.open(
        response.data.signedUrl,
        "_blank"
      );

    } catch (error) {

      Swal.fire({
        icon: "error",
        text:
          error?.response?.data?.error ||
          "Error descargando recibo",
      });
    }
  }

  function triggerFileInput() {

    fileInputRef.current?.click();
  }

  function handleDragOver(
    event
  ) {

    event.preventDefault();

    setDragActive(true);
  }

  function handleDragLeave(
    event
  ) {

    event.preventDefault();

    setDragActive(false);
  }

  function handleDrop(event) {

    event.preventDefault();

    setDragActive(false);

    const file =
      event.dataTransfer.files?.[0];

    uploadFile(file);
  }

  return (
    <>

      {/* INPUT FUERA DEL MENU */}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleUpload}
      />

      <Menu>

        <MenuHandler>

          <Button
            size="sm"

            onDragOver={
              handleDragOver
            }

            onDragLeave={
              handleDragLeave
            }

            onDrop={handleDrop}

            className={`
              flex
              items-center
              gap-2
              px-3
              py-2
              ms-2
              transition-all

              ${
                dragActive
                  ? `
                    bg-yellow-800
                    scale-105
                    ring-4
                    ring-yellow-300
                  `
                  : `
                    bg-yellow-600
                    hover:bg-yellow-700
                  `
              }
            `}
          >
            {
              dragActive
                ? "Soltar PDF"
                : "Recibo"
            }

            <ChevronDownIcon
              className="w-4 h-4"
            />
          </Button>

        </MenuHandler>

        <MenuList>

          {
            cuota.file_url && (
              <MenuItem
                onClick={
                  handleDownload
                }
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <ArrowDownTrayIcon
                  className="w-5 h-5"
                />

                Descargar
              </MenuItem>
            )
          }

          <MenuItem
            onClick={
              triggerFileInput
            }
            className="
              flex
              items-center
              gap-2
            "
          >

            {
              cuota.file_url ? (
                <>
                  <ArrowUpTrayIcon
                    className="w-5 h-5"
                  />

                  Cambiar
                </>
              ) : (
                <>
                  <DocumentPlusIcon
                    className="w-5 h-5"
                  />

                  Subir
                </>
              )
            }

          </MenuItem>

        </MenuList>

      </Menu>

    </>
  );
};

export default ReceiptActions;
