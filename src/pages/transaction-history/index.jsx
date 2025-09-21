import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import NavigationBar from '../../components/ui/NavigationBar';
import WalletConnection from '../../components/ui/WalletConnection';
import UserProfile from '../../components/ui/UserProfile';
import TransactionFilters from './components/TransactionFilters';
import TransactionTable from './components/TransactionTable';
import TransactionSummary from './components/TransactionSummary';
import TransactionModal from './components/TransactionModal';
import PaginationControls from './components/PaginationControls';



const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);

  // Mock transaction data
  const mockTransactions = [
    {
      id: 'TXN-2024-001',
      date: new Date('2024-01-15T10:30:00'),
      property: 'Manhattan Tower',
      propertyAddress: '123 Broadway, New York, NY',
      type: 'buy',
      amount: 5000.00,
      tokens: 50,
      fees: 25.00,
      status: 'completed',
      blockchainHash: '0x1234567890abcdef1234567890abcdef12345678',
      blockNumber: 18500000,
      confirmations: 142,
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      paymentMethod: 'MetaMask Wallet',
      notes: 'Initial investment in Manhattan Tower property'
    },
    {
      id: 'TXN-2024-002',
      date: new Date('2024-01-20T14:15:00'),
      property: 'Brooklyn Heights',
      propertyAddress: '456 Heights Ave, Brooklyn, NY',
      type: 'dividend',
      amount: 125.50,
      tokens: null,
      fees: 2.50,
      status: 'completed',
      blockchainHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      blockNumber: 18520000,
      confirmations: 89,
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      paymentMethod: 'Automatic Distribution'
    },
    {
      id: 'TXN-2024-003',
      date: new Date('2024-01-25T09:45:00'),
      property: 'Queens Plaza',
      propertyAddress: '789 Plaza St, Queens, NY',
      type: 'buy',
      amount: 2500.00,
      tokens: 25,
      fees: 12.50,
      status: 'pending',
      blockchainHash: '0x567890abcdef1234567890abcdef1234567890ab',
      blockNumber: null,
      confirmations: 0,
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      paymentMethod: 'MetaMask Wallet'
    },
    {
      id: 'TXN-2024-004',
      date: new Date('2024-01-28T16:20:00'),
      property: 'Bronx Residential',
      propertyAddress: '321 Residential Blvd, Bronx, NY',
      type: 'sell',
      amount: 1500.00,
      tokens: 15,
      fees: 7.50,
      status: 'failed',
      blockchainHash: null,
      blockNumber: null,
      confirmations: 0,
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      paymentMethod: 'MetaMask Wallet',
      notes: 'Transaction failed due to insufficient gas'
    },
    {
      id: 'TXN-2024-005',
      date: new Date('2024-02-01T11:10:00'),
      property: 'Staten Commercial',
      propertyAddress: '654 Commercial Dr, Staten Island, NY',
      type: 'fee',
      amount: 50.00,
      tokens: null,
      fees: 0.00,
      status: 'completed',
      blockchainHash: '0xcdef1234567890abcdef1234567890abcdef1234',
      blockNumber: 18550000,
      confirmations: 45,
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      paymentMethod: 'Automatic Deduction'
    },
    {
      id: 'TXN-2024-006',
      date: new Date('2024-02-05T13:30:00'),
      property: 'Manhattan Tower',
      propertyAddress: '123 Broadway, New York, NY',
      type: 'dividend',
      amount: 200.75,
      tokens: null,
      fees: 4.00,
      status: 'completed',
      blockchainHash: '0xef1234567890abcdef1234567890abcdef123456',
      blockNumber: 18570000,
      confirmations: 28,
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      paymentMethod: 'Automatic Distribution'
    },
    {
      id: 'TXN-2024-007',
      date: new Date('2024-02-10T08:45:00'),
      property: 'Brooklyn Heights',
      propertyAddress: '456 Heights Ave, Brooklyn, NY',
      type: 'buy',
      amount: 7500.00,
      tokens: 75,
      fees: 37.50,
      status: 'completed',
      blockchainHash: '0x234567890abcdef1234567890abcdef1234567890',
      blockNumber: 18590000,
      confirmations: 15,
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      paymentMethod: 'MetaMask Wallet'
    },
    {
      id: 'TXN-2024-008',
      date: new Date('2024-02-12T15:20:00'),
      property: 'Queens Plaza',
      propertyAddress: '789 Plaza St, Queens, NY',
      type: 'transfer',
      amount: 0.00,
      tokens: 10,
      fees: 5.00,
      status: 'pending',
      blockchainHash: null,
      blockNumber: null,
      confirmations: 0,
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      paymentMethod: 'Internal Transfer'
    }
  ];

  // Calculate summary data
  const summaryData = useMemo(() => {
    const completed = filteredTransactions?.filter(t => t?.status === 'completed');
    const totalVolume = completed?.reduce((sum, t) => sum + Math.abs(t?.amount), 0);
    const totalFees = filteredTransactions?.reduce((sum, t) => sum + t?.fees, 0);
    const purchases = completed?.filter(t => t?.type === 'buy');
    const sales = completed?.filter(t => t?.type === 'sell');
    const dividends = completed?.filter(t => t?.type === 'dividend');
    const fees = completed?.filter(t => t?.type === 'fee');
    
    const purchaseAmount = purchases?.reduce((sum, t) => sum + t?.amount, 0);
    const saleAmount = sales?.reduce((sum, t) => sum + t?.amount, 0);
    const dividendAmount = dividends?.reduce((sum, t) => sum + t?.amount, 0);
    const feeAmount = fees?.reduce((sum, t) => sum + t?.amount, 0);
    
    const netProfitLoss = saleAmount + dividendAmount - purchaseAmount - feeAmount;
    const successRate = (completed?.length / filteredTransactions?.length) * 100;
    
    const recentTransactions = filteredTransactions?.filter(t => 
      new Date(t.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    
    return {
      totalTransactions: filteredTransactions?.length,
      totalVolume,
      totalFees,
      netProfitLoss,
      averageTransaction: totalVolume / (completed?.length || 1),
      successRate: isNaN(successRate) ? 0 : successRate,
      totalProperties: [...new Set(filteredTransactions.map(t => t.property))]?.length,
      activeInvestments: [...new Set(purchases.map(t => t.property))]?.length,
      breakdown: {
        purchases: purchases?.length,
        purchaseAmount,
        sales: sales?.length,
        saleAmount,
        dividends: dividends?.length,
        dividendAmount,
        fees: fees?.length,
        feeAmount
      },
      recentActivity: {
        transactions: recentTransactions?.length,
        volume: recentTransactions?.reduce((sum, t) => sum + Math.abs(t?.amount), 0),
        profitLoss: recentTransactions?.reduce((sum, t) => {
          if (t?.type === 'sell' || t?.type === 'dividend') return sum + t?.amount;
          if (t?.type === 'buy' || t?.type === 'fee') return sum - t?.amount;
          return sum;
        }, 0)
      }
    };
  }, [filteredTransactions]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...mockTransactions];

    // Apply filters
    if (filters?.searchTerm) {
      const searchLower = filters?.searchTerm?.toLowerCase();
      filtered = filtered?.filter(t => 
        t?.property?.toLowerCase()?.includes(searchLower) ||
        t?.id?.toLowerCase()?.includes(searchLower) ||
        t?.type?.toLowerCase()?.includes(searchLower)
      );
    }

    if (filters?.transactionType && filters?.transactionType !== 'all') {
      filtered = filtered?.filter(t => t?.type === filters?.transactionType);
    }

    if (filters?.status && filters?.status !== 'all') {
      filtered = filtered?.filter(t => t?.status === filters?.status);
    }

    if (filters?.property && filters?.property !== 'all') {
      filtered = filtered?.filter(t => t?.property?.toLowerCase()?.replace(/\s+/g, '-') === filters?.property);
    }

    if (filters?.dateRange && filters?.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters?.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'custom':
          if (filters?.customStartDate) startDate = new Date(filters.customStartDate);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered?.filter(t => new Date(t.date) >= startDate);
      }
      
      if (filters?.dateRange === 'custom' && filters?.customEndDate) {
        const endDate = new Date(filters.customEndDate);
        endDate?.setHours(23, 59, 59, 999);
        filtered = filtered?.filter(t => new Date(t.date) <= endDate);
      }
    }

    if (filters?.amountMin) {
      filtered = filtered?.filter(t => Math.abs(t?.amount) >= parseFloat(filters?.amountMin));
    }

    if (filters?.amountMax) {
      filtered = filtered?.filter(t => Math.abs(t?.amount) <= parseFloat(filters?.amountMax));
    }

    // Apply sorting
    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (sortConfig?.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (sortConfig?.key === 'amount') {
          aValue = Math.abs(aValue);
          bValue = Math.abs(bValue);
        }

        if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [filters, sortConfig]);

  // Initialize data
  useEffect(() => {
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
    setIsLoading(false);
  }, []);

  // Pagination
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSort = (column) => {
    setSortConfig(prev => ({
      key: column,
      direction: prev?.key === column && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleExport = (format) => {
    console.log(`Exporting transactions as ${format}`);
    // Mock export functionality
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading transactions...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Transaction History - FractionalAsset</title>
        <meta name="description" content="View and manage your complete transaction history with advanced filtering and export capabilities." />
      </Helmet>
      <NavigationBar />
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
              <p className="text-muted-foreground mt-1">
                Track and analyze all your investment activities with comprehensive filtering and reporting
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <WalletConnection />
              <UserProfile />
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Section */}
        <TransactionSummary 
          summaryData={summaryData}
          onExport={handleExport}
        />

        {/* Filters */}
        <TransactionFilters
          onFiltersChange={handleFiltersChange}
          resultsCount={filteredTransactions?.length}
        />

        {/* Transaction Table */}
        <TransactionTable
          transactions={paginatedTransactions}
          onTransactionClick={handleTransactionClick}
          onSort={handleSort}
          sortConfig={sortConfig}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTransactions?.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </div>
      {/* Transaction Detail Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
};

export default TransactionHistory;