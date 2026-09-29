import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ renderContent }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#0E0B12] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,69,19,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,19,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Subtle animated lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-full h-px bg-gradient-to-l from-transparent via-purple-600/30 to-transparent animate-pulse delay-500"></div>
      </div>

      {/* Fixed Sidebar */}
      <div className="relative z-100 flex-shrink-0">
        {/* Desktop Sidebar - Always visible and fixed */}
        <div className="hidden lg:block">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobileMenuOpen={false}
            onMobileMenuClose={handleMobileMenuClose}
          />
        </div>

        {/* Mobile Sidebar - Overlay when open */}
        <div className="lg:hidden">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuClose={handleMobileMenuClose}
          />
        </div>

        {/* Mobile sidebar backdrop */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-[#0E0B12]/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleMobileMenuClose}
          ></div>
        )}
      </div>

      {/* Main content area - Completely scrollable */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Fixed Header */}
        <div className="flex-shrink-0 sticky top-0 z-20 backdrop-blur-xl bg-[#0E0B12]/95 border-b border-fuchsia-500/20 shadow-lg shadow-purple-600/10">
          <Header
            onMenuClick={handleMobileMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
          />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Full scrollable content area */}
          <div className="min-h-full p-4 sm:p-6 lg:p-8">
            {/* Content wrapper */}
            <div className="min-h-full">{renderContent(activeTab)}</div>
          </div>
        </main>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        /* Custom scrollbar for main content */
        main::-webkit-scrollbar {
          width: 8px;
        }

        main::-webkit-scrollbar-track {
          background: rgba(14, 11, 18, 0.3);
          border-radius: 4px;
        }

        main::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #d946ef, #9333ea);
          border-radius: 4px;
        }

        main::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #c026d3, #7c3aed);
        }

        /* Smooth scrolling */
        main {
          scroll-behavior: smooth;
        }

        /* Enhanced focus states */
        *:focus {
          outline: 2px solid #d946ef;
          outline-offset: 2px;
        }

        /* Ensure proper height calculation */
        .flex-1 {
          min-height: 0;
        }

        /* Mobile menu animations */
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        .mobile-menu-enter {
          animation: slideIn 0.3s ease-out;
        }

        .mobile-menu-exit {
          animation: slideOut 0.3s ease-in;
        }

        /* Hide scrollbar for body to prevent double scrollbars */
        body {
          overflow: hidden;
        }

        /* Ensure content fills available space */
        .min-h-full {
          min-height: 100%;
        }
      `}</style>
    </div>
  );
};

export default Layout;
