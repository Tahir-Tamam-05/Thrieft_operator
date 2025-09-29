import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Home, 
  Heart, 
  ShoppingBag, 
  Recycle, 
  BarChart3, 
  Shield,
  Leaf
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/donate", label: "Donate", icon: Heart },
    { path: "/shop", label: "Shop Thrift", icon: ShoppingBag },
    { path: "/recycling", label: "Recycling", icon: Recycle },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/admin", label: "Admin", icon: Shield },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            data-testid="logo-link"
          >
            <div className="relative">
              <Leaf className="h-8 w-8 text-green-600 group-hover:text-green-700 transition-colors duration-200" />
              <div className="absolute inset-0 bg-green-600 blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-200"></div>
            </div>
            <span className="font-display font-bold text-xl text-gray-900 group-hover:text-green-700 transition-colors duration-200">
              ThriftLife
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive(item.path)
                        ? "bg-green-100 text-green-700 shadow-sm"
                        : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button 
              asChild
              className="btn-primary text-white px-6 py-2 rounded-full font-semibold shadow-lg"
              data-testid="cta-login-button"
            >
              <Link to="/dashboard">My Account</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-green-600"
              data-testid="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div 
          className="md:hidden bg-white/95 backdrop-blur-lg border-t border-green-100 shadow-lg animate-slideInRight"
          data-testid="mobile-navigation"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-3 ${
                    isActive(item.path)
                      ? "bg-green-100 text-green-700 shadow-sm"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                  data-testid={`mobile-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-gray-200">
              <Button 
                asChild
                className="w-full btn-primary text-white font-semibold py-3 rounded-lg shadow-lg"
                data-testid="mobile-cta-login-button"
              >
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  My Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;