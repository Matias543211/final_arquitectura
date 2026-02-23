// src/App.tsx
import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AppRouter } from "./routes/AppRouter";
import './index.css'
import { useTheme } from "./features/Settings/hooks/useTheme";

export const App = () => {
  const [currentTheme, setCurrentTheme] = useTheme();
  return (

    <Provider store={store}>
      <QueryClientProvider client={queryClient}>

        <AppRouter />
      </QueryClientProvider>
    </Provider>

  );
};
