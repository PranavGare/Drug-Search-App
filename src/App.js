import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DrugSearch from './components/DrugSearch';
import DrugDetails from './components/DrugDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/drugs/search" />} />
          <Route path="/drugs/search" element={<DrugSearch />} />
          <Route path="/drugs/:drug_name" element={<DrugDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
