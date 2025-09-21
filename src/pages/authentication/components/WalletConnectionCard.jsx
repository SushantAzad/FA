import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletConnectionCard = ({ onWalletConnect, isConnecting, walletAddress, networkStatus }) => {
  const [supportedNetworks] = useState([
    {
      id: 'polygon',
      name: 'Polygon',
      icon: 'Hexagon',
      isRecommended: true,
      chainId: '0x89'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      icon: 'Circle',
      isRecommended: false,
      chainId: '0x1'
    }
  ]);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const getNetworkColor = (network) => {
    switch (network) {
      case 'polygon':
        return 'text-purple-600';
      case 'ethereum':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-elevation-2">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
          <Icon name="Wallet" size={32} className="text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-sm text-muted-foreground">
          Securely connect your MetaMask wallet to start investing in fractional real estate
        </p>
      </div>
      {!walletAddress ? (
        <>
          <Button
            variant="default"
            size="lg"
            fullWidth
            loading={isConnecting}
            iconName="Wallet"
            iconPosition="left"
            onClick={onWalletConnect}
            className="mb-4"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>

          <div className="space-y-3 mb-6">
            <div className="text-sm font-medium text-foreground mb-2">
              Supported Networks:
            </div>
            {supportedNetworks?.map((network) => (
              <div
                key={network?.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={network?.icon} 
                    size={20} 
                    className={getNetworkColor(network?.id)} 
                  />
                  <span className="text-sm font-medium text-foreground">
                    {network?.name}
                  </span>
                  {network?.isRecommended && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <Icon name="CheckCircle" size={16} className="text-success" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 p-4 bg-success/10 rounded-lg mb-4">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <span className="text-sm font-medium text-success">Wallet Connected</span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="text-sm text-muted-foreground">Connected Address:</div>
            <div className="font-mono text-sm text-foreground bg-muted p-2 rounded">
              {formatAddress(walletAddress)}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getNetworkColor(networkStatus)} bg-current`} />
            <span className="text-sm text-muted-foreground capitalize">
              {networkStatus} Network
            </span>
          </div>
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} />
          <span>Your wallet connection is secured with SSL encryption</span>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionCard;