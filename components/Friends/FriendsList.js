import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { toast } from "react-hot-toast";
import {
  FiUserPlus,
  FiUser,
  FiMessageCircle,
  FiSearch,
  FiUsers,
  FiX,
  FiCheck,
  FiStar,
} from "react-icons/fi";
import { ChatAppABI, CONTRACT_ADDRESS } from "../../contracts/ChatApp";
import Avatar from "../Common/Avatar";

const FriendsList = ({ onStartChat, hideSection }) => {
  const { address } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendsWithProfilePics, setFriendsWithProfilePics] = useState([]);
  const [loadingProfilePics, setLoadingProfilePics] = useState(false);

  // Get friends list
  const { data: friendsList, refetch: refetchFriends } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ChatAppABI,
    functionName: "getMyFriendList",
    account: address,
  });

  // Get all users
  const { data: allUsers } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ChatAppABI,
    functionName: "getAllAppUser",
  });

  // Add friend contract write
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Handle successful friend addition
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Friend added successfully!");
      setShowAddFriend(false);
      refetchFriends();
    }
  }, [isConfirmed, refetchFriends]);

  // Fetch profile pictures for friends
  useEffect(() => {
    const fetchFriendsWithProfilePics = async () => {
      if (!friendsList || friendsList.length === 0) {
        setFriendsWithProfilePics([]);
        return;
      }

      setLoadingProfilePics(true);

      try {
        const friendsWithPics = await Promise.all(
          friendsList.map(async (friend) => {
            try {
              // Fetch profile picture for each friend using useReadContract pattern
              const response = await fetch("/api/getProfilePicture", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  address: friend.pubkey,
                  contractAddress: CONTRACT_ADDRESS,
                }),
              });

              if (response.ok) {
                const data = await response.json();
                return {
                  ...friend,
                  profilePicture: data.profilePicture || "",
                };
              } else {
                return {
                  ...friend,
                  profilePicture: "",
                };
              }
            } catch (error) {
              console.error(
                `Error fetching profile picture for ${friend.name}:`,
                error
              );
              return {
                ...friend,
                profilePicture: "",
              };
            }
          })
        );

        setFriendsWithProfilePics(friendsWithPics);
      } catch (error) {
        console.error("Error fetching friends profile pictures:", error);
        // Fallback to friends without profile pictures
        setFriendsWithProfilePics(
          friendsList.map((friend) => ({
            ...friend,
            profilePicture: "",
          }))
        );
      } finally {
        setLoadingProfilePics(false);
      }
    };

    fetchFriendsWithProfilePics();
  }, [friendsList]);

  // Alternative approach: Use individual useReadContract hooks for each friend
  // This is simpler but might be less efficient for many friends
  useEffect(() => {
    if (friendsList && friendsList.length > 0) {
      // For now, just add empty profilePicture to each friend
      // You can enhance this later with individual profile picture fetching
      const friendsWithEmptyPics = friendsList.map((friend) => ({
        ...friend,
        profilePicture: "", // Will be handled by Avatar component's fallback
      }));
      setFriendsWithProfilePics(friendsWithEmptyPics);
    }
  }, [friendsList]);

  const handleAddFriend = (user) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ChatAppABI,
      functionName: "addFriend",
      args: [user.accountAddress, user.name],
    });
  };

  const filteredFriends =
    friendsWithProfilePics?.filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const potentialFriends =
    allUsers?.filter(
      (user) =>
        user.accountAddress !== address &&
        !friendsList?.some((friend) => friend.pubkey === user.accountAddress) &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="h-full flex flex-col space-y-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-fuchsia-500/5 to-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-600/5 to-fuchsia-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

        {/* Floating particles */}
        <div className="absolute top-20 right-20 w-2 h-2 bg-fuchsia-400/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-16 w-1 h-1 bg-purple-400/30 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Header Section */}
      {hideSection && (
        <>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-fuchsia-500/30">
                <FiUsers className="text-fuchsia-400" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                  Friends
                </h1>
                <p className="text-gray-400 text-sm">Manage your connections</p>
              </div>
            </div>

            <button
              onClick={() => setShowAddFriend(!showAddFriend)}
              className={`
            px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2
            ${
              showAddFriend
                ? "bg-gradient-to-r from-red-500/20 to-pink-600/20 border border-red-500/30 text-red-300 hover:from-red-500/30 hover:to-pink-600/30"
                : "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white shadow-lg shadow-fuchsia-500/30"
            }
            hover:scale-105 active:scale-95
          `}
            >
              {showAddFriend ? <FiX size={18} /> : <FiUserPlus size={18} />}
              <span>{showAddFriend ? "Cancel" : "Add Friend"}</span>
            </button>
          </div>

          {/* Search Section */}
          <div className="relative z-10">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 group-focus-within:from-fuchsia-500/30 group-focus-within:to-purple-600/30 transition-all duration-300">
                  <FiSearch
                    className="text-fuchsia-300 group-focus-within:text-fuchsia-200 transition-colors duration-300"
                    size={16}
                  />
                </div>
              </div>

              <input
                type="text"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
              w-full pl-14 pr-6 py-4 
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

              {/* Focus glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        </>
      )}

      {/* Add Friends Section */}
      {showAddFriend && (
        <div className="relative z-10 bg-gradient-to-br from-[#0E0B12]/80 to-[#0E0B12]/60 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 shadow-2xl shadow-purple-600/10 overflow-hidden">
          {/* Section header */}
          <div className="p-6 border-b border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/5 to-purple-600/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center border border-green-500/30">
                <FiUserPlus className="text-green-400" size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Add New Friends
                </h2>
                <p className="text-gray-400 text-sm">
                  Discover and connect with other users
                </p>
              </div>
            </div>
          </div>

          {/* Potential friends list */}
          <div className="p-6 max-h-80 overflow-y-auto space-y-3">
            {potentialFriends.length > 0 ? (
              potentialFriends.map((user, index) => (
                <div
                  key={user.accountAddress}
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-[#0E0B12]/40 to-[#0E0B12]/20 backdrop-blur-sm rounded-xl border border-white/5 hover:border-fuchsia-500/20 transition-all duration-300 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar
                        profilePicture=""
                        name={user.name}
                        address={user.accountAddress}
                        size="md"
                      />
                      {/* New user indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-[#0E0B12]">
                        <FiStar className="text-white w-2 h-2 m-0.5" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-400 font-mono">
                        {`${user.accountAddress.slice(
                          0,
                          6
                        )}...${user.accountAddress.slice(-4)}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddFriend(user)}
                    disabled={isPending || isConfirming}
                    className="
                      bg-gradient-to-r from-green-500 to-emerald-600 
                      hover:from-green-600 hover:to-emerald-700 
                      disabled:from-gray-600 disabled:to-gray-700
                      text-white px-4 py-2 rounded-xl 
                      transition-all duration-300 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center space-x-2
                      shadow-lg shadow-green-500/30
                      hover:shadow-xl hover:shadow-emerald-500/40
                      hover:scale-105 active:scale-95
                    "
                  >
                    {isPending || isConfirming ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <FiCheck size={16} />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-500/30">
                  <FiUser className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-400 text-lg">No users found</p>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search or check back later
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Friends List Section */}
      <div className="relative z-10 flex-1 bg-gradient-to-br from-[#0E0B12]/80 to-[#0E0B12]/60 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 shadow-2xl shadow-purple-600/10 overflow-hidden flex flex-col">
        {/* Section header */}
        <div className="p-6  border-b border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/5 to-purple-600/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3  ">
              <div className="w-10 h-10 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-fuchsia-500/30">
                <FiUsers className="text-fuchsia-400" size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Your Friends
                </h2>
                <p className="text-gray-400 text-sm">
                  {filteredFriends.length} connections
                </p>
              </div>
            </div>

            {/* Online indicator */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-lg px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm">Live</span>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loadingProfilePics && (
          <div className="p-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-500"></div>
                <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500/20"></div>
              </div>
              <span className="text-white font-medium">
                Loading profile pictures...
              </span>
            </div>
          </div>
        )}

        {/* Friends list */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend, index) => (
              <div
                key={friend.pubkey}
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-[#0E0B12]/40 to-[#0E0B12]/20 backdrop-blur-sm rounded-xl border border-white/5 hover:border-fuchsia-500/20 transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar
                      profilePicture={friend.profilePicture}
                      name={friend.name}
                      address={friend.pubkey}
                      size="lg"
                    />
                    {/* Online status */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-[#0E0B12]">
                      <div className="absolute inset-0.5 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-white text-lg">
                      {friend.name}
                    </p>
                    <p className="text-sm text-gray-400 font-mono">
                      {`${friend.pubkey.slice(0, 6)}...${friend.pubkey.slice(
                        -4
                      )}`}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-300">Online</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onStartChat(friend)}
                  className="
                    bg-gradient-to-r from-fuchsia-500 to-purple-600 
                    hover:from-fuchsia-600 hover:to-purple-700 
                    text-white px-4 py-2 rounded-xl 
                    transition-all duration-300 
                    flex items-center space-x-2
                    shadow-lg shadow-fuchsia-500/30
                    hover:shadow-xl hover:shadow-purple-500/40
                    hover:scale-105 active:scale-95
                    opacity-0 group-hover:opacity-100
                    translate-x-4 group-hover:translate-x-0
                  "
                >
                  <FiMessageCircle size={16} />
                  <span>Chat</span>
                </button>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto border border-fuchsia-500/30">
                  <FiUser className="text-fuchsia-400" size={32} />
                </div>
                <div>
                  <p className="text-gray-400 text-lg">No friends found</p>
                  <p className="text-gray-500 text-sm">
                    Add some friends to start chatting!
                  </p>
                </div>
                <div className="flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-fuchsia-400/40 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400/40 rounded-full animate-pulse delay-200"></div>
                  <div className="w-2 h-2 bg-fuchsia-400/40 rounded-full animate-pulse delay-400"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
