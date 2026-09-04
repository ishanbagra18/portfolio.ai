import { Suspense, lazy } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { isAuthenticated } from "./lib/auth";
import { LoadingFallback } from "./components/ui/LoadingFallback";
import "./index.css";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const ViewTemplates = lazy(() => import("./pages/ViewTemplates"));
const Providedata = lazy(() => import("./pages/ProvideData"));
const EditPortfolio = lazy(() => import("./pages/EditPortfolio"));
const AtsChecker = lazy(() => import("./pages/AtsChecker"));
const CareerTools = lazy(() => import("./pages/CareerTools"));
const PortfolioMatcher = lazy(() => import("./pages/PortfolioMatcher"));
const Profile = lazy(() => import("./components/Profile"));
const UpdateProfile = lazy(() => import("./components/UpdateProfile"));
const MyPortfolios = lazy(() => import("./components/MyPortfolios"));
const PublicPortfolio = lazy(() => import("./pages/PublicPortfolio"));

const Template1 = lazy(() => import("./Templates/Template1/Template1"));
const Template2 = lazy(() => import("./Templates/Template2/Template2"));
const Template3 = lazy(() => import("./Templates/Template3/Template3"));
const Template4 = lazy(() => import("./Templates/Template4/Template4"));
const Template5 = lazy(() => import("./Templates/Template5/Template5"));
const Template6 = lazy(() => import("./Templates/Template6/Template6"));
const Template7 = lazy(() => import("./Templates/Template7/Template7"));
const Template8 = lazy(() => import("./Templates/Template8/Template8"));
const Template9 = lazy(() => import("./Templates/Template9/Template9"));
const Template10 = lazy(() => import("./Templates/Template10/Template10"));
const Template11 = lazy(() => import("./Templates/Template11/Template11"));
const Template12 = lazy(() => import("./Templates/Template12/Template12"));
const Template13 = lazy(() => import("./Templates/Template13/Template13"));
const Template14 = lazy(() => import("./Templates/Template14/Template14"));
const Template15 = lazy(() => import("./Templates/Template15/Template15"));
const Template16 = lazy(() => import("./Templates/Template16/Template16"));
const Template17 = lazy(() => import("./Templates/Template17/Template17"));
const Template18 = lazy(() => import("./Templates/Template18/Template18"));
const Template19 = lazy(() => import("./Templates/Template19/Template19"));
const Template20 = lazy(() => import("./Templates/Template20/Template20"));

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
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-aurora text-[var(--neo-text)] font-sans antialiased overflow-hidden relative">
      {/* Noise Texture */}
      <div className="noise-overlay" />
      
      {/* Background Animated Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Main Glass Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative w-full max-w-md glass-panel p-8"
      >
        <nav className="mb-8 flex justify-between items-center border-b border-white/10 pb-4">
          <span className="text-xl font-display font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            SecureAuth
          </span>

          <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/5 text-xs font-semibold backdrop-blur-md">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname === "/login"
                  ? "bg-white/10 text-[var(--neo-text)] shadow-lg neo-pressed"
                  : "text-[var(--neo-text)]/60 hover:text-[var(--neo-text)] hover:bg-white/5"
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname === "/register"
                  ? "bg-white/10 text-[var(--neo-text)] shadow-lg neo-pressed"
                  : "text-[var(--neo-text)]/60 hover:text-[var(--neo-text)] hover:bg-white/5"
              }`}
            >
              Register
            </Link>
          </div>
        </nav>

        {/* Page Content wrapped in AnimatePresence for tab switching */}
        <div className="relative">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes key={location.pathname} location={location}>
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

        {/* Career Tools (Resume Upload) */}
        <Route
          path="/career-tools"
          element={
            <ProtectedRoute>
              <CareerTools />
            </ProtectedRoute>
          }
        />

        {/* Smart Portfolio Matcher */}
        <Route
          path="/portfolio-matcher/:id"
          element={
            <ProtectedRoute>
              <PortfolioMatcher />
            </ProtectedRoute>
          }
        />



        {/* Public Portfolio View */}
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

        <Route
          path="/portfolio/template16/:portfolioId?"
          element={
            <ProtectedRoute>
              <Template16 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio/template17/:portfolioId?"
          element={
            <ProtectedRoute>
              <Template17 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio/template18/:portfolioId?"
          element={
            <ProtectedRoute>
              <Template18 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio/template19/:portfolioId?"
          element={
            <ProtectedRoute>
              <Template19 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio/template20/:portfolioId?"
          element={
            <ProtectedRoute>
              <Template20 />
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
      </Suspense>
    </AnimatePresence>
  );
}