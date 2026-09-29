import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiMessageCircle,
  FiDollarSign,
} from "react-icons/fi";

const StatsCard = ({ title, value, icon: Icon, change, changeType }) => {
  // Get color scheme based on icon type
  const getColorScheme = () => {
    switch (Icon) {
      case FiUsers:
        return {
          gradient: "from-blue-500/20 to-cyan-600/20",
          border: "border-blue-500/30",
          iconBg: "from-blue-500/30 to-cyan-600/30",
          iconColor: "text-blue-400",
          glow: "shadow-blue-500/20",
        };
      case FiMessageCircle:
        return {
          gradient: "from-fuchsia-500/20 to-pink-600/20",
          border: "border-fuchsia-500/30",
          iconBg: "from-fuchsia-500/30 to-pink-600/30",
          iconColor: "text-fuchsia-400",
          glow: "shadow-fuchsia-500/20",
        };
      case FiDollarSign:
        return {
          gradient: "from-green-500/20 to-emerald-600/20",
          border: "border-green-500/30",
          iconBg: "from-green-500/30 to-emerald-600/30",
          iconColor: "text-green-400",
          glow: "shadow-green-500/20",
        };
      case FiTrendingUp:
        return {
          gradient: "from-purple-500/20 to-violet-600/20",
          border: "border-purple-500/30",
          iconBg: "from-purple-500/30 to-violet-600/30",
          iconColor: "text-purple-400",
          glow: "shadow-purple-500/20",
        };
      default:
        return {
          gradient: "from-fuchsia-500/20 to-purple-600/20",
          border: "border-fuchsia-500/30",
          iconBg: "from-fuchsia-500/30 to-purple-600/30",
          iconColor: "text-fuchsia-400",
          glow: "shadow-fuchsia-500/20",
        };
    }
  };

  const colorScheme = getColorScheme();
  const TrendIcon = changeType === "positive" ? FiTrendingUp : FiTrendingDown;

  return (
    <div className="group relative">
      {/* Background card with glass morphism */}
      <div
        className={`
        relative bg-gradient-to-br from-[#0E0B12]/80 to-[#0E0B12]/60 
        backdrop-blur-xl rounded-2xl border ${colorScheme.border} 
        shadow-2xl ${colorScheme.glow} p-6 
        transition-all duration-500 
        hover:scale-105 hover:border-opacity-50 
        overflow-hidden
      `}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} opacity-50`}
          ></div>

          {/* Floating particles */}
          <div
            className={`absolute top-4 right-4 w-2 h-2 ${colorScheme.iconColor} rounded-full opacity-40 animate-pulse`}
          ></div>
          <div
            className={`absolute bottom-6 left-6 w-1 h-1 ${colorScheme.iconColor} rounded-full opacity-30 animate-ping delay-1000`}
          ></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            {/* Left side - Stats */}
            <div className="flex-1">
              {/* Title */}
              <p className="text-sm font-medium text-gray-300 mb-2 opacity-80">
                {title}
              </p>

              {/* Value with enhanced styling */}
              <div className="mb-4">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1 tracking-tight">
                  {value}
                </p>

                {/* Animated underline */}
                <div
                  className={`h-0.5 bg-gradient-to-r ${colorScheme.iconBg} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
              </div>

              {/* Change indicator */}
              {change && (
                <div
                  className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded-lg 
                  ${
                    changeType === "positive"
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  } 
                  backdrop-blur-sm
                `}
                >
                  <TrendIcon
                    className={`
                      ${
                        changeType === "positive"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                      transition-transform duration-300 group-hover:scale-110
                    `}
                    size={12}
                  />
                  <p
                    className={`
                    text-xs font-medium 
                    ${
                      changeType === "positive"
                        ? "text-green-300"
                        : "text-red-300"
                    }
                  `}
                  >
                    {change}
                  </p>
                </div>
              )}
            </div>

            {/* Right side - Icon */}
            <div className="relative">
              {/* Icon container with enhanced styling */}
              <div
                className={`
                relative w-16 h-16 bg-gradient-to-br ${colorScheme.iconBg} 
                rounded-2xl flex items-center justify-center 
                border ${colorScheme.border} shadow-lg ${colorScheme.glow}
                transition-all duration-500 
                group-hover:scale-110 group-hover:rotate-3
                overflow-hidden
              `}
              >
                {/* Icon glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colorScheme.iconBg} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                ></div>

                {/* Icon */}
                <Icon
                  className={`${colorScheme.iconColor} relative z-10 transition-all duration-300 group-hover:scale-110`}
                  size={28}
                />

                {/* Rotating border animation */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colorScheme.iconBg} opacity-20 animate-spin-slow`}
                ></div>
              </div>

              {/* Floating indicator */}
              <div
                className={`
                absolute -top-1 -right-1 w-4 h-4 
                bg-gradient-to-r ${colorScheme.iconBg} 
                rounded-full border-2 border-[#0E0B12] 
                animate-pulse
              `}
              >
                <div
                  className={`absolute inset-0.5 bg-gradient-to-r ${colorScheme.iconBg} rounded-full animate-ping`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <div
          className={`
          absolute inset-0 rounded-2xl 
          bg-gradient-to-br ${colorScheme.gradient} 
          opacity-0 group-hover:opacity-20 
          transition-opacity duration-500 
          pointer-events-none
        `}
        ></div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        /* Slow rotation animation */
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        /* Value counting animation */
        @keyframes count-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-count-up {
          animation: count-up 0.8s ease-out;
        }

        /* Enhanced hover effects */
        @keyframes glow-pulse {
          0%,
          100% {
            box-shadow: 0 10px 40px -10px rgba(217, 70, 239, 0.2);
          }
          50% {
            box-shadow: 0 15px 60px -10px rgba(217, 70, 239, 0.4);
          }
        }

        .group:hover .relative {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .responsive-icon {
            width: 3rem;
            height: 3rem;
          }

          .responsive-text {
            font-size: 1.5rem;
          }
        }

        /* Focus accessibility */
        .group:focus-within {
          outline: 2px solid rgba(217, 70, 239, 0.6);
          outline-offset: 2px;
        }

        /* Smooth transitions for all properties */
        * {
          transition-property: transform, opacity, border-color,
            background-color, box-shadow, scale;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default StatsCard;
