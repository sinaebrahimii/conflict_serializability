import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ScheduleList from "./components/ScheduleList.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Define your routes
const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <App />, // Render your main App component here
  // },
  {
    path: "/",
    element: <ScheduleList />, // Example of another route
  },
  {
    path: "/schedules/:scheduleId",
    element: <App />, // Render the details component here
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
