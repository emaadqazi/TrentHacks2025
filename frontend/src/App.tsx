import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/Landing"
import DashboardPage from "./pages/Dashboard"
import LoginPage from "./pages/Login"
import TemplatesPage from "./pages/Templates"
import ResumeTest from "./pages/ResumeTest"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/resume-test" element={<ResumeTest />} />
      </Routes>
    </Router>
  )
}

export default App
