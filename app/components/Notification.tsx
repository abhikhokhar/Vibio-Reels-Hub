"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    id: number;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 3000);
  };

  return (
   <NotificationContext.Provider value={{ showNotification }}>
  {children}
  {notification && (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center space-x-3 bg-background shadow-xl border border-purple-600 rounded-xl px-5 py-3 animate-fade-in-up">
      <div
        className={`h-2 w-2 rounded-full ${
          notification.type === "success"
            ? "bg-green-500"
            : notification.type === "error"
            ? "bg-red-500"
            : notification.type === "warning"
            ? "bg-yellow-500"
            : "bg-blue-500"
        }`}
      ></div>
      <span
        className={`text-lg font-semibold ${
          notification.type === "error"
            ? "text-red-600"
            : notification.type === "success"
            ? "text-green-600"
            : notification.type === "warning"
            ? "text-yellow-600"
            : "text-blue-600"
        }`}
      >
        {notification.message}
      </span>
    </div>
  )}
</NotificationContext.Provider>

  );
}

function getAlertClass(type: NotificationType): string {
  switch (type) {
    case "success":
      return "alert-success";
    case "error":
      return "alert-error";
    case "warning":
      return "alert-warning";
    case "info":
      return "alert-info";
    default:
      return "alert-info";
  }
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}