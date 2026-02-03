/**
 * Simple toast notification system
 * Uses native browser APIs - no external dependencies
 */

type ToastType = "success" | "error" | "info";

interface ToastOptions {
  duration?: number;
  type?: ToastType;
}

let toastContainer: HTMLDivElement | null = null;

function getToastContainer(): HTMLDivElement {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "fixed top-4 right-4 z-50 flex flex-col gap-2";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

function getToastStyles(type: ToastType): string {
  const baseStyles =
    "px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 ease-in-out";
  const typeStyles = {
    success:
      "bg-green-500/10 dark:bg-green-500/20 border-green-500/20 text-green-900 dark:text-green-100",
    error:
      "bg-red-500/10 dark:bg-red-500/20 border-red-500/20 text-red-900 dark:text-red-100",
    info: "bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20 text-blue-900 dark:text-blue-100",
  };
  return `${baseStyles} ${typeStyles[type]}`;
}

export function toast(message: string, options: ToastOptions = {}) {
  const { duration = 3000, type = "info" } = options;

  const container = getToastContainer();
  const toastEl = document.createElement("div");

  toastEl.className = getToastStyles(type);
  toastEl.textContent = message;
  toastEl.style.opacity = "0";
  toastEl.style.transform = "translateX(100%)";

  container.appendChild(toastEl);

  // Trigger animation
  requestAnimationFrame(() => {
    toastEl.style.opacity = "1";
    toastEl.style.transform = "translateX(0)";
  });

  // Auto dismiss
  setTimeout(() => {
    toastEl.style.opacity = "0";
    toastEl.style.transform = "translateX(100%)";
    setTimeout(() => {
      container.removeChild(toastEl);
    }, 300);
  }, duration);
}

toast.success = (message: string, duration?: number) =>
  toast(message, { type: "success", duration });

toast.error = (message: string, duration?: number) =>
  toast(message, { type: "error", duration });

toast.info = (message: string, duration?: number) =>
  toast(message, { type: "info", duration });
