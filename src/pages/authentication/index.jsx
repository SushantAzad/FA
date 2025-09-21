import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationToggle from './components/AuthenticationToggle';
import WalletConnectionCard from './components/WalletConnectionCard';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';

const Authentication = () => {
  const navigate = useNavigate();
  const [activeMethod, setActiveMethod] = useState('wallet');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [networkStatus, setNetworkStatus] = useState('');
  const [authError, setAuthError] = useState('');

  // Mock credentials for testing
  const mockCredentials = {
    email: 'demo@fractionalasset.com',
    password: 'Demo123!',
    phone: '+1 (555) 123-4567'
  };

  useEffect(() => {
    // Check if user is already authenticated
    const savedAuth = localStorage.getItem('fractionalAssetAuth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      if (authData?.walletAddress || authData?.email) {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    setAuthError('');

    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful wallet connection
      const mockWalletAddress = '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4';
      const mockNetwork = 'polygon';

      setWalletAddress(mockWalletAddress);
      setNetworkStatus(mockNetwork);

      // Save authentication data
      const authData = {
        type: 'wallet',
        walletAddress: mockWalletAddress,
        network: mockNetwork,
        timestamp: new Date()?.toISOString()
      };
      localStorage.setItem('fractionalAssetAuth', JSON.stringify(authData));

      // Navigate to dashboard after successful connection
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Wallet connection failed:', error);
      setAuthError('Failed to connect wallet. Please make sure MetaMask is installed and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEmailRegistration = async (formData) => {
    setIsRegistering(true);
    setAuthError('');

    try {
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Validate against mock credentials
      if (formData?.email !== mockCredentials?.email || 
          formData?.phone !== mockCredentials?.phone) {
        throw new Error('Invalid credentials. Please use the demo credentials provided.');
      }

      // Mock successful registration
      const authData = {
        type: 'email',
        email: formData?.email,
        phone: formData?.phone,
        kycStatus: 'pending',
        timestamp: new Date()?.toISOString()
      };
      localStorage.setItem('fractionalAssetAuth', JSON.stringify(authData));

      // Navigate to dashboard after successful registration
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Registration failed:', error);
      setAuthError(error?.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleMethodChange = (method) => {
    setActiveMethod(method);
    setAuthError('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <AuthenticationToggle 
            activeMethod={activeMethod}
            onMethodChange={handleMethodChange}
          />

          {authError && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2 text-error">
                <span className="text-sm font-medium">Authentication Error:</span>
                <span className="text-sm">{authError}</span>
              </div>
              {authError?.includes('demo credentials') && (
                <div className="mt-2 p-3 bg-muted/50 rounded border text-xs">
                  <div className="font-medium text-foreground mb-1">Demo Credentials:</div>
                  <div className="text-muted-foreground space-y-1">
                    <div>Email: {mockCredentials?.email}</div>
                    <div>Phone: {mockCredentials?.phone}</div>
                    <div>Password: {mockCredentials?.password}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Authentication Section */}
            <div className="lg:col-span-2">
              {activeMethod === 'wallet' ? (
                <WalletConnectionCard
                  onWalletConnect={handleWalletConnect}
                  isConnecting={isConnecting}
                  walletAddress={walletAddress}
                  networkStatus={networkStatus}
                />
              ) : (
                <RegistrationForm
                  onRegister={handleEmailRegistration}
                  isRegistering={isRegistering}
                />
              )}
            </div>

            {/* Trust Signals Sidebar */}
            <div className="lg:col-span-1">
              <TrustSignals />
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Why Choose FractionalAsset?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">$50M+</div>
                  <div className="text-sm text-muted-foreground">Assets Under Management</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">10,000+</div>
                  <div className="text-sm text-muted-foreground">Active Investors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">8.5%</div>
                  <div className="text-sm text-muted-foreground">Average Annual Return</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <div className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              <br />
              © {new Date()?.getFullYear()} FractionalAsset. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;