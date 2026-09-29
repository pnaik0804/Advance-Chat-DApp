import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import Layout from "../components/Layout/Layout";
import Dashboard from "../components/Dashboard/Dashboard";
import Chat from "../components/Chat/Chat";
import FriendsList from "../components/Friends/FriendsList";
import TransferHistory from "../components/Transfers/TransferHistory";
import Profile from "../components/Profile/Profile";
import Settings from "../components/Settings/Settings";
import CreateAccount from "../components/Auth/CreateAccount";
import { ChatAppABI, CONTRACT_ADDRESS } from "../contracts/ChatApp";
import CustomConnectButton from "../components/Layout/CustomConnectButton";
import {
  FiWifi,
  FiShield,
  FiZap,
  FiUsers,
  FiMessageCircle,
  FiArrowRight,
} from "react-icons/fi";
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user exists
  const { data: userExistsData, refetch: refetchUserExists } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ChatAppABI,
    functionName: "checkUserExists",
    args: address ? [address] : undefined,
    account: address,
    query: {
      enabled: !!address, // 👈 IMPORTANT
    },
  });

  useEffect(() => {
    if (isConnected && address) {
      if (userExistsData !== undefined) {
        setUserExists(userExistsData);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [userExistsData, isConnected, address]);

  const handleAccountCreated = () => {
    refetchUserExists();
  };

  // Welcome screen for non-connected users
  if (!isConnected) {
    return (
      <div className={` min-h-screen bg-[#0E0B12] relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className={` absolute inset-0 overflow-hidden pointer-events-none`}>
          {/* Large gradient orbs */}
          <div className={` absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse`}></div>
          <div className={` absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000`}></div>
          <div className={` absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-500`}></div>

          {/* Grid pattern */}
          <div className={` absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.03)_1px,transparent_1px)] bg-[size:50px_50px]`}></div>

          {/* Floating particles */}
          <div className={` absolute top-20 left-20 w-3 h-3 bg-fuchsia-400/60 rounded-full animate-ping`}></div>
          <div className={` absolute top-40 right-32 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse delay-700`}></div>
          <div className={` absolute bottom-32 left-32 w-4 h-4 bg-fuchsia-300/40 rounded-full animate-pulse delay-300`}></div>
          <div className={` absolute bottom-20 right-20 w-2 h-2 bg-purple-300/40 rounded-full animate-ping delay-1200`}></div>
        </div>

        {/* Main content */}
        <div className={` relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8`}>
          <div className={` text-center max-w-4xl mx-auto`}>
            {/* Logo/Icon */}
            <div className={` w-24 h-24 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-fuchsia-500/30 shadow-2xl shadow-purple-600/20 relative overflow-hidden`}>
              <div className={` w-20 h-20 bg-gradient-to-r from-fuchsia-500/30 to-purple-600/30 rounded-xl flex items-center justify-center backdrop-blur-sm`}>
                <FiMessageCircle className={` text-fuchsia-300`} size={40} />
              </div>
              <div className={` absolute inset-0 rounded-2xl bg-gradient-to-r from-fuchsia-500/40 to-purple-600/40 animate-spin opacity-20`}></div>
            </div>

            {/* Main heading */}
            <h1 className={` text-5xl sm:text-6xl lg:text-7xl font-bold mb-6`}>
              <span className={` bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient`}>
                Welcome to ChatDapp
              </span>
            </h1>

            {/* Subtitle */}
            <p className={` text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed`}>
              The future of decentralized communication. Connect your wallet to
              start chatting securely on the blockchain.
            </p>

            {/* Features grid */}
            <div className={` grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto`}>
              <div className={` bg-gradient-to-br from-[#0E0B12]/80 to-[#0E0B12]/60 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 p-6 shadow-xl shadow-purple-600/10`}>
                <div className={` w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-green-500/30`}>
                  <FiShield className={` text-green-400`} size={24} />
                </div>
                <h3 className={` text-white font-semibold mb-2`}>Secure</h3>
                <p className={` text-gray-400 text-sm`}>
                  End-to-end encrypted messaging on blockchain
                </p>
              </div>

              <div className={` bg-gradient-to-br from-[#0E0B12]/80 to-[#0E0B12]/60 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 p-6 shadow-xl shadow-purple-600/10`}>
                <div className={` w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30`}>
                  <FiZap className={` text-blue-400`} size={24} />
                </div>
                <h3 className={` text-white font-semibold mb-2`}>Fast</h3>
                <p className={` text-gray-400 text-sm`}>
                  Lightning-fast transactions and messaging
                </p>
              </div>

              <div className={` bg-gradient-to-br from-[#0E0B12]/80 to-[#0E0B12]/60 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 p-6 shadow-xl shadow-purple-600/10`}>
                <div className={` w-12 h-12 bg-gradient-to-r from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30`}>
                  <FiUsers className={` text-purple-400`} size={24} />
                </div>
                <h3 className={` text-white font-semibold mb-2`}>Social</h3>
                <p className={` text-gray-400 text-sm`}>
                  Connect with friends and build your network
                </p>
              </div>
            </div>

            {/* Connect wallet section */}
            <div className={` bg-gradient-to-br from-[#0E0B12]/90 to-[#0E0B12]/70 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 shadow-2xl shadow-purple-600/10 p-8 sm:p-12 max-w-md mx-auto relative overflow-hidden`}>
              {/* Background pattern */}
              <div className={` absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 to-purple-600/5`}></div>

              <div className={` relative z-10`}>
                <div className={` w-16 h-16 bg-gradient-to-r from-fuchsia-500/30 to-purple-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-fuchsia-500/40`}>
                  <FiWifi className={` text-fuchsia-300`} size={28} />
                </div>

                <h3 className={` text-2xl font-bold text-white mb-4`}>
                  Ready to Connect?
                </h3>
                <p className={` text-gray-300 mb-8`}>
                  Please connect your wallet to continue to ChatDapp
                </p>

                {/* Enhanced ConnectButton wrapper */}
                <div className={` space-y-4`}>
                  <div
                    className={` 
                    [&>div]:w-full
                    [&>div>button]:w-full
                    [&>div>button]:bg-gradient-to-r 
                    [&>div>button]:from-fuchsia-500 
                    [&>div>button]:to-purple-600 
                    [&>div>button]:hover:from-fuchsia-600 
                    [&>div>button]:hover:to-purple-700 
                    [&>div>button]:text-white
                    [&>div>button]:border-0
                    [&>div>button]:rounded-xl
                    [&>div>button]:py-4
                    [&>div>button]:px-8
                    [&>div>button]:text-lg
                    [&>div>button]:font-semibold
                    [&>div>button]:shadow-2xl
                    [&>div>button]:shadow-fuchsia-500/40
                    [&>div>button]:transition-all
                    [&>div>button]:duration-300
                    [&>div>button]:hover:scale-105
                    [&>div>button]:hover:shadow-purple-500/50
                    [&>div>button]:flex
                    [&>div>button]:items-center
                    [&>div>button]:justify-center
                    [&>div>button]:space-x-2
                  `}
                  >
                    <CustomConnectButton />
                  </div>

                  {/* Additional info */}
                  <div className={` flex items-center justify-center space-x-2 text-sm text-gray-400`}>
                    <FiShield size={14} />
                    <span>Secure wallet connection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating action elements */}
        <div className={` absolute bottom-8 left-8 flex space-x-2`}>
          <div className={` w-3 h-3 bg-fuchsia-400/60 rounded-full animate-pulse`}></div>
          <div className={` w-3 h-3 bg-purple-400/60 rounded-full animate-pulse delay-200`}></div>
          <div className={` w-3 h-3 bg-fuchsia-400/60 rounded-full animate-pulse delay-400`}></div>
        </div>

        {/* Custom styles for welcome screen */}
        <style jsx>{`
          @keyframes gradient-shift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient-shift 4s ease infinite;
          }
        `}</style>
      </div>
    );
  }

  // Loading screen
  if (loading) {
    return (
      <div className={` min-h-screen bg-[#0E0B12] flex items-center justify-center relative overflow-hidden`}>
        {/* Background elements */}
        <div className={` absolute inset-0 overflow-hidden pointer-events-none`}>
          <div className={` absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse`}></div>
          <div className={` absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000`}></div>
          <div className={` absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.02)_1px,transparent_1px)] bg-[size:50px_50px]`}></div>
        </div>

        {/* Loading content */}
        <div className={` relative z-10 text-center`}>
          <div className={` relative mb-8`}>
            {/* Outer spinning ring */}
            <div className={` animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 p-1`}>
              <div className={` rounded-full h-full w-full bg-[#0E0B12]`}></div>
            </div>

            {/* Inner pulsing dot */}
            <div className={` absolute inset-0 flex items-center justify-center`}>
              <div className={` w-16 h-16 bg-gradient-to-r from-fuchsia-500/50 to-purple-600/50 rounded-full animate-pulse`}></div>
            </div>

            {/* Center logo */}
            <div className={` absolute inset-0 flex items-center justify-center`}>
              <div className={` w-8 h-8 bg-gradient-to-r from-fuchsia-400 to-purple-400 rounded-full flex items-center justify-center`}>
                <FiMessageCircle className={` text-white`} size={16} />
              </div>
            </div>
          </div>

          <h2 className={` text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent mb-4`}>
            Loading ChatDapp
          </h2>
          <p className={` text-gray-400`}>Connecting to the blockchain...</p>

          {/* Loading dots */}
          <div className={` flex space-x-2 justify-center mt-6`}>
            <div className={` w-2 h-2 bg-fuchsia-400/60 rounded-full animate-pulse`}></div>
            <div className={` w-2 h-2 bg-purple-400/60 rounded-full animate-pulse delay-200`}></div>
            <div className={` w-2 h-2 bg-fuchsia-400/60 rounded-full animate-pulse delay-400`}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show CreateAccount if user doesn't exist
  if (!userExists) {
    return <CreateAccount onAccountCreated={handleAccountCreated} />;
  }

  // Main app content renderer
  const renderContent = (activeTab) => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "chat":
        return <Chat />;
      case "friends":
        return <FriendsList onStartChat={() => {}} hideSection={true} />;
      case "transfers":
        return <TransferHistory />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Main app layout
  return <Layout renderContent={renderContent} />;
}
