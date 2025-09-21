import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";

const NavigationBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "LayoutDashboard",
      tooltip: "Portfolio overview and quick actions",
    },
    {
      label: "List Property",
      path: "/property-upload",
      icon: "Upload",
      tooltip: "Upload your property for tokenization",
    },
    {
      label: "Investments",
      path: "/asset-browser",
      icon: "Building2",
      tooltip: "Browse and discover investment properties",
      subItems: [
        { label: "Asset Browser", path: "/asset-browser" },
        { label: "Asset Details", path: "/asset-details" },
      ],
    },
    {
      label: "Portfolio",
      path: "/portfolio-management",
      icon: "PieChart",
      tooltip: "Manage your investment portfolio",
      subItems: [
        { label: "Portfolio Management", path: "/portfolio-management" },
      ],
    },
    {
      label: "History",
      path: "/transaction-history",
      icon: "History",
      tooltip: "View transaction history and records",
    },
  ];

  const isActiveRoute = (path) => {
    if (path === "/dashboard" && location?.pathname === "/") return true;
    return location?.pathname === path || location?.pathname?.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="z-50 bg-background border-b border-border">
        <div className="w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="Building2" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                FractionalAsset
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems?.map((item) => (
                <div key={item?.path} className="relative group">
                  <Link
                    to={item?.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth duration-150 ${
                      isActiveRoute(item?.path)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    title={item?.tooltip}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.label}</span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth duration-150"
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-200 md:hidden">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />
            <div className="absolute top-0 left-0 w-80 h-full bg-card border-r border-border shadow-elevation-4 animate-slide-in">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                    <Icon name="Building2" size={20} color="white" />
                  </div>
                  <span className="text-xl font-semibold text-foreground">
                    FractionalAsset
                  </span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth duration-150"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>

              <div className="p-4 space-y-2">
                {navigationItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-smooth duration-150 ${
                      isActiveRoute(item?.path)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon name={item?.icon} size={20} />
                    <span>{item?.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavigationBar;
