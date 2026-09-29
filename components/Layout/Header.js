import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { FiBell, FiSearch, FiMenu } from "react-icons/fi";
import CustomConnectButton from "./CustomConnectButton";

const Header = ({ onMenuClick, isMobileMenuOpen }) => {
  const { address, isConnected } = useAccount();

  return (
    <header className="relative bg-[#0E0B12]/95 backdrop-blur-xl border-b border-fuchsia-500/20 px-4 sm:px-6 lg:px-8 py-4 shadow-2xl shadow-purple-600/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient line at top */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent"></div>

        {/* Floating orbs */}
        <div className="absolute top-2 left-1/4 w-3 h-3 bg-fuchsia-400/30 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-1 right-1/3 w-2 h-2 bg-purple-400/30 rounded-full blur-sm animate-ping delay-1000"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Section - Mobile Menu + Search */}
        <div className="flex items-center space-x-4 flex-1 max-w-2xl">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="
              lg:hidden p-3 
              bg-[#0E0B12]/60 backdrop-blur-sm
              border border-fuchsia-500/20 
              text-gray-300 hover:text-white 
              hover:bg-gradient-to-r hover:from-fuchsia-500/10 hover:to-purple-600/10
              hover:border-fuchsia-500/40
              rounded-xl 
              transition-all duration-300
              shadow-lg shadow-purple-600/10
              hover:shadow-xl hover:shadow-fuchsia-500/20
              hover:scale-105 active:scale-95
            "
          >
            <FiMenu
              size={18}
              className={`transition-transform duration-300 ${
                isMobileMenuOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Enhanced Search Bar */}
          <div className="relative group flex-1 max-w-md">
            {/* Search icon with gradient background */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 group-focus-within:from-fuchsia-500/30 group-focus-within:to-purple-600/30 transition-all duration-300">
                <FiSearch
                  className="text-fuchsia-300 group-focus-within:text-fuchsia-200 transition-colors duration-300"
                  size={16}
                />
              </div>
            </div>

            {/* Input field with futuristic styling */}
            <input
              type="text"
              placeholder="Search messages, friends..."
              className="
                w-full pl-14 pr-6 py-3.5 
                bg-[#0E0B12]/60 backdrop-blur-sm
                border border-fuchsia-500/20 
                rounded-xl 
                text-white placeholder-gray-400
                focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-[#0E0B12]/80
                hover:border-fuchsia-500/30 hover:bg-[#0E0B12]/70
                transition-all duration-300
                shadow-lg shadow-purple-600/5
              "
            />

            {/* Glow effect on focus */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Search suggestions indicator (optional) */}
          <div className="hidden sm:flex items-center space-x-1">
            <div className="w-1 h-1 bg-fuchsia-400/50 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-purple-400/50 rounded-full animate-pulse delay-200"></div>
            <div className="w-1 h-1 bg-fuchsia-400/50 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Enhanced Notification Button */}
          <div className="relative group">
            <button
              className="
              relative p-3 
              bg-[#0E0B12]/60 backdrop-blur-sm
              border border-fuchsia-500/20 
              text-gray-300 hover:text-white 
              hover:bg-gradient-to-r hover:from-fuchsia-500/10 hover:to-purple-600/10
              hover:border-fuchsia-500/40
              rounded-xl 
              transition-all duration-300
              shadow-lg shadow-purple-600/10
              hover:shadow-xl hover:shadow-fuchsia-500/20
              hover:scale-105 active:scale-95
            "
            >
              <FiBell
                size={18}
                className="transition-transform duration-300 group-hover:animate-pulse"
              />

              {/* Enhanced notification badge */}
              <div className="absolute -top-1 -right-1 flex items-center justify-center">
                <span className="relative h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse">
                  <span className="absolute inset-0.5 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></span>
                  <span className="absolute inset-1 bg-white rounded-full"></span>
                </span>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Enhanced Connect Button Wrapper */}
          <div className="relative group">
            {/* Custom wrapper for ConnectButton styling */}
            <div
              className="
              [&>div]:bg-gradient-to-r 
              [&>div]:from-fuchsia-500 
              [&>div]:to-purple-600 
              [&>div]:hover:from-fuchsia-600 
              [&>div]:hover:to-purple-700 
              [&>div]:text-white
              [&>div]:border-0
              [&>div]:rounded-xl
              [&>div]:shadow-lg
              [&>div]:shadow-purple-600/30
              [&>div]:backdrop-blur-sm
              [&>div]:transition-all
              [&>div]:duration-300
              [&>div]:hover:scale-105
              [&>div]:active:scale-95
              [&>div]:px-4
              [&>div]:sm:[&>div]:px-6
              [&>div]:py-3
              [&>div]:font-semibold
              [&>div]:text-sm
              [&>div]:sm:[&>div]:text-base
            "
            >
              <CustomConnectButton />
            </div>

            {/* Connection status indicator */}
            {isConnected && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-500/50 border-2 border-[#0E0B12]">
                <div className="absolute inset-0.5 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-600/30 to-transparent"></div>
    </header>
  );
};

export default Header;
