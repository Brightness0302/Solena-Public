import { toast } from "react-toastify";

export const toastNotify = (type, message) => {
  if (type === "error") {
    return toast.error(message, {
      position: "bottom-left",
      autoClose: 3000,
      theme: "dark",
    });
  } else if (type === "success") {
    return toast.success(message, {
      position: "bottom-left",
      autoClose: 3000,
      theme: "dark",
    });
  } else if (type === "warning") {
    return toast.warning(message, {
      position: "bottom-left",
      autoClose: 3000,
      theme: "dark",
    });
  } else if (type === "warn") {
    return toast.warn(message, {
      position: "bottom-left",
      autoClose: 3000,
      theme: "dark",
    });
  } else if (type === "pending") {
    return toast.loading(message, {
      position: "bottom-left",
      autoClose: 3000,
      theme: "dark",
    });
  } else if (type === "info") {
    return toast.info(message, {
      position: "bottom-left",
      autoClose: 3000,
      theme: "dark",
    });
  } else {
    return toast(message, {
      position: "bottom-left",
      autoClose: 3000,
      theme: "dark",
    });
  }
};
