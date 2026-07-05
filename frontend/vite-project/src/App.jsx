import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ViewTemplates from "./pages/ViewTemplates";
import Providedata from "./pages/ProvideData";
import EditPortfolio from "./pages/EditPortfolio";
import AtsChecker from "./pages/AtsChecker";
import JobMatcher from "./pages/JobMatcher";
import Profile from "./components/Profile";
import UpdateProfile from "./components/UpdateProfile";
import Template1 from "./Templates/Template1/Template1";
import Template2 from "./Templates/Template2/Template2";
import Template3 from "./Templates/Template3/Template3";
import Template4 from "./Templates/Template4/Template4";
import Template5 from "./Templates/Template5/Template5";
import Template6 from "./Templates/Template6/Template6";
import Template7 from "./Templates/Template7/Template7";
import Template8 from "./Templates/Template8/Template8";
import Template9 from "./Templates/Template9/Template9";
import Template10 from "./Templates/Template10/Template10";
import Template11 from "./Templates/Template11/Template11";
import Template12 from "./Templates/Template12/Template12";
import Template13 from "./Templates/Template13/Template13";
import Template14 from "./Templates/Template14/Template14";
import Template15 from "./Templates/Template15/Template15";
import { isAuthenticated } from "./lib/auth";
import MyPortfolios from "./components/MyPortfolios";
import PublicPortfolio from "./pages/PublicPortfolio";
import PortfolioCritique from "./pages/PortfolioCritique";
import "./index.css";

/* ---------------- Protected Route ---------------- */

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

/* ---------------- Public Only Route ---------------- */

function PublicOnlyRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/home" replace /> : children;
}

/* ---------------- Auth Layout ---------------- */

function AuthLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-slate-100 font-sans selection:bg-violet-500/30 selection:text-white antialiased">
      {/* Background Blur */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-violet-950/20 hover:border-slate-700/80 transition-all duration-500">
        <nav className="mb-8 flex justify-between items-center border-b border-slate-800/80 pb-4">
          <span className="text-xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            SecureAuth
          </span>

          <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 text-xs font-semibold">
            <Link
              to="/login"
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                location.pathname === "/login"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                location.pathname === "/register"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Register
            </Link>
          </div>
        </nav>

        {children}
      </div>
    </div>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  return (
    <Routes>
      {/* Root */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated() ? "/home" : "/login"}
            replace
          />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicOnlyRoute>
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </PublicOnlyRoute>
        }
      />

      {/* Home */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* My Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Change / Update Profile */}
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        }
      />

      {/* View Templates (Template Selection Page) */}
      <Route
        path="/viewtemplates"
        element={
          <ProtectedRoute>
            <ViewTemplates />
          </ProtectedRoute>
        }
      />

      {/* My Portfolios (Dashboard to view all user created portfolios) */}
      <Route
        path="/my-portfolios"
        element={
          <ProtectedRoute>
            <MyPortfolios />
          </ProtectedRoute>
        }
      />

      {/* Provide Data */}
      <Route
        path="/provide-data/:templateId"
        element={
          <ProtectedRoute>
            <Providedata />
          </ProtectedRoute>
        }
      />

      {/* Edit Portfolio */}
      <Route
        path="/edit-portfolio/:portfolioId"
        element={
          <ProtectedRoute>
            <EditPortfolio />
          </ProtectedRoute>
        }
      />

      {/* ATS Checker */}
      <Route
        path="/ats-checker"
        element={
          <ProtectedRoute>
            <AtsChecker />
          </ProtectedRoute>
        }
      />

      {/* Smart Job Matcher */}
      <Route
        path="/job-matcher/:id"
        element={
          <ProtectedRoute>
            <JobMatcher />
          </ProtectedRoute>
        }
      />

      {/* AI Portfolio Critique */}
      <Route
        path="/critique/:portfolioId"
        element={
          <ProtectedRoute>
            <PortfolioCritique />
          </ProtectedRoute>
        }
      />

      {/* Templates (Notice the "?" at the end of :portfolioId) */}
      <Route
        path="/portfolio/template1/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template1 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template2/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template2 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template3/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template3 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template4/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template4 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template5/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template5 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template6/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template6 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template7/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template7 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template8/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template8 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template9/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template9 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template10/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template10 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template11/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template11 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template12/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template12 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template13/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template13 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template14/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template14 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio/template15/:portfolioId?"
        element={
          <ProtectedRoute>
            <Template15 />
          </ProtectedRoute>
        }
      />

      {/* Public Portfolio (No auth — accessible by anyone with slug) */}
      <Route path="/p/:slug" element={<PublicPortfolio />} />

      {/* Unknown Route */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated() ? "/home" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}