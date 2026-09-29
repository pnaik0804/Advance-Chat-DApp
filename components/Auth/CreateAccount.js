import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "react-hot-toast";
import { ChatAppABI, CONTRACT_ADDRESS } from "../../contracts/ChatApp";
import {
  FiUser,
  FiLoader,
  FiArrowRight,
  FiShield,
  FiZap,
} from "react-icons/fi";

const CreateAccount = ({ onAccountCreated }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Account created successfully!");
      onAccountCreated();
      setIsLoading(false);
    }
  }, [isConfirmed, onAccountCreated]);

  // Handle transaction error
  useEffect(() => {
    if (error) {
      toast.error("Failed to create account");
      console.error(error);
      setIsLoading(false);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter a valid username");
      return;
    }

    try {
      setIsLoading(true);
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ChatAppABI,
        functionName: "createAccount",
        args: [username],
      });
    } catch (error) {
      toast.error("Failed to create account");
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0B12] relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-fuchsia-400/60 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-fuchsia-300/40 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-purple-300/40 rounded-full animate-ping delay-1200"></div>
      </div>

      {/* Main card container */}
      <div className="relative z-10 max-w-md w-full">
        {/* Card with enhanced glass morphism */}
        <div className="relative bg-[#0E0B12]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-fuchsia-500/20 overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 p-px rounded-2xl">
            <div className="h-full w-full rounded-2xl bg-[#0E0B12]/90 backdrop-blur-xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-10">
            {/* Header section with enhanced styling */}
            <div className="text-center mb-8">
              {/* Icon container with gradient and animation */}
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-full flex items-center justify-center mb-6 border border-fuchsia-500/30 shadow-lg shadow-purple-600/20 relative overflow-hidden">
                {/* Inner gradient circle */}
                <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-500/30 to-purple-600/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FiUser className="text-fuchsia-300" size={28} />
                </div>

                {/* Rotating border animation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500/40 to-purple-600/40 animate-spin opacity-20"></div>
              </div>

              {/* Title with gradient text */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Create Your Account
              </h2>

              {/* Subtitle */}
              <p className="text-gray-300 text-lg">
                Join ChatDapp and start connecting with friends
              </p>

              {/* Decorative line */}
              <div className="w-24 h-0.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Features highlight */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="w-10 h-10 bg-fuchsia-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-fuchsia-500/20">
                  <FiShield className="text-fuchsia-400" size={16} />
                </div>
                <span className="text-xs text-gray-400">Secure</span>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-purple-500/20">
                  <FiZap className="text-purple-400" size={16} />
                </div>
                <span className="text-xs text-gray-400">Fast</span>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-fuchsia-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-fuchsia-500/20">
                  <FiUser className="text-fuchsia-400" size={16} />
                </div>
                <span className="text-xs text-gray-400">Private</span>
              </div>
            </div>

            {/* Form with enhanced styling */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-fuchsia-300 mb-3"
                >
                  Username
                </label>

                {/* Input container with gradient border */}
                <div className="relative group">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="
                      w-full px-4 py-4 
                      bg-[#0E0B12]/60 backdrop-blur-sm
                      border border-fuchsia-500/20 
                      rounded-xl 
                      text-white placeholder-gray-400
                      focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-[#0E0B12]/80
                      hover:border-fuchsia-500/30 hover:bg-[#0E0B12]/70
                      transition-all duration-300
                      shadow-lg shadow-purple-600/5
                    "
                    placeholder="Enter your username"
                    required
                  />

                  {/* Focus glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Character count indicator */}
                <div className="mt-2 text-right">
                  <span
                    className={`text-xs ${
                      username.length > 20 ? "text-red-400" : "text-gray-500"
                    }`}
                  >
                    {username.length}/30
                  </span>
                </div>
              </div>

              {/* Enhanced submit button */}
              <button
                type="submit"
                disabled={
                  isLoading || isPending || isConfirming || !username.trim()
                }
                className="
                  group relative w-full 
                  bg-gradient-to-r from-fuchsia-500 to-purple-600 
                  hover:from-fuchsia-600 hover:to-purple-700 
                  disabled:from-gray-600 disabled:to-gray-700
                  text-white font-semibold
                  py-4 px-6 rounded-xl 
                  transition-all duration-300
                  shadow-lg shadow-purple-600/30
                  hover:shadow-xl hover:shadow-fuchsia-500/40
                  disabled:shadow-none
                  hover:scale-105 active:scale-95
                  disabled:scale-100 disabled:cursor-not-allowed
                  overflow-hidden
                "
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Button content */}
                <div className="relative z-10 flex items-center justify-center">
                  {isLoading || isPending || isConfirming ? (
                    <>
                      <div className="relative">
                        <FiLoader className="animate-spin mr-3" size={20} />
                        {/* Spinning glow effect */}
                        <div className="absolute inset-0 bg-fuchsia-400/30 rounded-full blur-sm animate-spin"></div>
                      </div>
                      <span>
                        {isPending
                          ? "Confirming Transaction..."
                          : isConfirming
                          ? "Processing on Blockchain..."
                          : "Creating Account..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <FiArrowRight
                        className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        size={20}
                      />
                    </>
                  )}
                </div>

                {/* Progress indicator */}
                {(isLoading || isPending || isConfirming) && (
                  <div className="absolute bottom-0 left-0 h-1 bg-fuchsia-400/50 animate-pulse"></div>
                )}
              </button>
            </form>

            {/* Transaction status indicator */}
            {hash && (
              <div className="mt-6 p-4 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-fuchsia-300">
                    Transaction submitted
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse delay-400"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
