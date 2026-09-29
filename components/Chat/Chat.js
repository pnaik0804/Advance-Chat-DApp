import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import FriendsList from "../Friends/FriendsList";
import ChatInterface from "./ChatInterface";
import { ChatAppABI, CONTRACT_ADDRESS } from "../../contracts/ChatApp";

const Chat = () => {
  const { address } = useAccount();
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleStartChat = (friend) => {
    setSelectedFriend(friend);
  };

  const handleBackToFriends = () => {
    setSelectedFriend(null);
  };

  return (
    <div className="h-full relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-600/10 to-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-fuchsia-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-32 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-32 w-3 h-3 bg-fuchsia-300/30 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-purple-300/30 rounded-full animate-ping delay-1200"></div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative z-10 h-full">
        <div className="h-full transition-all duration-500 ease-in-out">
          {selectedFriend ? (
            <div className="h-full animate-slide-in-right">
              <ChatInterface
                selectedFriend={selectedFriend}
                onBack={handleBackToFriends}
              />
            </div>
          ) : (
            <div className="h-full animate-slide-in-left">
              <FriendsList onStartChat={handleStartChat} />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Fixed Proportions */}
      <div className="hidden lg:block relative z-10 h-full">
        <div className="flex h-full gap-6 p-4">
          {/* Friends List Panel - Fixed Width */}
          <div className="w-80 xl:w-96 flex-shrink-0 relative">
            {/* Panel background with glass effect */}
            <div className="absolute inset-0 bg-[#0E0B12]/40 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 shadow-2xl shadow-purple-600/10"></div>

            {/* Panel content */}
            <div className="relative z-10 h-full rounded-2xl overflow-hidden">
              <FriendsList onStartChat={handleStartChat} hideSection={false} />
            </div>

            {/* Panel decorative elements */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-fuchsia-400/30 rounded-full animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400/30 rounded-full animate-ping pointer-events-none"></div>
          </div>

          {/* Chat Interface Panel - Takes Remaining Width */}
          <div className="flex-1 relative min-w-0">
            {/* Panel background with glass effect */}
            <div className="absolute inset-0 bg-[#0E0B12]/40 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 shadow-2xl shadow-purple-600/10"></div>

            {/* Panel content */}
            <div className="relative z-10 h-full rounded-2xl overflow-hidden">
              <ChatInterface selectedFriend={selectedFriend} />
            </div>

            {/* Panel decorative elements */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse delay-500 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-fuchsia-400/30 rounded-full animate-ping delay-800 pointer-events-none"></div>

            {/* Connection indicator between panels */}
            {selectedFriend && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 w-6 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Desktop connection visualization */}
        {selectedFriend && (
          <div className="absolute top-1/2 left-80 xl:left-96 transform -translate-y-1/2 translate-x-2 pointer-events-none">
            <div className="w-1 h-1 bg-fuchsia-400/60 rounded-full animate-ping"></div>
            <div className="absolute inset-0 w-3 h-3 bg-fuchsia-500/20 rounded-full animate-pulse -translate-x-1 -translate-y-1"></div>
          </div>
        )}
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        /* Mobile slide animations */
        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.4s ease-out;
        }

        /* Panel hover effects for desktop */
        @media (min-width: 1024px) {
          .flex > div {
            transition: all 0.3s ease;
          }

          .flex > div:hover {
            transform: translateY(-2px);
          }

          .flex > div:hover .absolute.inset-0 {
            border-color: rgba(217, 70, 239, 0.4);
            box-shadow: 0 25px 50px -12px rgba(147, 51, 234, 0.25);
          }
        }

        /* Floating animation variations */
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(2deg);
          }
          50% {
            transform: translateY(0px) rotate(0deg);
          }
          75% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-8px) rotate(-2deg);
          }
          66% {
            transform: translateY(-3px) rotate(1deg);
          }
        }

        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
        }

        /* Glow pulse variations */
        @keyframes glow-pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        /* Enhanced backdrop blur support */
        @supports (backdrop-filter: blur(12px)) {
          .enhanced-glass {
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
          }
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition-property: transform, opacity, border-color,
            background-color, box-shadow;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Optimized animations for performance */
        .animate-pulse,
        .animate-ping,
        .animate-spin {
          will-change: transform, opacity;
        }

        /* Custom focus states */
        *:focus {
          outline: 2px solid rgba(217, 70, 239, 0.6);
          outline-offset: 2px;
        }

        /* Enhanced selection styles */
        ::selection {
          background-color: rgba(217, 70, 239, 0.3);
          color: white;
        }

        ::-moz-selection {
          background-color: rgba(217, 70, 239, 0.3);
          color: white;
        }

        /* Ensure proper width distribution */
        .flex-1 {
          min-width: 0; /* Prevents flex item from overflowing */
        }

        /* Responsive adjustments */
        @media (min-width: 1280px) {
          .w-80 {
            width: 24rem; /* 384px */
          }
        }

        @media (min-width: 1536px) {
          .xl\\:w-96 {
            width: 28rem; /* 448px */
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;
