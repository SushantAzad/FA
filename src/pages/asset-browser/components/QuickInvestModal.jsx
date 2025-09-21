import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const QuickInvestModal = ({ property, isOpen, onClose, onConfirm }) => {
  const [investmentAmount, setInvestmentAmount] = useState(property?.minInvestment || 1000);
  const [tokenQuantity, setTokenQuantity] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);

  if (!isOpen || !property) return null;

  const handleAmountChange = (value) => {
    const amount = parseInt(value) || 0;
    setInvestmentAmount(amount);
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const tokens = Math.floor(amount / property?.tokenPrice);
      setTokenQuantity(tokens);
      setIsCalculating(false);
    }, 300);
  };

  const handleTokenChange = (value) => {
    const tokens = parseInt(value) || 0;
    setTokenQuantity(tokens);
    setInvestmentAmount(tokens * property?.tokenPrice);
  };

  const handleConfirm = () => {
    onConfirm?.({
      propertyId: property?.id,
      amount: investmentAmount,
      tokens: tokenQuantity,
      property
    });
  };

  const estimatedReturns = {
    monthly: (investmentAmount * (property?.expectedReturn / 100)) / 12,
    yearly: investmentAmount * (property?.expectedReturn / 100),
    total: investmentAmount + (investmentAmount * (property?.expectedReturn / 100) * 5)
  };

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-4 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">
            Quick Investment
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Property Summary */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={property?.image}
                alt={property?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground mb-1">
                {property?.title}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Icon name="MapPin" size={14} className="mr-1" />
                <span>{property?.location}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Token Price: </span>
                  <span className="font-medium text-card-foreground">
                    ${property?.tokenPrice?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Return: </span>
                  <span className="font-medium text-success">
                    {property?.expectedReturn}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Calculator */}
        <div className="p-6 border-b border-border">
          <h4 className="font-semibold text-card-foreground mb-4">
            Investment Calculator
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Investment Amount ($)"
              type="number"
              value={investmentAmount}
              onChange={(e) => handleAmountChange(e?.target?.value)}
              min={property?.minInvestment}
              placeholder="Enter amount"
            />
            
            <Input
              label="Token Quantity"
              type="number"
              value={tokenQuantity}
              onChange={(e) => handleTokenChange(e?.target?.value)}
              min={1}
              placeholder="Number of tokens"
            />
          </div>

          {isCalculating && (
            <div className="flex items-center justify-center py-4">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Calculating...</span>
            </div>
          )}

          {/* Investment Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Investment</div>
                <div className="font-semibold text-card-foreground">
                  ${investmentAmount?.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Tokens Acquired</div>
                <div className="font-semibold text-card-foreground">
                  {tokenQuantity?.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Ownership %</div>
                <div className="font-semibold text-card-foreground">
                  {((tokenQuantity / property?.totalTokens) * 100)?.toFixed(4)}%
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Min. Investment</div>
                <div className="font-semibold text-card-foreground">
                  ${property?.minInvestment?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Returns */}
        <div className="p-6 border-b border-border">
          <h4 className="font-semibold text-card-foreground mb-4">
            Estimated Returns
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Monthly Return</span>
              <span className="font-semibold text-success">
                ${estimatedReturns?.monthly?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Annual Return</span>
              <span className="font-semibold text-success">
                ${estimatedReturns?.yearly?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">5-Year Projection</span>
              <span className="font-semibold text-success">
                ${estimatedReturns?.total?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-xs text-warning-foreground">
                <strong>Disclaimer:</strong> Returns are estimates based on historical data and market projections. Actual returns may vary and are not guaranteed.
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={handleConfirm}
              disabled={investmentAmount < property?.minInvestment}
              iconName="CreditCard"
              iconPosition="left"
            >
              Proceed to Payment
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground text-center">
            By proceeding, you agree to our Terms of Service and Investment Agreement
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickInvestModal;