// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import LoginPage from "@/pages/LoginPage";
import ResidentsPage from "@/pages/ResidentsPage";
import ResidentDetailPage from "@/pages/ResidentDetailPage";
import NewResidentPage from "@/pages/NewResidentPage";
import EditResidentPage from "@/pages/EditResidentPage";


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/residents" element={<ResidentsPage />} />
              <Route path="/residents/:id" element={<ResidentDetailPage />} />
              <Route path="/residents/new" element={<NewResidentPage />} />
              <Route
                path="/residents/edit/:id"
                element={<EditResidentPage />}
              />
              <Route path="*" element={<div>Not Found</div>} />
            </Routes>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
