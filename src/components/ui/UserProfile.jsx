import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';


const UserProfile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    avatar: null,
    kycStatus: 'verified',
    memberSince: '2024'
  });

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    // Handle logout logic
    setShowDropdown(false);
    console.log('Logging out...');
  };

  const getKycStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'rejected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getKycStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'rejected':
        return 'XCircle';
      default:
        return 'AlertCircle';
    }
  };

  const menuItems = [
    {
      label: 'Profile Settings',
      icon: 'User',
      action: () => console.log('Profile settings'),
    },
    {
      label: 'Account Security',
      icon: 'Shield',
      action: () => console.log('Account security'),
    },
    {
      label: 'Notifications',
      icon: 'Bell',
      action: () => console.log('Notifications'),
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      action: () => console.log('Help & Support'),
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.user-profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name?.split(' ')?.map(word => word?.charAt(0))?.join('')?.toUpperCase()?.slice(0, 2);
  };

  return (
    <div className="relative user-profile-dropdown">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-muted transition-smooth duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
          {user?.avatar ? (
            <img 
              src={user?.avatar} 
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            getInitials(user?.name)
          )}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-foreground">{user?.name}</div>
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
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevation-3 z-300 animate-fade-in">
          {/* User Info Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                {user?.avatar ? (
                  <img 
                    src={user?.avatar} 
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-popover-foreground truncate">
                  {user?.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            
            {/* KYC Status */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">KYC Status</span>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getKycStatusIcon(user?.kycStatus)} 
                  size={12} 
                  className={getKycStatusColor(user?.kycStatus)} 
                />
                <span className={`text-xs font-medium capitalize ${getKycStatusColor(user?.kycStatus)}`}>
                  {user?.kycStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems?.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item?.action();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-lg transition-smooth duration-150"
              >
                <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                <span>{item?.label}</span>
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-smooth duration-150"
            >
              <Icon name="LogOut" size={16} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              Member since {user?.memberSince}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;