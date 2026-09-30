# 🚀 MetaLink - A Decentralized App using Metamask
Build & Deploy a Blockchain Web3 Chat DApp | Solidity, Next.js, NSFW, Wagmi – Full Stack Project

A decentralized real-time chat application built using Web3
technologies. This project enables secure messaging, wallet-based
authentication, and token transfers using Ethereum smart contracts.

------------------------------------------------------------------------

## 🧠 Overview

<img width="1919" height="909" alt="Screenshot 2026-03-17 191913" src="https://github.com/user-attachments/assets/fd0395f5-582f-4914-b1fb-09b2accdc004" />

Advance Chat DApp is a blockchain-based chat platform where users can: -
Connect wallets using MetaMask - Send and receive messages securely -
Transfer tokens between users - Upload profile pictures using IPFS -
Manage friends and chat history

------------------------------------------------------------------------

## 🚀 Features

### 💬 Decentralized Messaging
- Send and receive text messages via smart contracts
- No centralized server involved

### 🖼️ Media Sharing (IPFS)
- Upload images, videos, and audio using Pinata
- Only IPFS hash stored on blockchain (low gas cost)

### 👥 Friend System
- Add friends using wallet addresses
- Only friends can communicate (spam prevention)

### 💰 Crypto Transactions
- Send **ETH and ERC-20 tokens** directly in chat
- Built-in financial interaction layer

### 🔐 Wallet Authentication
- Login using MetaMask (no username/password)
- Identity = Ethereum wallet address

### 🛡️ NSFW Content Moderation
- AI-based image moderation using **NSFWJS + TensorFlow.js**
- Blocks inappropriate content before upload

### 📊 Dashboard
- View:
  - Total messages
  - Friends count
  - ETH/token transfers

---

## 🛠️ Tech Stack

### Frontend
- Next.js (React)
- Wagmi (Web3 hooks)
- Viem (Ethereum interaction)

### Backend
- Solidity Smart Contracts
- Hardhat (development & deployment)

### Storage
- IPFS (via Pinata)

### Authentication
- MetaMask Wallet

### AI Moderation
- NSFWJS + TensorFlow.js

------------------------------------------------------------------------

## ⚙️ How It Works

### 1️⃣ Registration
- User connects MetaMask
- Creates account stored on blockchain

### 2️⃣ Add Friends
- Select users from global registry
- Smart contract links both users

### 3️⃣ Messaging
- Text → Stored on-chain  
- Media → Uploaded to IPFS, hash stored on-chain  

### 4️⃣ Transactions
- Send ETH or tokens inside chat
- MetaMask confirms each transaction

------------------------------------------------------------------------

## 📈 Key Advantages

- ✅ Fully decentralized (no central server)
- ✅ Data privacy & ownership
- ✅ Immutable messages
- ✅ Censorship-resistant
- ✅ Integrated crypto payments

---

## ⚠️ Limitations

- Gas fees for transactions
- Network latency
- Scalability challenges

---

## 📸 Results

- Landing Page  
- Wallet Connection  
- Dashboard  
- Chat Interface  
- Media Transfer 

## ⚙️ Installation & Setup

### Install dependencies

npm install

### Setup environment variables

Create a `.env.local` file:

NEXT_PUBLIC_PINATA_API_KEY=your_key\
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret\
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address

------------------------------------------------------------------------

## 🔗 Smart Contract Setup

cd web3\
node -v\
npm -v\
nvm -v\
nvm list available\
nvm install "paste the version"\
nvm use "paste the version"\
npm i\
clear\
cd web3\
node -v\
nvm use "paste the version"\
npm run compile\
npm run node

split terminal\
npm run deploy-local\
copied the address and pasted it in env.local\
NEXT_PUBLIC_CHAT_DAPP_ADDRESS:your_address\
NEXT_PUBLIC_THEBLOCKCHAINCODERS:your_blockchain_coders

clear\
cd..\
node -v\
npm i\
clear

-Relay website\
Create acc then create project\
and copy the proj id paste it in env.local public wallet proj id

-Pinata Website\
Login into pinata then create api key

-Metamask Website\
Create Metamask Acc

------------------------------------------------------------------------

## ▶️ Run the Application

npm run dev -- --webpack

App runs at: http://localhost:3000

------------------------------------------------------------------------

## 🔐 Security Note

Do NOT push `.env` files to GitHub. Add them to `.gitignore`.

------------------------------------------------------------------------

## 🚀 Future Enhancements

-   Real-time notifications
-   Video/Voice calling
-   Mobile responsiveness improvements
-   Deployment on Vercel

------------------------------------------------------------------------

## 📜 License

This project is for educational purposes.
