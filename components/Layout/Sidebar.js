import { useState } from "react";
import {
  FiMessageCircle,
  FiUsers,
  FiSettings,
  FiHome,
  FiSend,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi";
import { BiTransfer } from "react-icons/bi";

const Sidebar = ({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  onMobileMenuClose,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "chat", label: "Chat", icon: FiMessageCircle },
    { id: "friends", label: "Friends", icon: FiUsers },
    { id: "transfers", label: "Transfers", icon: BiTransfer },
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  const handleMenuItemClick = (itemId) => {
    setActiveTab(itemId);
    // Close mobile menu when item is selected
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  return (
    <>
      {/* Fixed Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 z-50 left-0 z-40 w-72 h-screen
        bg-[#0E0B12] backdrop-blur-xl border-r border-fuchsia-500/20 
        transform transition-all duration-500 ease-out
        flex flex-col
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-fuchsia-500/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-600/10 to-transparent"></div>

          {/* Floating particles */}
          <div className="absolute top-20 left-8 w-2 h-2 bg-fuchsia-400/60 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-12 w-1 h-1 bg-purple-400/60 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-32 left-12 w-1.5 h-1.5 bg-fuchsia-300/60 rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Fixed Header Section */}
        <div className="relative z-10 flex items-center justify-between h-20 bg-gradient-to-r from-[#0E0B12] via-fuchsia-500/5 to-[#0E0B12] border-b border-fuchsia-500/20 px-6 flex-shrink-0">
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
              ChatDapp
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 mx-auto mt-2 rounded-full"></div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onMobileMenuClose}
            className="lg:hidden p-2 text-gray-400 hover:text-white bg-fuchsia-500/10 hover:bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/20 transition-all duration-300 hover:scale-110"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-6 px-4 space-y-2 relative z-10 pb-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`
                      w-full flex items-center px-6 py-4 text-left rounded-xl transition-all duration-300 relative overflow-hidden
                      ${
                        isActive
                          ? "bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 text-white shadow-lg shadow-purple-600/20 border border-fuchsia-500/30"
                          : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-fuchsia-500/10 hover:to-purple-600/10 hover:border hover:border-fuchsia-500/20 border border-transparent"
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-fuchsia-400 to-purple-500 rounded-r-full"></div>
                    )}

                    {/* Icon with enhanced styling */}
                    <div
                      className={`mr-4 p-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-fuchsia-500/30 to-purple-600/30 shadow-lg"
                          : "group-hover:bg-fuchsia-500/10"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`transition-all duration-300 ${
                          isActive
                            ? "text-fuchsia-300"
                            : "group-hover:text-fuchsia-400"
                        }`}
                      />
                    </div>

                    {/* Label */}
                    <span
                      className={`font-medium transition-all duration-300 ${
                        isActive ? "text-white" : "group-hover:text-fuchsia-200"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-400/20 to-purple-500/20 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-xl"></div>
                  </button>

                  {/* Connecting line animation */}
                  {index < menuItems.length - 1 && (
                    <div className="ml-10 h-4 w-px bg-gradient-to-b from-fuchsia-500/20 to-purple-600/20 opacity-30"></div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Fixed Bottom Decoration */}
        <div className="relative z-10 p-6 flex-shrink-0">
          <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent"></div>
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-1">
              <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Enhanced Effects */}
      <style jsx>{`
        /* Custom scrollbar for navigation only */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(14, 11, 18, 0.3);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #d946ef, #9333ea);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #c026d3, #7c3aed);
        }

        /* Enhanced focus states */
        button:focus {
          outline: 2px solid #d946ef;
          outline-offset: 2px;
        }

        /* Ensure sidebar takes full height */
        .h-screen {
          height: 100vh;
          height: 100dvh; /* Dynamic viewport height for mobile */
        }

        /* Mobile slide animation */
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutToLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        /* Enhanced mobile responsiveness */
        @media (max-width: 1024px) {
          .sidebar-mobile {
            width: 280px;
          }
        }

        @media (max-width: 640px) {
          .sidebar-mobile {
            width: 100vw;
            max-width: 320px;
          }
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          button {
            min-height: 48px;
          }
        }

        /* Prevent sidebar from scrolling */
        .sidebar-container {
          height: 100vh;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
