import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SellTokensModal = ({ isOpen, onClose, holding, onSellTokens }) => {
  const [sellAmount, setSellAmount] = useState('');
  const [sellType, setSellType] = useState('tokens'); // 'tokens' or 'value'
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!holding) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })?.format(value);
  };

  const calculateSellDetails = () => {
    let tokensToSell = 0;
    let valueToReceive = 0;
    
    if (sellType === 'tokens') {
      tokensToSell = parseInt(sellAmount) || 0;
      valueToReceive = tokensToSell * holding?.pricePerToken;
    } else {
      valueToReceive = parseFloat(sellAmount) || 0;
      tokensToSell = Math.floor(valueToReceive / holding?.pricePerToken);
      valueToReceive = tokensToSell * holding?.pricePerToken; // Recalculate for exact amount
    }
    
    const fees = valueToReceive * 0.025; // 2.5% transaction fee
    const netAmount = valueToReceive - fees;
    const remainingTokens = holding?.tokens - tokensToSell;
    const remainingValue = remainingTokens * holding?.pricePerToken;
    
    return {
      tokensToSell,
      valueToReceive,
      fees,
      netAmount,
      remainingTokens,
      remainingValue,
      isValid: tokensToSell > 0 && tokensToSell <= holding?.tokens
    };
  };

  const sellDetails = calculateSellDetails();

  const handleSell = async () => {
    if (!sellDetails?.isValid) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onSellTokens({
        holdingId: holding?.id,
        tokensToSell: sellDetails?.tokensToSell,
        netAmount: sellDetails?.netAmount
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Sell transaction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSellAmount('');
    setSellType('tokens');
    setShowConfirmation(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const setQuickAmount = (percentage) => {
    let tokensToSell = Math.floor(holding?.tokens * (percentage / 100));
    setSellAmount(tokensToSell?.toString());
    setSellType('tokens');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-4 w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Sell Tokens</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {holding?.name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {!showConfirmation ? (
            <div className="space-y-6">
              {/* Property Info */}
              <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
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
                  <div className="text-sm text-muted-foreground">{holding?.location}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {holding?.tokens?.toLocaleString()} tokens • {formatCurrency(holding?.pricePerToken)}/token
                  </div>
                </div>
              </div>

              {/* Sell Type Toggle */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Sell by
                </label>
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setSellType('tokens')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-colors ${
                      sellType === 'tokens' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Number of Tokens
                  </button>
                  <button
                    onClick={() => setSellType('value')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-colors ${
                      sellType === 'value' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Dollar Value
                  </button>
                </div>
              </div>

              {/* Sell Amount Input */}
              <div>
                <Input
                  label={sellType === 'tokens' ? 'Number of Tokens' : 'Dollar Amount'}
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e?.target?.value)}
                  placeholder={sellType === 'tokens' ? 'Enter number of tokens' : 'Enter dollar amount'}
                  error={sellAmount && !sellDetails?.isValid ? 'Invalid amount' : ''}
                />
                
                {/* Quick Selection Buttons */}
                <div className="flex space-x-2 mt-3">
                  {[25, 50, 75, 100]?.map(percentage => (
                    <button
                      key={percentage}
                      onClick={() => setQuickAmount(percentage)}
                      className="flex-1 py-2 px-3 text-xs font-medium bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded transition-colors"
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction Summary */}
              {sellAmount && sellDetails?.isValid && (
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-foreground">Transaction Summary</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tokens to sell</span>
                      <span className="font-medium text-foreground">
                        {sellDetails?.tokensToSell?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross amount</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(sellDetails?.valueToReceive)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction fee (2.5%)</span>
                      <span className="font-medium text-error">
                        -{formatCurrency(sellDetails?.fees)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-medium text-foreground">Net amount</span>
                      <span className="font-bold text-success">
                        {formatCurrency(sellDetails?.netAmount)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Remaining: {sellDetails?.remainingTokens?.toLocaleString()} tokens 
                      ({formatCurrency(sellDetails?.remainingValue)})
                    </div>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Important Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      Token sales are final and cannot be reversed. Market conditions may affect 
                      the final execution price. Processing may take 2-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Confirmation Summary */}
              <div className="text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="AlertTriangle" size={32} className="text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Confirm Sale</h3>
                <p className="text-muted-foreground">
                  You are about to sell {sellDetails?.tokensToSell?.toLocaleString()} tokens 
                  for {formatCurrency(sellDetails?.netAmount)}
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property</span>
                    <span className="font-medium text-foreground">{holding?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tokens to sell</span>
                    <span className="font-medium text-foreground">
                      {sellDetails?.tokensToSell?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net proceeds</span>
                    <span className="font-bold text-success">
                      {formatCurrency(sellDetails?.netAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {!showConfirmation ? (
            <Button
              variant="destructive"
              onClick={() => setShowConfirmation(true)}
              disabled={!sellAmount || !sellDetails?.isValid}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Review Sale
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleSell}
              loading={isProcessing}
              iconName="Check"
              iconPosition="left"
            >
              {isProcessing ? 'Processing...' : 'Confirm Sale'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellTokensModal;