import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LegalDocuments = ({ property }) => {
  const [downloadingDoc, setDownloadingDoc] = useState(null);

  const documents = [
    {
      id: 'prospectus',
      name: 'Investment Prospectus',
      description: 'Comprehensive investment overview and risk disclosures',
      type: 'PDF',
      size: '2.4 MB',
      lastUpdated: '2024-01-15',
      icon: 'FileText',
      required: true
    },
    {
      id: 'operating-agreement',
      name: 'Operating Agreement',
      description: 'Legal structure and investor rights documentation',
      type: 'PDF',
      size: '1.8 MB',
      lastUpdated: '2024-01-10',
      icon: 'Scale',
      required: true
    },
    {
      id: 'property-deed',
      name: 'Property Deed',
      description: 'Official property ownership documentation',
      type: 'PDF',
      size: '0.9 MB',
      lastUpdated: '2023-12-20',
      icon: 'Home',
      required: false
    },
    {
      id: 'inspection-report',
      name: 'Property Inspection Report',
      description: 'Professional property condition assessment',
      type: 'PDF',
      size: '3.2 MB',
      lastUpdated: '2024-01-05',
      icon: 'Search',
      required: false
    },
    {
      id: 'appraisal',
      name: 'Property Appraisal',
      description: 'Independent property valuation report',
      type: 'PDF',
      size: '1.5 MB',
      lastUpdated: '2023-12-28',
      icon: 'Calculator',
      required: false
    },
    {
      id: 'insurance-policy',
      name: 'Insurance Policy',
      description: 'Property insurance coverage details',
      type: 'PDF',
      size: '0.7 MB',
      lastUpdated: '2024-01-01',
      icon: 'Shield',
      required: false
    }
  ];

  const handleDownload = async (docId, docName) => {
    setDownloadingDoc(docId);
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would trigger the actual download
    console.log(`Downloading ${docName}`);
    
    setDownloadingDoc(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const requiredDocs = documents?.filter(doc => doc?.required);
  const optionalDocs = documents?.filter(doc => !doc?.required);

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Legal Documents</h3>
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
          onClick={() => console.log('Download all documents')}
        >
          Download All
        </Button>
      </div>
      {/* Required Documents */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="AlertCircle" size={16} className="text-warning" />
          <h4 className="text-md font-medium text-foreground">Required Documents</h4>
        </div>
        
        <div className="space-y-3">
          {requiredDocs?.map((doc) => (
            <div key={doc?.id} className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
                  <Icon name={doc?.icon} size={18} className="text-warning" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{doc?.name}</div>
                  <div className="text-xs text-muted-foreground">{doc?.description}</div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-muted-foreground">{doc?.type} • {doc?.size}</span>
                    <span className="text-xs text-muted-foreground">Updated {formatDate(doc?.lastUpdated)}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                loading={downloadingDoc === doc?.id}
                onClick={() => handleDownload(doc?.id, doc?.name)}
              >
                {downloadingDoc === doc?.id ? 'Downloading...' : 'Download'}
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Optional Documents */}
      <div>
        <h4 className="text-md font-medium text-foreground mb-4">Additional Documents</h4>
        
        <div className="space-y-3">
          {optionalDocs?.map((doc) => (
            <div key={doc?.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Icon name={doc?.icon} size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{doc?.name}</div>
                  <div className="text-xs text-muted-foreground">{doc?.description}</div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-muted-foreground">{doc?.type} • {doc?.size}</span>
                    <span className="text-xs text-muted-foreground">Updated {formatDate(doc?.lastUpdated)}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                loading={downloadingDoc === doc?.id}
                onClick={() => handleDownload(doc?.id, doc?.name)}
              >
                {downloadingDoc === doc?.id ? 'Downloading...' : 'Download'}
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Legal Disclaimer */}
      <div className="mt-6 p-4 bg-muted/30 border border-border rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <strong>Legal Disclaimer:</strong> These documents contain important information about the investment opportunity, including risks and fees. Please read all documents carefully before investing. Past performance does not guarantee future results.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDocuments;