import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@mui/material";
import theme from "./assets/theme/index.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./contexts/app.context.tsx";
import "./i18n.tsx";
import { SnackbarProvider } from "notistack";
import "react-multi-carousel/lib/styles.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// Create client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Để chặn trường hợp call lại api khi chuyển màn hình
      retry: 0, // Không cho retry
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppProvider>
          <SnackbarProvider
            hideIconVariant
            autoHideDuration={3000}
            maxSnack={1}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            preventDuplicate
            style={{
              width: "400px",
            }}
          >
            <App />
          </SnackbarProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
