import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Auth/Login";
import { Toaster } from "@/components/ui/shadcn/toaster";
import { authRoutes, dashboardRoutes, type RouteType } from "./layout/Routes";
import DashboardLayout from "./layout/DashboardLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import CreatePassword from "./pages/Auth/CreatePassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import EnterCode from "./pages/Auth/EnterCode";
import ResetSuccessful from "./pages/Auth/ResetSuccessful";
import Overview from "./pages/Dashboard/Overview";

function App() {
  const queryClient = new QueryClient();
  const [authState] = useContext(AuthContext);
  console.log("authstate e?", authState);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="app">
        <Router>
          <Routes>
            {/* <Route path="/login" element={<Login />} />
              <Route path="/create-password" element={<CreatePassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/enter-code" element={<EnterCode />} />
              <Route path="/reset-successful" element={<ResetSuccessful />} />
              
              
              <Route path="/overview" element={<Overview />} /> */}
            <Route
              path="/"
              element={
                authState?.user ? (
                  <DashboardLayout>
                    <Overview />
                  </DashboardLayout>
                ) : (
                  // <CreatePassword />
                  <Login />
                )
              }
            />

            {authRoutes.map((route, id) => (
              <Route key={id} path={route.path} element={route.element} />
            ))}

            {dashboardRoutes.map((route: RouteType, id) => (
              <Route
                key={id}
                path={route.path}
                element={
                  authState?.user ? (
                    <DashboardLayout>{route.element}</DashboardLayout>
                  ) : (
                    <Login />
                  )
                }
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;
