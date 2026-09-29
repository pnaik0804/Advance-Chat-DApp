import { detectNSFW } from "../../utils/nsfwDetector";
import toast from "react-hot-toast";
import { checkVideo } from "../../utils/videoModeration";

import { useState, useEffect, useRef } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ethers } from "ethers";
import {
  FiSend,
  FiPaperclip,
  FiDollarSign,
  FiX,
  FiMoreVertical,
  FiDownload,
  FiPlay,
  FiPause,
} from "react-icons/fi";
import { BiTransfer } from "react-icons/bi";
import { ChatAppABI, CONTRACT_ADDRESS } from "../../contracts/ChatApp";
import { MESSAGE_TYPES } from "../../utils/constants";
import { uploadToPinata, getIPFSUrl } from "../../utils/pinata";
import { formatTokenAmount } from "../../utils/tokenUtils";
import TokenTransferModal from "./TokenTransferModal";
import Avatar from "../Common/Avatar";

const ChatInterface = ({ selectedFriend, onBack }) => {
  const { address } = useAccount();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferMessage, setTransferMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Get messages
  const { data: messagesData, refetch: refetchMessages } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ChatAppABI,
    functionName: "readMessage",
    args: [selectedFriend?.pubkey],
    account: address,
  });

  // Contract write hooks
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
      query: {
        enabled: !!hash,
      },
    });

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Message sent!");
      setMessage("");
      setTransferAmount("");
      setTransferMessage("");
      setShowTransferModal(false);
      refetchMessages();
    }
  }, [isConfirmed, refetchMessages]);

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ChatAppABI,
      functionName: "sendMessage",
      args: [selectedFriend?.pubkey, message],
    });
  };

  // handleFileUpload 
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Processing file...");
    setUploading(true);

    try {
      // 🔒 Size check
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large (max 10MB)", { id: toastId });
        return;
      }

      const type = file.type || "";
      const name = file.name.toLowerCase();

      // ✅ Better detection
      const isAudio = type.startsWith("audio/") || name.endsWith(".mp3") || name.endsWith(".wav") || name.endsWith(".m4a") || name.endsWith(".ogg") || name.endsWith(".aac");
      const isVideo = (type.startsWith("video/") || name.endsWith(".mp4") || name.endsWith(".webm") || name.endsWith(".mov") || name.endsWith(".mkv")) && !isAudio;
      const isImage = type.startsWith("image/") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".gif") || name.endsWith(".webp");

      console.log("Detected:", { isImage, isVideo, isAudio });
      // 🖼️ IMAGE
      if (isImage) {
        const isNSFW = await detectNSFW(file);
        if (isNSFW === "BLURRY") {
          toast.error("Blurry images are not allowed.", { id: toastId });
          return;
        }
        if (isNSFW === true) {
          toast.error("18+ images are not allowed.", { id: toastId });
          return;
        }
      }

      // 🎥 VIDEO
      else if (isVideo) {
        toast.loading("Scanning video...", { id: toastId });

        const isSafe = await checkVideo(file);
        if (!isSafe) {
          toast.error("18+ videos are not allowed.", { id: toastId });
          return;
        }
      }

      // 🔊 AUDIO
      else if (isAudio) {
        console.log("Audio detected — skipping moderation");
        toast.loading("Uploading audio...", { id: toastId });
      }

      // ❌ Unknown
      else {
        toast.error("Unsupported file type", { id: toastId });
        return;
      }

      // 🧠 Message type
      let messageType;

      if (isImage) {
        messageType = MESSAGE_TYPES.IMAGE;
      } else if (isVideo) {
        messageType = MESSAGE_TYPES.VIDEO;
      } else if (isAudio) {
        messageType = MESSAGE_TYPES.AUDIO;
      } else {
        toast.error("Unsupported file type", { id: toastId });
        return;
      }

      // 🚨 SAFETY CHECK
      if (!messageType) {
        toast.error("Invalid file type", { id: toastId });
        return;
      }

      // 🚀 Upload to IPFS
      toast.loading("Uploading to IPFS...", { id: toastId });

      const result = await uploadToPinata(file);

      if (!result.success) {
        toast.error("Failed to upload file", { id: toastId });
        return;
      }

      // ⛓️ Send to contract
      const metadata = { filename: file.name };

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ChatAppABI,
        functionName: "sendMediaMessage",
        args: [
          selectedFriend?.pubkey,
          result.ipfsHash,
          messageType,
          JSON.stringify(metadata),
        ],
      });

      toast.success("✅ File sent!", { id: toastId });

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };
  const handleSendEth = () => {
    if (!transferAmount || !transferMessage.trim()) {
      toast.error("Please enter amount and message");
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ChatAppABI,
      functionName: "sendEthWithMessage",
      args: [selectedFriend?.pubkey, transferMessage],
      value: ethers.parseEther(transferAmount),
    });
  };

  const handleTokenTransferSuccess = () => {
    refetchMessages();
  };

  const renderMessage = (msg, index) => {
    const isOwn = msg.sender === address;
    const messageType = parseInt(msg.msgType);

    return (
      <div
        key={index}
        className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-6 group`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-sm border relative transition-all duration-300 hover:scale-[1.02] ${isOwn
              ? "bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 border-fuchsia-500/30 text-white shadow-lg shadow-fuchsia-500/20"
              : "bg-[#0E0B12]/60 border-purple-500/20 text-gray-200 shadow-lg shadow-purple-600/10"
            }`}
        >
          {/* Message glow effect */}
          <div
            className={`absolute inset-0 rounded-2xl ${isOwn
                ? "bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10"
                : "bg-gradient-to-r from-purple-600/5 to-fuchsia-500/5"
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>

          <div className="relative z-10">
            {messageType === MESSAGE_TYPES.TEXT && (
              <p className="leading-relaxed">{msg.content}</p>
            )}

            {messageType === MESSAGE_TYPES.IMAGE && (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-fuchsia-500/20 flex justify-center bg-black/20">
                  <img
                    src={getIPFSUrl(msg.content)}
                    alt="Shared image"
                    className="max-w-full max-h-[400px] object-contain hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
                {msg.metadata && (
                  <p className="text-xs opacity-60 flex items-center">
                    <FiDownload className="mr-1" size={12} />
                    {JSON.parse(msg.metadata).filename}
                  </p>
                )}
              </div>
            )}

            {messageType === MESSAGE_TYPES.VIDEO && (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-fuchsia-500/20 flex justify-center bg-black/20">
                  <video
                    src={getIPFSUrl(msg.content)}
                    controls
                    className="max-w-full max-h-[400px] rounded-xl"
                  />
                </div>
                {msg.metadata && (
                  <p className="text-xs opacity-60 flex items-center">
                    <FiPlay className="mr-1" size={12} />
                    {JSON.parse(msg.metadata).filename}
                  </p>
                )}
              </div>
            )}

            {messageType === MESSAGE_TYPES.AUDIO && (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 rounded-xl p-3 border border-fuchsia-500/20">
                  <audio
                    src={getIPFSUrl(msg.content)}
                    controls
                    className="w-full"
                  />
                </div>
                {msg.metadata && (
                  <p className="text-xs opacity-60 flex items-center">
                    <FiPlay className="mr-1" size={12} />
                    {JSON.parse(msg.metadata).filename}
                  </p>
                )}
              </div>
            )}

            {messageType === MESSAGE_TYPES.ETH_TRANSFER && (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl p-3 border border-green-500/30">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                      <FiDollarSign className="text-green-400" size={16} />
                    </div>
                    <span className="font-bold text-green-300">
                      {ethers.formatEther(msg.amount)} ETH
                    </span>
                  </div>
                  <p className="text-gray-200">{msg.content}</p>
                </div>
              </div>
            )}

            {messageType === MESSAGE_TYPES.TOKEN_TRANSFER && (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-xl p-3 border border-blue-500/30">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                      <BiTransfer className="text-blue-400" size={16} />
                    </div>
                    <span className="font-bold text-blue-300">
                      {formatTokenAmount(msg.amount, 18)} Tokens
                    </span>
                  </div>
                  <p className="text-gray-200 mb-2">{msg.content}</p>
                  <p className="text-xs opacity-60 font-mono bg-black/20 px-2 py-1 rounded">
                    {msg.tokenAddress.slice(0, 6)}...
                    {msg.tokenAddress.slice(-4)}
                  </p>
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
              <p className="text-xs opacity-50">
                {new Date(parseInt(msg.timestamp) * 1000).toLocaleTimeString()}
              </p>
              {isOwn && (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-fuchsia-400/60 rounded-full"></div>
                  <div className="w-1 h-1 bg-purple-400/60 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedFriend) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0E0B12]/40 backdrop-blur-sm rounded-2xl border border-fuchsia-500/10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto border border-fuchsia-500/30">
            <FiSend className="text-fuchsia-300" size={32} />
          </div>
          <p className="text-gray-400 text-lg">
            Select a friend to start chatting
          </p>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-fuchsia-400/40 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400/40 rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-fuchsia-400/40 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0E0B12]/40 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 shadow-2xl shadow-purple-600/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-[#0E0B12]/80 to-[#0E0B12]/60 backdrop-blur-xl border-b border-fuchsia-500/20">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="lg:hidden p-2 text-gray-400 hover:text-white bg-fuchsia-500/10 hover:bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/20 transition-all duration-300 hover:scale-110"
          >
            <FiX size={20} />
          </button>

          <div className="relative">
            <Avatar
              profilePicture={selectedFriend.profilePicture}
              name={selectedFriend.name}
              address={selectedFriend.pubkey}
              size="md"
            />
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-[#0E0B12] shadow-lg shadow-green-500/50">
              <div className="absolute inset-0.5 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white text-lg">
              {selectedFriend.name}
            </h3>
            <p className="text-sm text-gray-400 font-mono">
              {`${selectedFriend.pubkey.slice(
                0,
                6
              )}...${selectedFriend.pubkey.slice(-4)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTransferModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-green-500/30 flex items-center text-sm font-medium transition-all duration-300 hover:scale-105 border border-green-500/30"
          >
            <FiDollarSign className="mr-2" size={16} />
            <span className="hidden sm:inline">ETH</span>
          </button>
          <button
            onClick={() => setShowTokenModal(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-500/30 flex items-center text-sm font-medium transition-all duration-300 hover:scale-105 border border-blue-500/30"
          >
            <BiTransfer className="mr-2" size={16} />
            <span className="hidden sm:inline">Tokens</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-white bg-fuchsia-500/10 hover:bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/20 transition-all duration-300 hover:scale-110">
            <FiMoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <div className="relative z-10">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto border border-fuchsia-500/30">
                  <FiSend className="text-fuchsia-300" size={24} />
                </div>
                <p className="text-gray-400">
                  No messages yet. Start the conversation!
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => renderMessage(msg, index))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 sm:p-6 bg-gradient-to-r from-[#0E0B12]/80 to-[#0E0B12]/60 backdrop-blur-xl border-t border-fuchsia-500/20"
      >
        <div className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*,audio/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || isPending || isConfirming}
            className="p-3 text-gray-400 hover:text-white bg-fuchsia-500/10 hover:bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/20 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:scale-100"
          >
            <FiPaperclip size={18} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-[#0E0B12]/60 backdrop-blur-sm border border-fuchsia-500/20 rounded-xl text-white placeholder-gray-400 focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 focus:bg-[#0E0B12]/80 transition-all duration-300 shadow-lg shadow-purple-600/5"
            />
            {/* Input glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-500/5 to-purple-600/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <button
            type="submit"
            disabled={!message.trim() || isPending || isConfirming}
            className="p-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-fuchsia-500/30 border border-fuchsia-500/30"
          >
            <FiSend size={18} />
          </button>
        </div>
      </form>

      {/* ETH Transfer Modal */}
      {showTransferModal && (
        <div className="absolute inset-0 bg-[#0E0B12]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0E0B12]/90 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 shadow-2xl w-full max-w-md relative overflow-hidden">
            {/* Modal background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-purple-600/5"></div>

            <div className="relative z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                    <FiDollarSign className="text-green-400" size={16} />
                  </div>
                  Send ETH
                </h3>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="p-2 text-gray-400 hover:text-white bg-fuchsia-500/10 hover:bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/20 transition-all duration-300"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-fuchsia-300 mb-3">
                    Amount (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0E0B12]/60 backdrop-blur-sm border border-fuchsia-500/20 rounded-xl text-white placeholder-gray-400 focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fuchsia-300 mb-3">
                    Message
                  </label>
                  <input
                    type="text"
                    value={transferMessage}
                    onChange={(e) => setTransferMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0E0B12]/60 backdrop-blur-sm border border-fuchsia-500/20 rounded-xl text-white placeholder-gray-400 focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20"
                    placeholder="Payment for..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 px-4 py-3 bg-[#0E0B12]/60 border border-fuchsia-500/20 text-gray-300 rounded-xl hover:bg-fuchsia-500/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEth}
                    disabled={isPending || isConfirming}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-green-500/30"
                  >
                    {isPending || isConfirming ? "Sending..." : "Send ETH"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Token Transfer Modal */}
      <TokenTransferModal
        selectedFriend={selectedFriend}
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onSuccess={handleTokenTransferSuccess}
      />

      {/* File Upload Loading */}
      {uploading && (
        <div className="absolute inset-0 bg-[#0E0B12]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0E0B12]/90 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 p-8 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-500"></div>
                <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500/20"></div>
              </div>
              <span className="text-white font-medium">
                Uploading to IPFS...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(14, 11, 18, 0.3);
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #d946ef, #9333ea);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #c026d3, #7c3aed);
        }

        /* Enhanced animations */
        @keyframes message-appear {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .message-enter {
          animation: message-appear 0.3s ease-out;
        }

        /* Audio/video controls styling */
        audio,
        video {
          background: rgba(14, 11, 18, 0.8);
          border-radius: 8px;
        }

        /* Focus enhancements */
        input:focus,
        button:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
