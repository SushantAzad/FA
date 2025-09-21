import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'Bank-level encryption',
      color: 'text-success'
    },
    {
      icon: 'CheckCircle',
      title: 'SEC Compliant',
      description: 'Regulatory approved',
      color: 'text-primary'
    },
    {
      icon: 'Lock',
      title: 'Blockchain Verified',
      description: 'Smart contract audited',
      color: 'text-accent'
    }
  ];

  const securityFeatures = [
    'Multi-signature wallet security',
    'Real-time fraud monitoring',
    'GDPR compliant data handling',
    'Insurance coverage up to $500K'
  ];

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustBadges?.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-4 bg-card border border-border rounded-lg shadow-elevation-1"
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-current/10 mb-3 ${badge?.color}`}>
              <Icon name={badge?.icon} size={24} className={badge?.color} />
            </div>
            <div className="text-sm font-semibold text-foreground mb-1">
              {badge?.title}
            </div>
            <div className="text-xs text-muted-foreground">
              {badge?.description}
            </div>
          </div>
        ))}
      </div>
      {/* Security Features */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="ShieldCheck" size={20} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Security Features
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Regulatory Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Scale" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-primary mb-1">
              Regulatory Compliance
            </div>
            <div className="text-xs text-primary/80 leading-relaxed">
              FractionalAsset operates under strict regulatory oversight and maintains compliance with securities laws. All investments are subject to regulatory protections and investor safeguards.
            </div>
          </div>
        </div>
      </div>
      {/* Contact Support */}
      <div className="text-center pt-2">
        <div className="text-xs text-muted-foreground mb-2">
          Need help with authentication?
        </div>
        <button className="inline-flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-smooth duration-150">
          <Icon name="MessageCircle" size={14} />
          <span>Contact Support</span>
        </button>
      </div>
    </div>
  );
};

export default TrustSignals;