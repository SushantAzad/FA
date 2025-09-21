import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Authentication from "./pages/authentication";
import TransactionHistory from "./pages/transaction-history";
import AssetDetails from "./pages/asset-details";
import AssetBrowser from "./pages/asset-browser";
import Dashboard from "./pages/dashboard";
import PortfolioManagement from "./pages/portfolio-management";
import PropertyUpload from "./pages/property-upload";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<AssetBrowser />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/asset-details" element={<AssetDetails />} />
          <Route path="/asset-browser" element={<AssetBrowser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/portfolio-management"
            element={<PortfolioManagement />}
          />
          <Route path="/property-upload" element={<PropertyUpload />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
