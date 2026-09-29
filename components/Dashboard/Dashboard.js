import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import StatsCard from "./StatsCard";
import {
  FiUsers,
  FiMessageCircle,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiActivity,
  FiSend,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";
import { ChatAppABI, CONTRACT_ADDRESS } from "../../contracts/ChatApp";
import { ethers } from "ethers";

const Dashboard = () => {
  const { address } = useAccount();
  const [stats, setStats] = useState({
    totalFriends: 0,
    totalMessages: 0,
    totalEthReceived: "0",
    totalUsers: 0,
  });

  // Get friends list
  const { data: friendsList } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ChatAppABI,
    functionName: "getMyFriendList",
    enabled: !!address,
  });

  // Get all users
  const { data: allUsers } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ChatAppABI,
    functionName: "getAllAppUser",
  });

  useEffect(() => {
    if (friendsList) {
      setStats((prev) => ({
        ...prev,
        totalFriends: friendsList.length,
      }));
    }
  }, [friendsList]);

  useEffect(() => {
    if (allUsers) {
      setStats((prev) => ({
        ...prev,
        totalUsers: allUsers.length,
      }));
    }
  }, [allUsers]);

  // Mock activity data for demo
  const recentActivities = [
    {
      id: 1,
      type: "message",
      user: "Alice Johnson",
      action: "sent you a message",
      time: "2 minutes ago",
      icon: FiMessageCircle,
      color: "blue",
    },
    {
      id: 2,
      type: "transfer",
      user: "Bob Smith",
      action: "sent you 0.5 ETH",
      time: "15 minutes ago",
      icon: FiArrowDownRight,
      color: "green",
    },
    {
      id: 3,
      type: "friend",
      user: "Carol Davis",
      action: "accepted your friend request",
      time: "1 hour ago",
      icon: FiUsers,
      color: "purple",
    },
    {
      id: 4,
      type: "message",
      user: "David Wilson",
      action: "shared a file with you",
      time: "2 hours ago",
      icon: FiSend,
      color: "fuchsia",
    },
  ];

  const getActivityColors = (color) => {
    const colors = {
      blue: "from-blue-500/20 to-cyan-600/20 border-blue-500/30 text-blue-400",
      green:
        "from-green-500/20 to-emerald-600/20 border-green-500/30 text-green-400",
      purple:
        "from-purple-500/20 to-violet-600/20 border-purple-500/30 text-purple-400",
      fuchsia:
        "from-fuchsia-500/20 to-pink-600/20 border-fuchsia-500/30 text-fuchsia-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-fuchsia-500/5 to-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-600/5 to-fuchsia-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-fuchsia-400/30 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-32 w-1 h-1 bg-purple-400/30 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-32 w-3 h-3 bg-fuchsia-300/20 rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10">
        <div className="bg-gradient-to-r from-[#0E0B12]/60 to-[#0E0B12]/40 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 p-6 sm:p-8 shadow-2xl shadow-purple-600/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                Blockchain Chat DApp
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                Welcome back! Here's what's happening with your chats.
              </p>
              <div className="w-24 h-0.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 mt-4 rounded-full"></div>
            </div>

            {/* Live activity indicator */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">Live</span>
              </div>
              <div className="text-gray-400 text-sm">
                <FiClock className="inline mr-1" size={14} />
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Friends"
          value={stats.totalFriends}
          icon={FiUsers}
          change="+2 this week"
          changeType="positive"
        />
        <StatsCard
          title="Messages Sent"
          value={stats.totalMessages}
          icon={FiMessageCircle}
          change="+15 today"
          changeType="positive"
        />
        <StatsCard
          title="ETH Received"
          value={`${parseFloat(
            ethers.formatEther(stats.totalEthReceived || "0")
          ).toFixed(4)} ETH`}
          icon={FiDollarSign}
          change="+0.5 ETH"
          changeType="positive"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiTrendingUp}
          change="+5 new users"
          changeType="positive"
        />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-[#0E0B12]/80 to-[#0E0B12]/60 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 shadow-2xl shadow-purple-600/10 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/5 to-purple-600/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-fuchsia-500/30">
                    <FiActivity className="text-fuchsia-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Recent Activity
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Latest interactions and updates
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-fuchsia-400/60 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-pulse delay-200"></div>
                  <div className="w-2 h-2 bg-fuchsia-400/60 rounded-full animate-pulse delay-400"></div>
                </div>
              </div>
            </div>

            {/* Activity List */}
            <div className="p-6 space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-[#0E0B12]/40 to-[#0E0B12]/20 backdrop-blur-sm rounded-xl border border-white/5 hover:border-fuchsia-500/20 transition-all duration-300 hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${getActivityColors(
                        activity.color
                      )} rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">
                        <span className="text-fuchsia-300">
                          {activity.user}
                        </span>{" "}
                        {activity.action}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <FiClock className="text-gray-500" size={12} />
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FiArrowUpRight className="text-fuchsia-400" size={16} />
                    </div>
                  </div>
                );
              })}

              {/* View all button */}
              <div className="pt-4 border-t border-white/5">
                <button className="w-full py-3 text-fuchsia-400 hover:text-fuchsia-300 font-medium transition-colors duration-300 flex items-center justify-center space-x-2 hover:bg-fuchsia-500/5 rounded-xl">
                  <span>View All Activity</span>
                  <FiArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-[#0E0B12]/80 to-[#0E0B12]/60 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 shadow-2xl shadow-purple-600/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center mr-3 border border-green-500/30">
                <FiTrendingUp className="text-green-400" size={16} />
              </div>
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Active Chats</span>
                <span className="text-fuchsia-300 font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Unread Messages</span>
                <span className="text-purple-300 font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Online Friends</span>
                <span className="text-green-300 font-semibold">8</span>
              </div>
            </div>
          </div>

          {/* Network Status */}
          <div className="bg-gradient-to-br from-[#0E0B12]/80 to-[#0E0B12]/60 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 shadow-2xl shadow-purple-600/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center mr-3 border border-blue-500/30">
                <FiActivity className="text-blue-400" size={16} />
              </div>
              Network Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Connection</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-semibold">Stable</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Gas Price</span>
                <span className="text-yellow-300 font-semibold">12 gwei</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Block Height</span>
                <span className="text-blue-300 font-semibold">18,550,123</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        /* Staggered animation for activity items */
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .group {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        /* Enhanced hover effects */
        @keyframes glow-pulse {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(217, 70, 239, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(217, 70, 239, 0.2);
          }
        }

        .hover-glow:hover {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        /* Responsive text sizing */
        @media (max-width: 640px) {
          .responsive-title {
            font-size: 2rem;
          }
        }

        /* Enhanced gradient animations */
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

        /* Custom scrollbar for activity panel */
        .activity-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .activity-scroll::-webkit-scrollbar-track {
          background: rgba(14, 11, 18, 0.3);
        }

        .activity-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #d946ef, #9333ea);
          border-radius: 3px;
        }

        /* Focus enhancements */
        button:focus {
          outline: 2px solid rgba(217, 70, 239, 0.6);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
