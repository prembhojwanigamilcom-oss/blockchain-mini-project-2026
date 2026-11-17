import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG, MARKSHEET_VERIFICATION_ABI, NETWORKS } from '../config/contracts';

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  isAdmin: boolean;
  adminAddress: string | null;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
  hasMetaMask: boolean;
  contractAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (targetChainId?: number) => Promise<void>;
  getReadOnlyContract: () => ethers.Contract;
  getSignerContract: () => Promise<ethers.Contract>;
  setContractAddress: (address: string) => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Extend Window interface for MetaMask ethereum object
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminAddress, setAdminAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [contractAddress, setContractAddressState] = useState<string>(CONTRACT_CONFIG.address);

  const hasMetaMask = typeof window !== 'undefined' && Boolean(window.ethereum);
  const isCorrectNetwork = chainId === NETWORKS.HARDHAT.chainId || chainId === NETWORKS.SEPOLIA.chainId;

  // Custom contract address setter (for dynamically syncing or updating)
  const setContractAddress = (newAddress: string) => {
    setContractAddressState(newAddress);
  };

  /**
   * Provides a read-only contract instance connected via RPC provider.
   * Public users can verify documents anytime without MetaMask.
   */
  const getReadOnlyContract = useCallback((): ethers.Contract => {
    let rpcUrl = NETWORKS.HARDHAT.rpcUrl;
    if (chainId === NETWORKS.SEPOLIA.chainId) {
      rpcUrl = NETWORKS.SEPOLIA.rpcUrl;
    }
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    return new ethers.Contract(contractAddress, MARKSHEET_VERIFICATION_ABI, provider);
  }, [contractAddress, chainId]);

  /**
   * Provides an authenticated contract instance connected to the MetaMask Signer.
   * Used for issuing and revoking marksheets.
   */
  const getSignerContract = useCallback(async (): Promise<ethers.Contract> => {
    if (!hasMetaMask) {
      throw new Error("MetaMask is not installed. Please install MetaMask to interact with blockchain as administrator.");
    }
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await browserProvider.getSigner();
    return new ethers.Contract(contractAddress, MARKSHEET_VERIFICATION_ABI, signer);
  }, [hasMetaMask, contractAddress]);

  /**
   * Verifies if the connected account is the university administrator
   */
  const verifyAdminRole = useCallback(async (currentAccount: string) => {
    try {
      const readContract = getReadOnlyContract();
      const onChainAdmin = await readContract.universityAdmin();
      setAdminAddress(onChainAdmin);
      const isOwner = onChainAdmin.toLowerCase() === currentAccount.toLowerCase();
      setIsAdmin(isOwner);
    } catch (err) {
      console.warn("Could not query universityAdmin from contract. Local node might be offline or contract not deployed yet.", err);
      // Fallback: If running on local hardhat and it's Account #0 (0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266), consider admin
      if (currentAccount.toLowerCase() === "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266".toLowerCase()) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [getReadOnlyContract]);

  /**
   * Connects MetaMask wallet
   */
  const connectWallet = async () => {
    if (!hasMetaMask) {
      alert("MetaMask not found! Please install the MetaMask browser extension to manage marksheets.");
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        const userAccount = accounts[0];
        setAccount(userAccount);

        const currentChainHex = await window.ethereum.request({ method: 'eth_chainId' });
        const parsedChainId = parseInt(currentChainHex, 16);
        setChainId(parsedChainId);

        await verifyAdminRole(userAccount);
      }
    } catch (error: any) {
      console.error("User rejected or failed to connect MetaMask:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnects current wallet session in the UI
   */
  const disconnectWallet = () => {
    setAccount(null);
    setIsAdmin(false);
  };

  /**
   * Switches or prompts MetaMask to switch to the required network
   */
  const switchNetwork = async (targetChainId: number = NETWORKS.HARDHAT.chainId) => {
    if (!hasMetaMask) return;

    const targetNetwork = targetChainId === NETWORKS.SEPOLIA.chainId ? NETWORKS.SEPOLIA : NETWORKS.HARDHAT;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetNetwork.hexChainId }],
      });
    } catch (switchError: any) {
      // 4902 indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: targetNetwork.hexChainId,
                chainName: targetNetwork.name,
                rpcUrls: [targetNetwork.rpcUrl],
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network to MetaMask", addError);
        }
      } else {
        console.error("Failed to switch network", switchError);
      }
    }
  };

  // Listen to MetaMask account and chain changes
  useEffect(() => {
    if (!hasMetaMask) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        verifyAdminRole(accounts[0]);
      }
    };

    const handleChainChanged = (newChainHex: string) => {
      const parsedChainId = parseInt(newChainHex, 16);
      setChainId(parsedChainId);
      // Re-evaluate admin role on chain change
      if (account) {
        verifyAdminRole(account);
      }
    };

    // Check if already connected on load
    window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        window.ethereum.request({ method: 'eth_chainId' }).then((hexId: string) => {
          setChainId(parseInt(hexId, 16));
          verifyAdminRole(accounts[0]);
        });
      }
    }).catch(console.error);

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [hasMetaMask, verifyAdminRole, account]);

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        isAdmin,
        adminAddress,
        isConnecting,
        isCorrectNetwork,
        hasMetaMask,
        contractAddress,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        getReadOnlyContract,
        getSignerContract,
        setContractAddress,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
