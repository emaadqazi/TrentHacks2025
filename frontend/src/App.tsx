import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import LandingAuthPage from "./pages/LandingAuth"
import DashboardPage from "./pages/Dashboard"
import TemplatesPage from "./pages/Templates"
import BlockEditor from "./pages/BlockEditor"
import ResumeTest from "./pages/ResumeTest"
import ResumeCritiquePage from "./pages/ResumeCritique"
import JobTrackerPage from "./pages/JobTracker"
import InterviewQuestionsPage from "./pages/InterviewQuestions"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingAuthPage />} />
          <Route path="/login" element={<LandingAuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <TemplatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <BlockEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <BlockEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-test"
            element={
              <ProtectedRoute>
                <ResumeTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/critique"
            element={
              <ProtectedRoute>
                <ResumeCritiquePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-tracker"
            element={
              <ProtectedRoute>
                <JobTrackerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-questions"
            element={
              <ProtectedRoute>
                <InterviewQuestionsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
