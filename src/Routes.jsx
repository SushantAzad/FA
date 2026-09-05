import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import BlockchainApp from './pages/blockchain';

export default function Routes() {
  return <BrowserRouter><ErrorBoundary><ScrollToTop /><BlockchainApp /></ErrorBoundary></BrowserRouter>;
}
