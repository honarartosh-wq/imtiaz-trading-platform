import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  LogOut,
  Settings,
  Bell,
  UserPlus,
  FileText,
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  FileDown,
  ArrowUpCircle,
  ArrowDownCircle,
  History,
  Clock,
  Eye,
  Printer,
  UserCog
} from 'lucide-react';
import {
  validateAmount,
  validateWithdrawal,
  updateLivePrices,
  formatTransactionMessage
} from '../../utils/managerHelpers';
import {
  getMarginLevelColor,
  getMarginLevelTextColor,
  getMarginLevelBgColor,
  getMarginLevelStatus,
  getTransactionColor,
  getTransactionBadgeColor,
  getTransactionAmountColor,
  filterByDateRange,
  calculateTradingStats,
  calculateDepositWithdrawalStats,
  getClientPositions,
  hasClientPositions,
  getClientTrades,
  hasClientTrades,
  getClientTransactions,
  hasClientTransactions
} from '../../utils/adminHelpers';
import { transactionService, TRANSACTION_STATUS, TRANSACTION_TYPE, INITIATOR_ROLE } from '../../services/transactionService';
import { printReceipt } from '../../utils/receiptGenerator';
import AdminReports from '../admin/AdminReports';
import AdminSettings from '../admin/AdminSettings';
import AdminUserManagement from '../admin/AdminUserManagement';
import AdminAuditLog from '../admin/AdminAuditLog';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showClientDetailsModal, setShowClientDetailsModal] = useState(false);
  const [showTransactionHistoryModal, setShowTransactionHistoryModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [depositData, setDepositData] = useState({ amount: '', method: 'cash', comment: '' });
  const [withdrawalData, setWithdrawalData] = useState({ amount: '', method: 'cash', comment: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'standard',
    initialBalance: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    dateOfBirth: '',
    idNumber: '',
    businessName: '',
    businessRegistration: '',
    taxId: ''
  });
  const [tradeData, setTradeData] = useState({
    product: 'EUR/USD',
    type: 'buy',
    volume: '',
    takeProfit: '',
    stopLoss: '',
    comment: ''
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDateRange, setExportDateRange] = useState({
    dateFrom: '',
    dateTo: ''
  });
  const [livePrices, setLivePrices] = useState({
    'EUR/USD': { bid: 1.08523, ask: 1.08536, change: 0.0023 },
    'GBP/USD': { bid: 1.26789, ask: 1.26802, change: -0.0015 },
    'USD/JPY': { bid: 149.875, ask: 149.888, change: 0.125 },
    'Gold': { bid: 2034.50, ask: 2034.80, change: 5.20 },
    'BTC/USD': { bid: 42850, ask: 42865, change: -125 },
    'EUR/GBP': { bid: 0.85632, ask: 0.85645, change: 0.0012 }
  });

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const allTransactions = transactionService.getAllTransactions();
    setTransactions(allTransactions);
    const stats = transactionService.getTransactionStats();
    setTransactionStats(stats);
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  // Pending transaction requests from clients
  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, clientId: 1, clientName: 'John Doe', account: 'CLT-001', type: 'deposit', amount: 5000, method: 'bank_transfer', comment: 'Initial capital injection', requestDate: '2025-11-27 10:30', status: 'pending' },
    { id: 2, clientId: 2, clientName: 'Jane Smith', account: 'CLT-002', type: 'withdrawal', amount: 2500, method: 'bank_transfer', comment: 'Profit withdrawal', requestDate: '2025-11-27 09:15', status: 'pending' },
    { id: 3, clientId: 3, clientName: 'Bob Johnson', account: 'CLT-003', type: 'deposit', amount: 15000, method: 'credit_card', comment: 'Account funding', requestDate: '2025-11-26 14:20', status: 'pending' },
    { id: 4, clientId: 4, clientName: 'Sarah Williams', account: 'CLT-004', type: 'withdrawal', amount: 3000, method: 'e_wallet', comment: 'Emergency withdrawal', requestDate: '2025-11-26 11:45', status: 'pending' }
  ]);

  const stats = {
    totalClients: 45,
    activeClients: 38,
    pendingKYC: 3,
    totalVolume: '$850,000',
    monthlyCommission: '$12,500',
    riskAlerts: 2,
    pendingRequests: pendingRequests.filter(r => r.status === 'pending').length
  };

  const clients = [
    {
      id: 1, name: 'John Doe', account: 'CLT-001', email: 'john@example.com', phone: '+1234567890',
      balance: 50000, equity: 51200, freeMargin: 48000, margin: 2000, marginLevel: 2560,
      leverage: '1:100', status: 'active', kyc: 'approved',
      branch: user.branchName || user.branch,
      accountType: 'standard', registeredDate: '2024-01-15',
      totalDeposits: 50000, totalWithdrawals: 0, totalTrades: 45, profitLoss: 1200
    },
    {
      id: 2, name: 'Jane Smith', account: 'CLT-002', email: 'jane@example.com', phone: '+1234567891',
      balance: 75000, equity: 76500, freeMargin: 72000, margin: 4500, marginLevel: 1700,
      leverage: '1:100', status: 'active', kyc: 'approved',
      branch: user.branchName || user.branch,
      accountType: 'business', registeredDate: '2024-02-20',
      totalDeposits: 75000, totalWithdrawals: 0, totalTrades: 62, profitLoss: 1500
    },
    {
      id: 3, name: 'Bob Wilson', account: 'CLT-003', email: 'bob@example.com', phone: '+1234567892',
      balance: 32000, equity: 31800, freeMargin: 28000, margin: 3800, marginLevel: 837,
      leverage: '1:50', status: 'active', kyc: 'pending',
      branch: user.branchName || user.branch,
      accountType: 'standard', registeredDate: '2024-03-10',
      totalDeposits: 32000, totalWithdrawals: 0, totalTrades: 28, profitLoss: -200
    },
    {
      id: 4, name: 'Alice Brown', account: 'CLT-004', email: 'alice@example.com', phone: '+1234567893',
      balance: 95000, equity: 96200, freeMargin: 90000, margin: 6200, marginLevel: 1551,
      leverage: '1:200', status: 'inactive', kyc: 'approved',
      branch: user.branchName || user.branch,
      accountType: 'standard', registeredDate: '2024-01-05',
      totalDeposits: 95000, totalWithdrawals: 0, totalTrades: 78, profitLoss: 1200
    }
  ];

  const openPositions = [
    { id: 1, clientId: 1, product: 'EUR/USD', type: 'buy', volume: 0.5, openPrice: 1.08500, currentPrice: 1.08536, profit: 180, openTime: '10:30 AM' },
    { id: 2, clientId: 1, product: 'Gold', type: 'buy', volume: 0.2, openPrice: 2030.00, currentPrice: 2034.50, profit: 900, openTime: '11:15 AM' },
    { id: 3, clientId: 2, product: 'GBP/USD', type: 'sell', volume: 1.0, openPrice: 1.26850, currentPrice: 1.26802, profit: 480, openTime: '09:45 AM' },
    { id: 4, clientId: 2, product: 'BTC/USD', type: 'buy', volume: 0.1, openPrice: 42500, currentPrice: 42850, profit: 3500, openTime: '08:20 AM' },
    { id: 5, clientId: 3, product: 'USD/JPY', type: 'buy', volume: 0.3, openPrice: 150.200, currentPrice: 149.875, profit: -975, openTime: '12:00 PM' }
  ];

  const tradeHistory = [
    { id: 1, clientId: 1, product: 'EUR/USD', type: 'buy', volume: 1.0, openPrice: 1.08200, closePrice: 1.08450, profit: 250, commission: 10, netProfit: 240, openTime: '2024-11-20 09:30', closeTime: '2024-11-20 14:15', duration: '4h 45m' },
    { id: 2, clientId: 1, product: 'Gold', type: 'sell', volume: 0.5, openPrice: 2035.00, closePrice: 2033.50, profit: 750, commission: 15, netProfit: 735, openTime: '2024-11-19 10:00', closeTime: '2024-11-19 16:30', duration: '6h 30m' },
    { id: 3, clientId: 1, product: 'BTC/USD', type: 'buy', volume: 0.05, openPrice: 42000, closePrice: 41850, profit: -750, commission: 20, netProfit: -770, openTime: '2024-11-18 11:20', closeTime: '2024-11-18 15:45', duration: '4h 25m' },
    { id: 4, clientId: 2, product: 'GBP/USD', type: 'buy', volume: 1.5, openPrice: 1.26500, closePrice: 1.26820, profit: 480, commission: 15, netProfit: 465, openTime: '2024-11-21 08:15', closeTime: '2024-11-21 13:00', duration: '4h 45m' },
    { id: 5, clientId: 2, product: 'EUR/GBP', type: 'sell', volume: 2.0, openPrice: 0.85700, closePrice: 0.85620, profit: 160, commission: 20, netProfit: 140, openTime: '2024-11-20 09:00', closeTime: '2024-11-20 11:30', duration: '2h 30m' },
    { id: 6, clientId: 2, product: 'USD/JPY', type: 'buy', volume: 0.8, openPrice: 149.500, closePrice: 149.850, profit: 280, commission: 8, netProfit: 272, openTime: '2024-11-19 10:30', closeTime: '2024-11-19 15:00', duration: '4h 30m' },
    { id: 7, clientId: 3, product: 'EUR/USD', type: 'sell', volume: 0.7, openPrice: 1.08600, closePrice: 1.08750, profit: -105, commission: 7, netProfit: -112, openTime: '2024-11-21 12:00', closeTime: '2024-11-21 16:15', duration: '4h 15m' },
    { id: 8, clientId: 3, product: 'Gold', type: 'buy', volume: 0.3, openPrice: 2031.00, closePrice: 2034.00, profit: 900, commission: 9, netProfit: 891, openTime: '2024-11-20 08:45', closeTime: '2024-11-20 14:00', duration: '5h 15m' },
    { id: 9, clientId: 4, product: 'BTC/USD', type: 'sell', volume: 0.08, openPrice: 43000, closePrice: 42800, profit: 1600, commission: 16, netProfit: 1584, openTime: '2024-11-19 09:30', closeTime: '2024-11-19 17:00', duration: '7h 30m' },
    { id: 10, clientId: 4, product: 'EUR/USD', type: 'buy', volume: 1.2, openPrice: 1.08100, closePrice: 1.08350, profit: 300, commission: 12, netProfit: 288, openTime: '2024-11-18 10:15', closeTime: '2024-11-18 15:45', duration: '5h 30m' }
  ];

  const transactionHistory = [
    { id: 1, clientId: 1, type: 'deposit', amount: 25000, method: 'bank_transfer', status: 'completed', date: '2024-11-15 10:30', comment: 'Initial deposit' },
    { id: 2, clientId: 1, type: 'deposit', amount: 25000, method: 'bank_transfer', status: 'completed', date: '2024-11-18 14:20', comment: 'Additional funding' },
    { id: 3, clientId: 1, type: 'trade', amount: 250, method: 'trading', status: 'completed', date: '2024-11-20 14:15', comment: 'EUR/USD profit' },
    { id: 4, clientId: 2, type: 'deposit', amount: 50000, method: 'credit_card', status: 'completed', date: '2024-11-10 09:15', comment: 'Business account funding' },
    { id: 5, clientId: 2, type: 'deposit', amount: 25000, method: 'bank_transfer', status: 'completed', date: '2024-11-16 11:00', comment: 'Additional capital' },
    { id: 6, clientId: 2, type: 'trade', amount: 480, method: 'trading', status: 'completed', date: '2024-11-21 13:00', comment: 'GBP/USD profit' },
    { id: 7, clientId: 3, type: 'deposit', amount: 32000, method: 'bank_transfer', status: 'completed', date: '2024-11-12 15:45', comment: 'Account opening' },
    { id: 8, clientId: 3, type: 'trade', amount: -105, method: 'trading', status: 'completed', date: '2024-11-21 16:15', comment: 'EUR/USD loss' },
    { id: 9, clientId: 4, type: 'deposit', amount: 95000, method: 'bank_transfer', status: 'completed', date: '2024-11-08 13:20', comment: 'Large account opening' },
    { id: 10, clientId: 4, type: 'withdrawal', amount: 5000, method: 'bank_transfer', status: 'completed', date: '2024-11-22 10:00', comment: 'Partial withdrawal' }
  ];

  const recentTrades = [
    { id: 1, client: 'John Doe', pair: 'EUR/USD', type: 'Buy', amount: '$5,000', profit: '+$250', time: '10:30 AM' },
    { id: 2, client: 'Jane Smith', pair: 'GBP/USD', type: 'Sell', amount: '$8,000', profit: '+$480', time: '11:15 AM' },
    { id: 3, client: 'Bob Wilson', pair: 'USD/JPY', type: 'Buy', amount: '$3,500', profit: '-$120', time: '12:45 PM' }
  ];

  const kycPending = [
    { id: 1, name: 'Bob Wilson', account: 'CLT-003', submitted: '2 days ago', documents: 3 },
    { id: 2, name: 'Charlie Davis', account: 'CLT-005', submitted: '5 days ago', documents: 2 },
    { id: 3, name: 'Eva Martinez', account: 'CLT-006', submitted: '1 week ago', documents: 4 }
  ];

  const handleClientInputChange = (field, value) => {
    setNewClient(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenTradeModal = (client) => {
    setSelectedClient(client);
    setShowTradeModal(true);
    // Simulate live price updates
    const priceInterval = setInterval(() => {
      setLivePrices(prev => updateLivePrices(prev));
    }, 2000);
    globalThis.tradePriceInterval = priceInterval;
  };

  const handleTradeInputChange = (field, value) => {
    setTradeData(prev => ({ ...prev, [field]: value }));
  };

  const handleExecuteTrade = () => {
    const validation = validateAmount(tradeData.volume);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const price = livePrices[tradeData.product];
    const executionPrice = tradeData.type === 'buy' ? price.ask : price.bid;

    const message = formatTransactionMessage('trade', {
      clientName: selectedClient.name,
      product: tradeData.product,
      tradeType: tradeData.type.toUpperCase(),
      volume: tradeData.volume,
      price: executionPrice,
      takeProfit: tradeData.takeProfit,
      stopLoss: tradeData.stopLoss
    });
    alert(message);

    // Clear interval and reset
    if (globalThis.tradePriceInterval) {
      clearInterval(globalThis.tradePriceInterval);
    }

    setShowTradeModal(false);
    setSelectedClient(null);
    setTradeData({
      product: 'EUR/USD',
      type: 'buy',
      volume: '',
      takeProfit: '',
      stopLoss: '',
      comment: ''
    });
  };

  const handleOpenDepositModal = (client) => {
    setSelectedClient(client);
    setShowDepositModal(true);
  };

  const handleExecuteDeposit = () => {
    const validation = validateAmount(depositData.amount);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      // Create transaction using the professional transaction service
      const transaction = transactionService.createTransaction({
        type: TRANSACTION_TYPE.DEPOSIT,
        amount: depositData.amount,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientAccount: selectedClient.account,
        paymentMethod: depositData.method,
        comment: depositData.comment,
        initiatedBy: user.id,
        initiatorRole: INITIATOR_ROLE.ADMIN,
        initiatorName: user.name,
        branch: user.branchName || user.branch
      });

      // Reload transactions
      loadTransactions();

      alert(`✅ Deposit Transaction Created!

Transaction ID: ${transaction.id}
Client: ${selectedClient.name}
Amount: $${Number.parseFloat(depositData.amount).toLocaleString()}
Status: Pending Manager Approval

The transaction has been created and is awaiting manager approval.`);

      setShowDepositModal(false);
      setSelectedClient(null);
      setDepositData({ amount: '', method: 'cash', comment: '' });
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleOpenWithdrawalModal = (client) => {
    setSelectedClient(client);
    setShowWithdrawalModal(true);
  };

  const handleExecuteWithdrawal = () => {
    const validation = validateWithdrawal(withdrawalData.amount, selectedClient.balance);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      // Create transaction using the professional transaction service
      const transaction = transactionService.createTransaction({
        type: TRANSACTION_TYPE.WITHDRAWAL,
        amount: withdrawalData.amount,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientAccount: selectedClient.account,
        paymentMethod: withdrawalData.method,
        comment: withdrawalData.comment,
        initiatedBy: user.id,
        initiatorRole: INITIATOR_ROLE.ADMIN,
        initiatorName: user.name,
        branch: user.branchName || user.branch
      });

      // Reload transactions
      loadTransactions();

      alert(`✅ Withdrawal Transaction Created!

Transaction ID: ${transaction.id}
Client: ${selectedClient.name}
Amount: $${Number.parseFloat(withdrawalData.amount).toLocaleString()}
Status: Pending Manager Approval

The transaction has been created and is awaiting manager approval.`);

      setShowWithdrawalModal(false);
      setSelectedClient(null);
      setWithdrawalData({ amount: '', method: 'cash', comment: '' });
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleViewTransactionHistory = () => {
    setShowTransactionHistoryModal(true);
  };

  const handleViewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handlePrintReceipt = (transaction) => {
    printReceipt(transaction, {
      name: user.branchName || user.branch,
      address: ''
    });
  };

  const handleOpenClientDetails = (client) => {
    setSelectedClient(client);
    setShowClientDetailsModal(true);
  };

  const handleApproveRequest = (request) => {
    if (globalThis.confirm(`Approve ${request.type} request of $${request.amount.toLocaleString()} for ${request.clientName}?`)) {
      alert(`Request Approved!

Client: ${request.clientName}
Type: ${request.type.toUpperCase()}
Amount: $${request.amount.toLocaleString()}

The transaction has been approved and sent to the Manager for final processing.`);

      // Transaction approved and sent to Manager for final processing

      // Remove from pending list
      setPendingRequests(pendingRequests.filter(r => r.id !== request.id));
    }
  };

  const handleRejectRequest = (request) => {
    const reason = prompt(`Enter reason for rejecting this ${request.type} request:`);
    if (reason) {
      alert(`Request Rejected!

Client: ${request.clientName}
Type: ${request.type.toUpperCase()}
Amount: $${request.amount.toLocaleString()}
Reason: ${reason}

The client will be notified of the rejection.`);

      // Transaction rejected, client will be notified

      // Remove from pending list
      setPendingRequests(pendingRequests.filter(r => r.id !== request.id));
    }
  };

  const handleOpenExportModal = (client) => {
    setSelectedClient(client);
    // Set default dates: last 30 days to today
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setExportDateRange({
      dateFrom: thirtyDaysAgo.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0]
    });
    setShowExportModal(true);
  };

  const handleExportClientReport = (client, dateFrom, dateTo) => {
    // Filter by date range
    const clientTrades = filterByDateRange(
      tradeHistory.filter(t => t.clientId === client.id),
      dateFrom,
      dateTo
    );

    const clientTransactions = filterByDateRange(
      transactionHistory.filter(t => t.clientId === client.id),
      dateFrom,
      dateTo
    );

    const clientPositions = openPositions.filter(p => p.clientId === client.id);

    // Calculate statistics using helpers
    const tradingStats = calculateTradingStats(clientTrades);
    const depositStats = calculateDepositWithdrawalStats(clientTransactions);

    const { totalProfit, totalCommission, totalNetProfit, winRate, avgTrade, profitFactor } = tradingStats;
    const { totalDeposits, totalWithdrawals } = depositStats;

    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Client Report - ${client.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
          .header h1 { color: #1e293b; margin: 0; font-size: 32px; }
          .header p { color: #64748b; margin: 5px 0; }
          .section { margin: 30px 0; }
          .section-title { background: #2563eb; color: white; padding: 12px 20px; margin-bottom: 15px; font-size: 18px; font-weight: bold; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
          .info-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; background: #f8fafc; }
          .info-label { color: #64748b; font-size: 13px; margin-bottom: 5px; }
          .info-value { color: #1e293b; font-size: 18px; font-weight: bold; }
          .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
          .metric-card { border: 1px solid #e2e8f0; padding: 15px; text-align: center; border-radius: 8px; }
          .metric-label { color: #64748b; font-size: 12px; margin-bottom: 8px; }
          .metric-value { font-size: 24px; font-weight: bold; }
          .positive { color: #10b981; }
          .negative { color: #ef4444; }
          .neutral { color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f1f5f9; color: #475569; padding: 12px; text-align: left; font-size: 13px; border-bottom: 2px solid #e2e8f0; }
          td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px; }
          tr:hover { background: #f8fafc; }
          .badge { padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; display: inline-block; }
          .badge-buy { background: #dcfce7; color: #16a34a; }
          .badge-sell { background: #fee2e2; color: #dc2626; }
          .badge-deposit { background: #dbeafe; color: #2563eb; }
          .badge-withdrawal { background: #fed7aa; color: #ea580c; }
          .badge-trade { background: #e9d5ff; color: #9333ea; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
          @media print { body { padding: 0; background: white; } .container { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Client Account Report</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p>Branch: ${client.branch}</p>
            ${dateFrom && dateTo ? `<p style="color: #2563eb; font-weight: bold;">Report Period: ${new Date(dateFrom).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} - ${new Date(dateTo).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Client Information</div>
            <div class="info-grid">
              <div class="info-card">
                <div class="info-label">Client Name</div>
                <div class="info-value">${client.name}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Account Number</div>
                <div class="info-value">${client.account}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Email</div>
                <div class="info-value" style="font-size: 14px;">${client.email}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Phone</div>
                <div class="info-value" style="font-size: 14px;">${client.phone}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Account Type</div>
                <div class="info-value" style="text-transform: capitalize;">${client.accountType}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Registration Date</div>
                <div class="info-value" style="font-size: 14px;">${client.registeredDate}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Leverage</div>
                <div class="info-value">${client.leverage}</div>
              </div>
              <div class="info-card">
                <div class="info-label">KYC Status</div>
                <div class="info-value" style="text-transform: capitalize; color: ${client.kyc === 'approved' ? '#10b981' : '#f59e0b'};">${client.kyc}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Account Metrics</div>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-label">Balance</div>
                <div class="metric-value neutral">$${client.balance.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Equity</div>
                <div class="metric-value ${client.equity >= client.balance ? 'positive' : 'negative'}">$${client.equity.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Free Margin</div>
                <div class="metric-value neutral">$${client.freeMargin.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Margin Level</div>
                <div class="metric-value ${getMarginLevelColor(client.marginLevel)}">${client.marginLevel.toFixed(2)}%</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Trading Summary</div>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-label">Total Trades</div>
                <div class="metric-value neutral">${clientTrades.length}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Open Positions</div>
                <div class="metric-value neutral">${clientPositions.length}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Gross Profit/Loss</div>
                <div class="metric-value ${totalProfit >= 0 ? 'positive' : 'negative'}">${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Total Commission</div>
                <div class="metric-value" style="color: #ea580c;">-$${totalCommission.toFixed(2)}</div>
              </div>
            </div>
            <div class="metrics-grid" style="margin-top: 15px;">
              <div class="metric-card">
                <div class="metric-label">Net Profit/Loss</div>
                <div class="metric-value ${totalNetProfit >= 0 ? 'positive' : 'negative'}">${totalNetProfit >= 0 ? '+' : ''}$${totalNetProfit.toFixed(2)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Win Rate</div>
                <div class="metric-value neutral">${winRate}%</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Average Trade</div>
                <div class="metric-value ${totalNetProfit >= 0 ? 'positive' : 'negative'}">$${avgTrade}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Profit Factor</div>
                <div class="metric-value neutral">${profitFactor}</div>
              </div>
            </div>
          </div>

          ${clientPositions.length > 0 ? `
          <div class="section">
            <div class="section-title">Open Positions</div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Volume</th>
                  <th>Open Price</th>
                  <th>Current Price</th>
                  <th>Profit/Loss</th>
                  <th>Open Time</th>
                </tr>
              </thead>
              <tbody>
                ${clientPositions.map(pos => `
                  <tr>
                    <td style="font-weight: bold;">${pos.product}</td>
                    <td><span class="badge badge-${pos.type}">${pos.type.toUpperCase()}</span></td>
                    <td>${pos.volume} lots</td>
                    <td>${pos.openPrice}</td>
                    <td>${pos.currentPrice}</td>
                    <td style="font-weight: bold; color: ${pos.profit >= 0 ? '#10b981' : '#ef4444'};">${pos.profit >= 0 ? '+' : ''}$${pos.profit.toFixed(2)}</td>
                    <td>${pos.openTime}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Trading History (Last ${clientTrades.length} Trades)</div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Volume</th>
                  <th>Open Price</th>
                  <th>Close Price</th>
                  <th>Gross P/L</th>
                  <th>Commission</th>
                  <th>Net P/L</th>
                  <th>Duration</th>
                  <th>Close Date</th>
                </tr>
              </thead>
              <tbody>
                ${clientTrades.map(trade => `
                  <tr>
                    <td style="font-weight: bold;">${trade.product}</td>
                    <td><span class="badge badge-${trade.type}">${trade.type.toUpperCase()}</span></td>
                    <td>${trade.volume} lots</td>
                    <td>${trade.openPrice}</td>
                    <td>${trade.closePrice}</td>
                    <td style="font-weight: bold; color: ${trade.profit >= 0 ? '#10b981' : '#ef4444'};">${trade.profit >= 0 ? '+' : ''}$${trade.profit.toFixed(2)}</td>
                    <td style="color: #ea580c;">-$${trade.commission.toFixed(2)}</td>
                    <td style="font-weight: bold; color: ${trade.netProfit >= 0 ? '#10b981' : '#ef4444'};">${trade.netProfit >= 0 ? '+' : ''}$${trade.netProfit.toFixed(2)}</td>
                    <td>${trade.duration}</td>
                    <td>${trade.closeTime}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Transaction History</div>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-label">Total Deposits</div>
                <div class="metric-value positive">$${totalDeposits.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Total Withdrawals</div>
                <div class="metric-value" style="color: #ea580c;">$${totalWithdrawals.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Net Deposits</div>
                <div class="metric-value neutral">$${(totalDeposits - totalWithdrawals).toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Transactions</div>
                <div class="metric-value neutral">${clientTransactions.length}</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                ${clientTransactions.map(transaction => `
                  <tr>
                    <td>${transaction.date}</td>
                    <td><span class="badge badge-${transaction.type}">${transaction.type.toUpperCase()}</span></td>
                    <td style="font-weight: bold; color: ${getTransactionColor(transaction.type, transaction.amount)};">${transaction.amount >= 0 ? '+' : ''}$${transaction.amount.toLocaleString()}</td>
                    <td style="text-transform: capitalize;">${transaction.method.replace('_', ' ')}</td>
                    <td style="text-transform: capitalize; color: #10b981;">${transaction.status}</td>
                    <td>${transaction.comment}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p><strong>Imtiaz Trading Platform</strong></p>
            <p>This report is confidential and intended solely for the named client.</p>
            <p>Generated by ${user.name} (${user.role}) from ${user.branchName || user.branch}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);

    setShowExportModal(false);
  };

  const handleAddClient = () => {
    // Validate required fields
    if (!newClient.name || !newClient.email || !newClient.phone || !newClient.password || !newClient.confirmPassword || !newClient.initialBalance) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate password match
    if (newClient.password !== newClient.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate password strength
    if (newClient.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (newClient.accountType === 'business' && (!newClient.businessName || !newClient.businessRegistration)) {
      alert('Please fill in all business account details');
      return;
    }

    // Generate account number
    const accountNumber = `CLT-${String(clients.length + 1).padStart(3, '0')}`;

    // New client created by admin with pending KYC status

    alert(`Client ${newClient.name} created successfully!\nAccount Number: ${accountNumber}\nEmail: ${newClient.email}\nPassword has been set by admin.`);

    // Reset form and close modal
    setNewClient({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      accountType: 'standard',
      initialBalance: '',
      address: '',
      city: '',
      country: '',
      zipCode: '',
      dateOfBirth: '',
      idNumber: '',
      businessName: '',
      businessRegistration: '',
      taxId: ''
    });
    setShowAddClientModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.branchLogo && (
                <img
                  src={user.branchLogo}
                  alt={user.branchName || user.branch}
                  className="h-12 w-12 object-contain bg-white rounded p-1"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400 text-sm">
                  {user.name} • {user.branchName || user.branch}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'clients'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Clients
              </div>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Pending Requests
                {stats.pendingRequests > 0 && (
                  <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                    {stats.pendingRequests}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('kyc')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'kyc'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                KYC/AML
                {stats.pendingKYC > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {stats.pendingKYC}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('clientTracking')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'clientTracking'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Client Tracking
              </div>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Transactions
                {transactionStats && transactionStats.pending > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {transactionStats.pending}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Reports
              </div>
            </button>
            <button
              onClick={() => setActiveTab('adminUsers')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'adminUsers'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </div>
            </button>
            <button
              onClick={() => setActiveTab('auditLog')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'auditLog'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Audit Log
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Total Clients</h3>
                  <Users className="text-blue-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
                <p className="text-gray-400 text-sm mt-2">{stats.activeClients} active</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Pending KYC</h3>
                  <FileText className="text-yellow-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.pendingKYC}</p>
                <p className="text-yellow-400 text-sm mt-2">Requires review</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Total Volume</h3>
                  <DollarSign className="text-green-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalVolume}</p>
                <p className="text-green-400 text-sm mt-2">This month</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Commission Earned</h3>
                  <TrendingUp className="text-purple-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.monthlyCommission}</p>
                <p className="text-green-400 text-sm mt-2">+15% from last month</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Risk Alerts</h3>
                  <AlertTriangle className="text-red-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.riskAlerts}</p>
                <p className="text-red-400 text-sm mt-2">Requires attention</p>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Recent Trades</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Client</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Pair</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Type</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Amount</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">P&L</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrades.map(trade => (
                      <tr key={trade.id} className="border-b border-gray-700">
                        <td className="py-3 text-white">{trade.client}</td>
                        <td className="py-3 text-white">{trade.pair}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            trade.type === 'Buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="py-3 text-white">{trade.amount}</td>
                        <td className={`py-3 font-semibold ${
                          trade.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.profit}
                        </td>
                        <td className="py-3 text-gray-400">{trade.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Client Management</h2>
              <button
                onClick={() => setShowAddClientModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Client
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Name</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Account</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Balance</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Status</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">KYC</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.id} className="border-t border-gray-700">
                      <td className="py-4 px-6 text-white">{client.name}</td>
                      <td className="py-4 px-6 text-gray-400">{client.account}</td>
                      <td className="py-4 px-6 text-white font-semibold">${client.balance.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs ${
                          client.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`flex items-center gap-1 text-sm ${
                          client.kyc === 'approved' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {client.kyc === 'approved' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          {client.kyc}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleOpenClientDetails(client)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Pending Transaction Requests</h2>
              <div className="text-sm text-gray-400">
                {stats.pendingRequests} pending request{stats.pendingRequests !== 1 ? 's' : ''}
              </div>
            </div>

            {pendingRequests.length > 0 ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Client</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Type</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Amount</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Method</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Comment</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Requested</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map(request => (
                      <tr key={request.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-white font-semibold">{request.clientName}</p>
                            <p className="text-gray-400 text-sm">{request.account}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded text-xs font-medium capitalize ${
                            request.type === 'deposit'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {request.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-white font-bold text-lg">
                          ${request.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-gray-400 capitalize">
                          {request.method.replace('_', ' ')}
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-sm max-w-xs truncate">
                          {request.comment || '-'}
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-sm">
                          {request.requestDate}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveRequest(request)}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request)}
                              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
                <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Pending Requests</h3>
                <p className="text-gray-400">All transaction requests have been processed</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">KYC/AML Verification</h2>

            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pending Reviews</h3>
              <div className="space-y-4">
                {kycPending.map(item => (
                  <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold">{item.name}</h4>
                        <p className="text-gray-400 text-sm">Account: {item.account}</p>
                        <p className="text-gray-400 text-sm">Submitted {item.submitted} • {item.documents} documents</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clientTracking' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Client Tracking & Management</h2>
            </div>

            {/* Search Bar */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by account number or client name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Client Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.filter(client => {
                const searchLower = searchTerm.toLowerCase();
                return client.name.toLowerCase().includes(searchLower) ||
                       client.account.toLowerCase().includes(searchLower);
              }).map(client => {
                const clientPositions = openPositions.filter(pos => pos.clientId === client.id);
                const totalProfit = clientPositions.reduce((sum, pos) => sum + pos.profit, 0);
                const marginLevelColor = getMarginLevelTextColor(client.marginLevel);

                return (
                  <div key={client.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500 transition-colors">
                    {/* Client Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg">{client.name}</h3>
                        <p className="text-gray-400 text-sm">{client.account}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                          client.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {client.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenClientDetails(client)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Details
                      </button>
                    </div>

                    {/* Account Metrics */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Balance</span>
                        <span className="text-white font-bold">${client.balance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Equity</span>
                        <span className={`font-bold ${client.equity >= client.balance ? 'text-green-400' : 'text-red-400'}`}>
                          ${client.equity.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Free Margin</span>
                        <span className="text-white font-semibold">${client.freeMargin.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Margin Level</span>
                        <span className={`font-bold ${marginLevelColor}`}>
                          {client.marginLevel.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Open Positions</span>
                        <span className="text-blue-400 font-semibold">{clientPositions.length}</span>
                      </div>
                      {clientPositions.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Floating P/L</span>
                          <span className={`font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        onClick={() => handleOpenDepositModal(client)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs transition-colors"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => handleOpenWithdrawalModal(client)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-xs transition-colors"
                      >
                        Withdraw
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {client.status === 'active' && (
                        <button
                          onClick={() => handleOpenTradeModal(client)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs transition-colors"
                        >
                          Trade
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenExportModal(client)}
                        className={`flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-xs transition-colors ${client.status !== 'active' ? 'col-span-2' : ''}`}
                      >
                        <FileDown className="w-3 h-3" />
                        Export
                      </button>
                    </div>

                    {/* Health Indicator */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getMarginLevelBgColor(client.marginLevel)}`}></div>
                        <span className="text-gray-400 text-xs">
                          {getMarginLevelStatus(client.marginLevel)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Open Positions Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">All Open Positions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Client</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Product</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Type</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Volume</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Open Price</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Current Price</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Profit/Loss</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Open Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openPositions.map(position => {
                      const client = clients.find(c => c.id === position.clientId);
                      return (
                        <tr key={position.id} className="border-b border-gray-700">
                          <td className="py-3 text-white">{client?.name}</td>
                          <td className="py-3 text-white font-semibold">{position.product}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              position.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {position.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 text-white">{position.volume} lots</td>
                          <td className="py-3 text-gray-400">{position.openPrice}</td>
                          <td className="py-3 text-white">{position.currentPrice}</td>
                          <td className={`py-3 font-bold ${
                            position.profit >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {position.profit >= 0 ? '+' : ''}${position.profit.toFixed(2)}
                          </td>
                          <td className="py-3 text-gray-400">{position.openTime}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Transaction Management</h2>
              <div className="text-sm text-gray-400">
                {transactions.length} total transaction{transactions.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Transaction Statistics */}
            {transactionStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">Pending Approval</div>
                  <div className="text-2xl font-bold text-yellow-400">{transactionStats.pending}</div>
                  <div className="text-sm text-gray-500 mt-1">${transactionStats.pendingAmount.toLocaleString()}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">Completed</div>
                  <div className="text-2xl font-bold text-green-400">{transactionStats.completed}</div>
                  <div className="text-sm text-gray-500 mt-1">Total Deposits: ${transactionStats.totalDeposits.toLocaleString()}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">Processing</div>
                  <div className="text-2xl font-bold text-blue-400">{transactionStats.processing + transactionStats.adminApproved + transactionStats.managerApproved}</div>
                  <div className="text-sm text-gray-500 mt-1">In workflow</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">Rejected/Failed</div>
                  <div className="text-2xl font-bold text-red-400">{transactionStats.rejected + transactionStats.failed}</div>
                  <div className="text-sm text-gray-500 mt-1">Needs review</div>
                </div>
              </div>
            )}

            {/* Transactions Table */}
            {transactions.length > 0 ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Transaction ID</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Client</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Type</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Amount</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Status</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Created</th>
                      <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => {
                      const getStatusBadgeClass = (status) => {
                        const statusClasses = {
                          'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                          'admin_approved': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                          'manager_approved': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                          'processing': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                          'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
                          'admin_rejected': 'bg-red-500/20 text-red-400 border-red-500/30',
                          'manager_rejected': 'bg-red-500/20 text-red-400 border-red-500/30',
                          'failed': 'bg-red-500/20 text-red-400 border-red-500/30'
                        };
                        return statusClasses[status] || 'bg-gray-500/20 text-gray-400';
                      };

                      const getStatusLabel = (status) => {
                        const labels = {
                          'pending': 'Pending',
                          'admin_approved': 'Admin Approved',
                          'manager_approved': 'Manager Approved',
                          'processing': 'Processing',
                          'completed': 'Completed',
                          'admin_rejected': 'Admin Rejected',
                          'manager_rejected': 'Manager Rejected',
                          'failed': 'Failed'
                        };
                        return labels[status] || status;
                      };

                      return (
                        <tr key={transaction.id} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="text-blue-400 font-mono text-sm">{transaction.id}</div>
                            {transaction.receiptNumber && (
                              <div className="text-gray-500 text-xs mt-1">Receipt: {transaction.receiptNumber}</div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-white font-semibold">{transaction.clientName}</div>
                            <div className="text-gray-400 text-sm">{transaction.clientAccount}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded text-xs font-medium uppercase ${
                              transaction.type === 'deposit'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className={`font-bold text-lg ${
                              transaction.type === 'deposit' ? 'text-green-400' : 'text-orange-400'
                            }`}>
                              ${transaction.amount.toLocaleString()}
                            </div>
                            <div className="text-gray-500 text-xs capitalize">
                              {transaction.paymentMethod.replace(/_/g, ' ')}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded border text-xs font-medium ${getStatusBadgeClass(transaction.status)}`}>
                              {getStatusLabel(transaction.status)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-white text-sm">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {new Date(transaction.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewTransactionDetails(transaction)}
                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                              {transaction.status === TRANSACTION_STATUS.COMPLETED && (
                                <button
                                  onClick={() => handlePrintReceipt(transaction)}
                                  className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                  title="Print Receipt"
                                >
                                  <Printer className="w-3 h-3" />
                                  Receipt
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
                <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Transactions Yet</h3>
                <p className="text-gray-400">Transactions will appear here once you create deposits or withdrawals</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && <AdminReports branchName={user?.branchName || user?.branch} />}

        {activeTab === 'adminUsers' && <AdminUserManagement branchName={user?.branchName || user?.branch} />}

        {activeTab === 'settings' && <AdminSettings user={user} branchName={user?.branchName || user?.branch} />}

        {activeTab === 'auditLog' && <AdminAuditLog user={user} branchName={user?.branchName || user?.branch} />}

      </main>

      {/* Deposit Modal */}
      {showDepositModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowDownCircle className="w-6 h-6 text-green-400" />
                Deposit Funds
              </h3>
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setSelectedClient(null);
                  setDepositData({ amount: '', method: 'cash', comment: '' });
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">Client</div>
              <div className="text-white font-bold">{selectedClient.name}</div>
              <div className="text-sm text-gray-400">{selectedClient.account}</div>
              <div className="mt-2 text-sm text-gray-400">Current Balance</div>
              <div className="text-2xl font-bold text-white">${selectedClient.balance.toLocaleString()}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount ($)</label>
                <input
                  type="number"
                  value={depositData.amount}
                  onChange={(e) => setDepositData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount"
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Payment Method</label>
                <select
                  value={depositData.method}
                  onChange={(e) => setDepositData(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="e_wallet">E-Wallet</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Comment (Optional)</label>
                <textarea
                  value={depositData.comment}
                  onChange={(e) => setDepositData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {depositData.amount && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-sm text-gray-400">New Balance</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${(selectedClient.balance + Number.parseFloat(depositData.amount || 0)).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setSelectedClient(null);
                  setDepositData({ amount: '', method: 'cash', comment: '' });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDeposit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowUpCircle className="w-6 h-6 text-orange-400" />
                Withdraw Funds
              </h3>
              <button
                onClick={() => {
                  setShowWithdrawalModal(false);
                  setSelectedClient(null);
                  setWithdrawalData({ amount: '', method: 'cash', comment: '' });
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">Client</div>
              <div className="text-white font-bold">{selectedClient.name}</div>
              <div className="text-sm text-gray-400">{selectedClient.account}</div>
              <div className="mt-2 text-sm text-gray-400">Current Balance</div>
              <div className="text-2xl font-bold text-white">${selectedClient.balance.toLocaleString()}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount ($)</label>
                <input
                  type="number"
                  value={withdrawalData.amount}
                  onChange={(e) => setWithdrawalData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount"
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Payment Method</label>
                <select
                  value={withdrawalData.method}
                  onChange={(e) => setWithdrawalData(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="e_wallet">E-Wallet</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Comment (Optional)</label>
                <textarea
                  value={withdrawalData.comment}
                  onChange={(e) => setWithdrawalData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {withdrawalData.amount && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="text-sm text-gray-400">New Balance</div>
                  <div className="text-2xl font-bold text-orange-400">
                    ${(selectedClient.balance - Number.parseFloat(withdrawalData.amount || 0)).toLocaleString()}
                  </div>
                  {(selectedClient.balance - Number.parseFloat(withdrawalData.amount || 0)) < 0 && (
                    <div className="text-red-400 text-sm mt-2">⚠️ Warning: Insufficient balance</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowWithdrawalModal(false);
                  setSelectedClient(null);
                  setWithdrawalData({ amount: '', method: 'cash', comment: '' });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteWithdrawal}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-3xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" />
                Transaction Details
              </h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Transaction Header */}
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Transaction ID</div>
                    <div className="text-white font-mono font-bold text-lg">{selectedTransaction.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Status</div>
                    <div>
                      <span className={`px-4 py-2 rounded-lg inline-block font-semibold ${
                        selectedTransaction.status === 'completed' ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30' :
                        selectedTransaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/30' :
                        selectedTransaction.status.includes('rejected') || selectedTransaction.status === 'failed' ? 'bg-red-500/20 text-red-400 border-2 border-red-500/30' :
                        'bg-blue-500/20 text-blue-400 border-2 border-blue-500/30'
                      }`}>
                        {selectedTransaction.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {selectedTransaction.receiptNumber && (
                    <div className="col-span-2">
                      <div className="text-sm text-gray-400 mb-1">Receipt Number</div>
                      <div className="text-white font-mono">{selectedTransaction.receiptNumber}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Amount */}
              <div className={`rounded-lg p-6 text-center ${
                selectedTransaction.type === 'deposit' ? 'bg-green-500/10 border-2 border-green-500/30' : 'bg-orange-500/10 border-2 border-orange-500/30'
              }`}>
                <div className="text-sm text-gray-400 mb-2 uppercase tracking-wide">
                  {selectedTransaction.type}
                </div>
                <div className={`text-5xl font-bold ${
                  selectedTransaction.type === 'deposit' ? 'text-green-400' : 'text-orange-400'
                }`}>
                  ${selectedTransaction.amount.toLocaleString()}
                </div>
              </div>

              {/* Client Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Client Information</h4>
                <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white font-semibold">{selectedTransaction.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account:</span>
                    <span className="text-white font-mono">{selectedTransaction.clientAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Branch:</span>
                    <span className="text-white">{selectedTransaction.branch}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Payment Details</h4>
                <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="text-white capitalize">{selectedTransaction.paymentMethod.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created At:</span>
                    <span className="text-white">{new Date(selectedTransaction.createdAt).toLocaleString()}</span>
                  </div>
                  {selectedTransaction.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completed At:</span>
                      <span className="text-white">{new Date(selectedTransaction.completedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Comment */}
              {selectedTransaction.comment && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Comment</h4>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-white">{selectedTransaction.comment}</p>
                  </div>
                </div>
              )}

              {/* Approval Chain - Audit Trail */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Approval Chain & Audit Trail
                </h4>
                <div className="space-y-3">
                  {selectedTransaction.approvalChain.map((step, index) => {
                    const getIconAndColor = (action) => {
                      const styles = {
                        'created': { icon: '📝', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
                        'approved': { icon: '✅', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
                        'rejected': { icon: '❌', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
                        'processing': { icon: '⚙️', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
                        'completed': { icon: '🎉', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
                        'failed': { icon: '⚠️', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' }
                      };
                      return styles[action] || { icon: '📋', bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400' };
                    };

                    const style = getIconAndColor(step.action);

                    return (
                      <div key={index} className={`${style.bg} border-2 ${style.border} rounded-lg p-4 relative`}>
                        <div className="flex items-start gap-4">
                          <div className="text-3xl flex-shrink-0">{style.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-bold text-lg capitalize ${style.text}`}>{step.action}</span>
                              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded uppercase font-semibold">
                                {step.role}
                              </span>
                            </div>
                            <div className="text-white font-semibold mb-1">{step.userName}</div>
                            <div className="text-sm text-gray-400">{new Date(step.timestamp).toLocaleString()}</div>
                            {step.comment && (
                              <div className="mt-3 p-3 bg-gray-700/50 rounded border-l-4 border-blue-500">
                                <div className="text-sm text-gray-300 italic">"{step.comment}"</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                {selectedTransaction.status === TRANSACTION_STATUS.COMPLETED && (
                  <button
                    onClick={() => handlePrintReceipt(selectedTransaction)}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                  >
                    <Printer className="w-5 h-5" />
                    Print Receipt
                  </button>
                )}
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
