import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { PageLayout } from "./PageLayout";
import IdeasStatusGrid from "./IdeasStatusGrid";
import { theme } from "./theme";
import { ErrorPage } from "./ErrorPage";
import InnovationsCells from "./InnovationsCells";
import LandingPage from "./LandingPage";
import {GlobalProvider} from "./context/GlobalProvider";
import AdminDashboard from "./AdminDashboard";

const AppContent = () => {
  const location = useLocation();

  return (

    <PageLayout currentPath={location.pathname} limitContentWidth>
      <main>
        <Routes>
          <Route path={'/'} element={<LandingPage />} />
          <Route path={'/innovation-cells'} element={<InnovationsCells />} />
          <Route path={'/innovationCell'} element={<InnovationsCells />} />
          <Route path={'/innovationcell'} element={<InnovationsCells />} />
          <Route path={'/status'} element={<IdeasStatusGrid />} />
          <Route path={'/admin'} element={<AdminDashboard />} />
          <Route path={'/errorPage'} element={<ErrorPage />} />
          <Route path={'*'} element={<ErrorPage />} />
        </Routes>
      </main>
    </PageLayout>

  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      </GlobalProvider>
    </ThemeProvider>
  );
};

export default App;
