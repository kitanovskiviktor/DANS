import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompaniesComponent from './Components/CompaniesComponent';
import PredictionComponent from './Components/PredictionComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
        </Route>
        <Route path="/list" element={<CompaniesComponent />}>
        </Route>
        <Route path="/prediction" element={<PredictionComponent />}>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

