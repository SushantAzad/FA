import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RebalanceModal = ({ isOpen, onClose, holdings, onRebalance }) => {
  const [rebalanceType, setRebalanceType] = useState('automatic');
  const [targetAllocations, setTargetAllocations] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const rebalanceOptions = [
    { value: 'automatic', label: 'Automatic Rebalancing' },
    { value: 'manual', label: 'Manual Allocation' },
    { value: 'equal', label: 'Equal Weight Distribution' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const totalValue = holdings?.reduce((sum, holding) => sum + holding?.value, 0);

  const handleAllocationChange = (holdingId, percentage) => {
    setTargetAllocations(prev => ({
      ...prev,
      [holdingId]: Math.max(0, Math.min(100, parseFloat(percentage) || 0))
    }));
  };

  const getTotalAllocation = () => {
    return Object.values(targetAllocations)?.reduce((sum, allocation) => sum + allocation, 0);
  };

  const handleRebalance = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onRebalance({
        type: rebalanceType,
        allocations: targetAllocations
      });
      onClose();
    } catch (error) {
      console.error('Rebalancing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getRecommendedAllocation = (holding) => {
    // Simple recommendation based on property type and performance
    const baseAllocation = 100 / holdings?.length;
    const performanceMultiplier = holding?.returns > 10 ? 1.2 : holding?.returns < 0 ? 0.8 : 1;
    return Math.round(baseAllocation * performanceMultiplier);
  };

  const applyRecommendations = () => {
    const recommendations = {};
    holdings?.forEach(holding => {
      recommendations[holding.id] = getRecommendedAllocation(holding);
    });
    
    // Normalize to 100%
    const total = Object.values(recommendations)?.reduce((sum, val) => sum + val, 0);
    Object.keys(recommendations)?.forEach(key => {
      recommendations[key] = Math.round((recommendations?.[key] / total) * 100);
    });
    
    setTargetAllocations(recommendations);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-4 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Rebalance Portfolio</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Optimize your asset allocation for better returns
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Rebalance Type Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Rebalancing Strategy
              </label>
              <Select
                options={rebalanceOptions}
                value={rebalanceType}
                onChange={setRebalanceType}
                className="w-full"
              />
            </div>

            {/* Current vs Target Allocation */}
            {rebalanceType === 'manual' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-foreground">Asset Allocation</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={applyRecommendations}
                    iconName="Zap"
                    iconPosition="left"
                  >
                    Apply Recommendations
                  </Button>
                </div>

                <div className="space-y-4">
                  {holdings?.map((holding) => {
                    const currentAllocation = (holding?.value / totalValue) * 100;
                    const targetAllocation = targetAllocations?.[holding?.id] || currentAllocation;
                    const difference = targetAllocation - currentAllocation;
                    
                    return (
                      <div key={holding?.id} className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden">
                            <img 
                              src={holding?.image} 
                              alt={holding?.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/assets/images/no_image.png';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{holding?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Current: {formatCurrency(holding?.value)} ({currentAllocation?.toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Target Allocation (%)
                            </label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={targetAllocation}
                              onChange={(e) => handleAllocationChange(holding?.id, e?.target?.value)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Difference
                            </label>
                            <div className={`text-sm font-medium p-2 rounded ${
                              Math.abs(difference) < 0.1 
                                ? 'text-muted-foreground bg-muted' 
                                : difference > 0 
                                  ? 'text-success bg-success/10' :'text-error bg-error/10'
                            }`}>
                              {difference > 0 ? '+' : ''}{difference?.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Total Allocation</span>
                    <span className={`text-sm font-bold ${
                      Math.abs(getTotalAllocation() - 100) < 0.1 
                        ? 'text-success' :'text-error'
                    }`}>
                      {getTotalAllocation()?.toFixed(1)}%
                    </span>
                  </div>
                  {Math.abs(getTotalAllocation() - 100) >= 0.1 && (
                    <p className="text-xs text-error mt-1">
                      Total allocation must equal 100%
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Automatic Rebalancing Info */}
            {rebalanceType === 'automatic' && (
              <div className="bg-accent/10 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Zap" size={20} className="text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Automatic Rebalancing</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Our algorithm will optimize your portfolio based on:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Property performance and growth potential</li>
                      <li>• Market trends and risk assessment</li>
                      <li>• Diversification across property types and locations</li>
                      <li>• Your investment goals and risk tolerance</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Equal Weight Info */}
            {rebalanceType === 'equal' && (
              <div className="bg-accent/10 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="BarChart3" size={20} className="text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Equal Weight Distribution</h4>
                    <p className="text-sm text-muted-foreground">
                      Each property will receive an equal allocation of {(100 / holdings?.length)?.toFixed(1)}% 
                      of your total portfolio value.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rebalancing Impact */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Rebalancing Impact</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Estimated Fees</div>
                  <div className="font-medium text-foreground">$12.50</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Processing Time</div>
                  <div className="font-medium text-foreground">2-5 minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleRebalance}
            loading={isProcessing}
            disabled={rebalanceType === 'manual' && Math.abs(getTotalAllocation() - 100) >= 0.1}
            iconName="RefreshCw"
            iconPosition="left"
          >
            {isProcessing ? 'Rebalancing...' : 'Rebalance Portfolio'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RebalanceModal;