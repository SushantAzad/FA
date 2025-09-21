import React from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioSummaryCard = ({ title, value, change, changeType, icon, iconColor }) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth duration-150">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ backgroundColor: `${iconColor}20` }}>
          <Icon name={icon} size={24} color={iconColor} />
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor(changeType)}`}>
          <Icon name={getChangeIcon(changeType)} size={16} />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;