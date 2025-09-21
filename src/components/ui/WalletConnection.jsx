import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const WalletConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [networkStatus, setNetworkStatus] = useState('mainnet');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [balance, setBalance] = useState('0.00');

  // Simulate wallet connection
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock wallet connection
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4');
      setBalance('2.45');
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance('0.00');
    setShowDropdown(false);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard?.writeText(walletAddress);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const getNetworkColor = (network) => {
    switch (network) {
      case 'mainnet':
        return 'text-success';
      case 'testnet':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.wallet-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isConnected) {
    return (
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={connectWallet}
          loading={isConnecting}
          iconName="Wallet"
          iconPosition="left"
          className="hidden sm:flex"
        >
          Connect Wallet
        </Button>
        
        {/* Mobile version */}
        <Button
          variant="outline"
          size="icon"
          onClick={connectWallet}
          loading={isConnecting}
          className="sm:hidden"
        >
          <Icon name="Wallet" size={18} />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative wallet-dropdown">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-smooth duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getNetworkColor(networkStatus)} bg-current`} />
          <span className="hidden sm:block text-sm font-mono text-foreground">
            {formatAddress(walletAddress)}
          </span>
          <Icon name="Wallet" size={16} className="sm:hidden" />
        </div>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`text-muted-foreground transition-transform duration-150 ${
            showDropdown ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-popover border border-border rounded-lg shadow-elevation-3 z-300 animate-fade-in">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-popover-foreground">Wallet Connected</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getNetworkColor(networkStatus)} bg-current`} />
                <span className="text-xs text-muted-foreground capitalize">{networkStatus}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                {walletAddress}
              </span>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-muted rounded transition-smooth duration-150"
                title="Copy address"
              >
                <Icon name="Copy" size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-popover-foreground">Balance</span>
              <span className="text-sm font-semibold font-mono text-popover-foreground">
                {balance} ETH
              </span>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={disconnectWallet}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-smooth duration-150"
            >
              <Icon name="LogOut" size={16} />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;