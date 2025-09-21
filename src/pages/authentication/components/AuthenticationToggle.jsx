import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthenticationToggle = ({ activeMethod, onMethodChange }) => {
  const authMethods = [
    {
      id: 'wallet',
      label: 'Wallet Connect',
      icon: 'Wallet',
      description: 'Connect with MetaMask',
      recommended: true
    },
    {
      id: 'email',
      label: 'Email Registration',
      icon: 'Mail',
      description: 'Traditional signup',
      recommended: false
    }
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to FractionalAsset
        </h1>
        <p className="text-muted-foreground">
          Choose your preferred authentication method to get started
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {authMethods?.map((method) => (
          <button
            key={method?.id}
            onClick={() => onMethodChange(method?.id)}
            className={`relative p-4 border-2 rounded-xl transition-all duration-200 text-left ${
              activeMethod === method?.id
                ? 'border-primary bg-primary/5 shadow-elevation-2'
                : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            {method?.recommended && (
              <div className="absolute -top-2 left-4">
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Recommended
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                activeMethod === method?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Icon name={method?.icon} size={24} />
              </div>
              
              <div className="flex-1">
                <div className={`font-semibold ${
                  activeMethod === method?.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {method?.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {method?.description}
                </div>
              </div>
              
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                activeMethod === method?.id
                  ? 'border-primary bg-primary' :'border-muted-foreground'
              }`}>
                {activeMethod === method?.id && (
                  <Icon name="Check" size={12} className="text-primary-foreground" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AuthenticationToggle;