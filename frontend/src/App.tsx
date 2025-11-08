import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/Landing"
import DashboardPage from "./pages/Dashboard"
import LoginPage from "./pages/Login"
import TemplatesPage from "./pages/Templates"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
      </Routes>
    </Router>
  )
}

export default App
