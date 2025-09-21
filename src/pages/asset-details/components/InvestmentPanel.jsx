import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const InvestmentPanel = ({ property, onInvest }) => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [tokenQuantity, setTokenQuantity] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const handleAmountChange = (e) => {
    const amount = e?.target?.value;
    setInvestmentAmount(amount);
    
    if (amount && !isNaN(amount)) {
      const tokens = Math.floor(parseFloat(amount) / property?.tokenPrice);
      setTokenQuantity(tokens);
    } else {
      setTokenQuantity(0);
    }
  };

  const handleTokenChange = (e) => {
    const tokens = e?.target?.value;
    setTokenQuantity(tokens);
    
    if (tokens && !isNaN(tokens)) {
      const amount = parseFloat(tokens) * property?.tokenPrice;
      setInvestmentAmount(amount?.toString());
    } else {
      setInvestmentAmount('');
    }
  };

  const handleInvest = () => {
    if (tokenQuantity > 0 && tokenQuantity <= property?.availableTokens) {
      setShowConfirmation(true);
    }
  };

  const confirmInvestment = () => {
    onInvest({
      amount: parseFloat(investmentAmount),
      tokens: tokenQuantity,
      property: property
    });
    setShowConfirmation(false);
    setInvestmentAmount('');
    setTokenQuantity(0);
  };

  const toggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const estimatedReturns = {
    monthly: tokenQuantity * property?.tokenPrice * (property?.dividendYield / 100 / 12),
    annual: tokenQuantity * property?.tokenPrice * (property?.expectedReturn / 100)
  };

  return (
    <>
      <div className="bg-card rounded-lg p-6 shadow-elevation-2 sticky top-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Token Price</span>
            <span className="text-lg font-bold text-foreground">${property?.tokenPrice}</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Available Tokens</span>
            <span className="text-sm font-medium text-foreground">
              {property?.availableTokens?.toLocaleString()}
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div 
              className="bg-primary h-2 rounded-full"
              style={{ 
                width: `${((property?.totalTokens - property?.availableTokens) / property?.totalTokens) * 100}%` 
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {(((property?.totalTokens - property?.availableTokens) / property?.totalTokens) * 100)?.toFixed(1)}% funded
          </div>
        </div>

        {/* Investment Calculator */}
        <div className="space-y-4 mb-6">
          <Input
            label="Investment Amount ($)"
            type="number"
            placeholder="Enter amount"
            value={investmentAmount}
            onChange={handleAmountChange}
            min={property?.minimumInvestment}
          />

          <Input
            label="Number of Tokens"
            type="number"
            placeholder="Enter tokens"
            value={tokenQuantity}
            onChange={handleTokenChange}
            max={property?.availableTokens}
          />

          {tokenQuantity > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Monthly Dividend</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(estimatedReturns?.monthly)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Annual Return</span>
                <span className="font-medium text-success">
                  {formatCurrency(estimatedReturns?.annual)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="default"
            size="lg"
            fullWidth
            iconName="ShoppingCart"
            iconPosition="left"
            onClick={handleInvest}
            disabled={tokenQuantity === 0 || tokenQuantity > property?.availableTokens}
          >
            Invest Now
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              iconName={isWatchlisted ? "Heart" : "Heart"}
              iconPosition="left"
              onClick={toggleWatchlist}
              className={isWatchlisted ? "text-error border-error" : ""}
            >
              {isWatchlisted ? "Saved" : "Watchlist"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              iconName="Share"
              iconPosition="left"
              onClick={() => console.log('Share property')}
            >
              Share
            </Button>
          </div>
        </div>

        {/* Key Information */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum Investment</span>
              <span className="font-medium text-foreground">
                {formatCurrency(property?.minimumInvestment)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expected Return</span>
              <span className="font-medium text-success">{property?.expectedReturn}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dividend Yield</span>
              <span className="font-medium text-foreground">{property?.dividendYield}%</span>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} className="text-success" />
              <span>SEC Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Lock" size={12} className="text-success" />
              <span>Blockchain Verified</span>
            </div>
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-500 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full shadow-elevation-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Icon name="ShoppingCart" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Confirm Investment</h3>
                <p className="text-sm text-muted-foreground">Review your investment details</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium text-foreground mb-2">{property?.name}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Investment Amount</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(parseFloat(investmentAmount))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Number of Tokens</span>
                    <span className="font-medium text-foreground">{tokenQuantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Token Price</span>
                    <span className="font-medium text-foreground">${property?.tokenPrice}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                By confirming this investment, you agree to the terms and conditions outlined in the investment prospectus.
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                fullWidth
                onClick={confirmInvestment}
              >
                Confirm Investment
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestmentPanel;