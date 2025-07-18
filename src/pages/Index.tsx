import { useState, useEffect } from "react";
import { AuthForm } from "@/components/AuthForm";
import { BlogDashboard } from "@/components/BlogDashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <BlogDashboard onLogout={handleLogout} />;
  }

  return <AuthForm onAuthSuccess={handleAuthSuccess} />;
};

export default Index;
