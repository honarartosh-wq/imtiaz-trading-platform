/**
 * Professional Transaction Service
 * Manages all financial transactions with approval workflow and audit trail
 * 
 * ==================== CRITICAL SECURITY WARNING ====================
 * THIS IMPLEMENTATION IS FOR DEMO/DEVELOPMENT PURPOSES ONLY!
 * 
 * SECURITY ISSUES:
 * 1. Stores financial data in localStorage (vulnerable to XSS attacks)
 *    - XSS: Malicious scripts can read/modify localStorage data
 *    - Local File Access: Browser extensions or malware can access localStorage
 *    - Session Hijacking: Data persists even after logout
 * 2. No server-side validation or authorization
 * 3. Client-side only - data can be manipulated by users via DevTools
 * 4. No encryption or data protection
 * 5. No audit trail persistence or backup
 * 
 * PRODUCTION REQUIREMENTS:
 * - MUST use backend API with proper authentication
 * - MUST implement server-side transaction validation
 * - MUST use database for transaction persistence
 * - MUST implement proper audit logging
 * - MUST use HTTPS for all financial transactions
 * - MUST implement transaction signing/verification
 * - MUST comply with financial regulations (PCI-DSS, etc.)
 * 
 * TODO: Replace this entire service with backend API calls before production
 * ==================================================================
 */

// Transaction Status Flow:
// pending → admin_approved → manager_approved → processing → completed
// Any stage can go to → rejected

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  ADMIN_APPROVED: 'admin_approved',
  ADMIN_REJECTED: 'admin_rejected',
  MANAGER_APPROVED: 'manager_approved',
  MANAGER_REJECTED: 'manager_rejected',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment'
};

export const PAYMENT_METHOD = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  E_WALLET: 'e_wallet',
  CHECK: 'check',
  WIRE_TRANSFER: 'wire_transfer',
  CRYPTO: 'cryptocurrency'
};

export const INITIATOR_ROLE = {
  CLIENT: 'client',
  ADMIN: 'admin',
  MANAGER: 'manager'
};

class TransactionService {
  constructor() {
    // WARNING: In production, all transactions MUST be handled by backend API
    // This localStorage implementation is ONLY for demo purposes
    this.transactions = this.loadTransactions();
    this.transactionIdCounter = this.transactions.length + 1000;
  }

  loadTransactions() {
    // WARNING: localStorage is NOT secure for financial data
    // Production MUST use encrypted backend database
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : [];
  }

  saveTransactions() {
    // WARNING: This exposes financial data to XSS attacks
    // Production MUST persist to secure backend database
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  generateTransactionId() {
    return `TXN-${new Date().getFullYear()}-${String(this.transactionIdCounter++).padStart(6, '0')}`;
  }

  /**
   * Create a new transaction request
   */
  createTransaction({
    type,
    amount,
    clientId,
    clientName,
    clientAccount,
    paymentMethod,
    comment,
    initiatedBy,
    initiatorRole,
    initiatorName,
    branch,
    metadata = {}
  }) {
    const transaction = {
      id: this.generateTransactionId(),
      type,
      amount: parseFloat(amount),
      clientId,
      clientName,
      clientAccount,
      paymentMethod,
      comment: comment || '',

      // Initiator information
      initiatedBy,
      initiatorRole,
      initiatorName,
      branch,

      // Status tracking
      status: TRANSACTION_STATUS.PENDING,

      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // Approval chain
      approvalChain: [
        {
          role: initiatorRole,
          userId: initiatedBy,
          userName: initiatorName,
          action: 'created',
          timestamp: new Date().toISOString(),
          comment: comment || 'Transaction initiated'
        }
      ],

      // Additional metadata
      metadata,

      // Processing info
      processedAt: null,
      completedAt: null,

      // Transaction receipt
      receiptNumber: null
    };

    this.transactions.push(transaction);
    this.saveTransactions();

    return transaction;
  }

  /**
   * Admin approves a transaction
   */
  adminApprove(transactionId, adminId, adminName, comment = '') {
    const transaction = this.getTransaction(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== TRANSACTION_STATUS.PENDING) {
      throw new Error(`Cannot approve transaction in ${transaction.status} status`);
    }

    transaction.status = TRANSACTION_STATUS.ADMIN_APPROVED;
    transaction.updatedAt = new Date().toISOString();
    transaction.approvalChain.push({
      role: INITIATOR_ROLE.ADMIN,
      userId: adminId,
      userName: adminName,
      action: 'approved',
      timestamp: new Date().toISOString(),
      comment: comment || 'Approved by admin'
    });

    this.saveTransactions();
    return transaction;
  }

  /**
   * Admin rejects a transaction
   */
  adminReject(transactionId, adminId, adminName, reason) {
    const transaction = this.getTransaction(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== TRANSACTION_STATUS.PENDING) {
      throw new Error(`Cannot reject transaction in ${transaction.status} status`);
    }

    transaction.status = TRANSACTION_STATUS.ADMIN_REJECTED;
    transaction.updatedAt = new Date().toISOString();
    transaction.approvalChain.push({
      role: INITIATOR_ROLE.ADMIN,
      userId: adminId,
      userName: adminName,
      action: 'rejected',
      timestamp: new Date().toISOString(),
      comment: reason
    });

    this.saveTransactions();
    return transaction;
  }

  /**
   * Manager approves a transaction
   */
  managerApprove(transactionId, managerId, managerName, comment = '') {
    const transaction = this.getTransaction(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Manager can approve if admin has approved or if manager initiated
    const validStatuses = [
      TRANSACTION_STATUS.ADMIN_APPROVED,
      TRANSACTION_STATUS.PENDING // Manager can approve directly
    ];

    if (!validStatuses.includes(transaction.status)) {
      throw new Error(`Cannot approve transaction in ${transaction.status} status`);
    }

    transaction.status = TRANSACTION_STATUS.MANAGER_APPROVED;
    transaction.updatedAt = new Date().toISOString();
    transaction.approvalChain.push({
      role: INITIATOR_ROLE.MANAGER,
      userId: managerId,
      userName: managerName,
      action: 'approved',
      timestamp: new Date().toISOString(),
      comment: comment || 'Approved by manager'
    });

    this.saveTransactions();
    return transaction;
  }

  /**
   * Manager rejects a transaction
   */
  managerReject(transactionId, managerId, managerName, reason) {
    const transaction = this.getTransaction(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const validStatuses = [
      TRANSACTION_STATUS.ADMIN_APPROVED,
      TRANSACTION_STATUS.PENDING
    ];

    if (!validStatuses.includes(transaction.status)) {
      throw new Error(`Cannot reject transaction in ${transaction.status} status`);
    }

    transaction.status = TRANSACTION_STATUS.MANAGER_REJECTED;
    transaction.updatedAt = new Date().toISOString();
    transaction.approvalChain.push({
      role: INITIATOR_ROLE.MANAGER,
      userId: managerId,
      userName: managerName,
      action: 'rejected',
      timestamp: new Date().toISOString(),
      comment: reason
    });

    this.saveTransactions();
    return transaction;
  }

  /**
   * Process an approved transaction
   */
  processTransaction(transactionId, processedBy, processedByName) {
    const transaction = this.getTransaction(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== TRANSACTION_STATUS.MANAGER_APPROVED) {
      throw new Error('Transaction must be approved by manager before processing');
    }

    transaction.status = TRANSACTION_STATUS.PROCESSING;
    transaction.updatedAt = new Date().toISOString();
    transaction.processedAt = new Date().toISOString();
    transaction.approvalChain.push({
      role: INITIATOR_ROLE.MANAGER,
      userId: processedBy,
      userName: processedByName,
      action: 'processing',
      timestamp: new Date().toISOString(),
      comment: 'Transaction is being processed'
    });

    this.saveTransactions();
    return transaction;
  }

  /**
   * Complete a transaction
   */
  completeTransaction(transactionId, completedBy, completedByName, receiptNumber = null) {
    const transaction = this.getTransaction(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== TRANSACTION_STATUS.PROCESSING) {
      throw new Error('Transaction must be in processing status');
    }

    transaction.status = TRANSACTION_STATUS.COMPLETED;
    transaction.updatedAt = new Date().toISOString();
    transaction.completedAt = new Date().toISOString();
    transaction.receiptNumber = receiptNumber || this.generateReceiptNumber();
    transaction.approvalChain.push({
      role: INITIATOR_ROLE.MANAGER,
      userId: completedBy,
      userName: completedByName,
      action: 'completed',
      timestamp: new Date().toISOString(),
      comment: 'Transaction completed successfully'
    });

    this.saveTransactions();
    return transaction;
  }

  /**
   * Mark transaction as failed
   */
  failTransaction(transactionId, failedBy, failedByName, reason) {
    const transaction = this.getTransaction(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.status = TRANSACTION_STATUS.FAILED;
    transaction.updatedAt = new Date().toISOString();
    transaction.approvalChain.push({
      role: INITIATOR_ROLE.MANAGER,
      userId: failedBy,
      userName: failedByName,
      action: 'failed',
      timestamp: new Date().toISOString(),
      comment: reason
    });

    this.saveTransactions();
    return transaction;
  }

  generateReceiptNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `RCP-${year}${month}-${random}`;
  }

  /**
   * Get transaction by ID
   */
  getTransaction(transactionId) {
    return this.transactions.find(t => t.id === transactionId);
  }

  /**
   * Get all transactions
   */
  getAllTransactions() {
    return [...this.transactions].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  /**
   * Get transactions by status
   */
  getTransactionsByStatus(status) {
    return this.transactions
      .filter(t => t.status === status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Get transactions by client
   */
  getTransactionsByClient(clientId) {
    return this.transactions
      .filter(t => t.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Get transactions requiring action by role
   */
  getTransactionsRequiringAction(role) {
    if (role === INITIATOR_ROLE.ADMIN) {
      return this.getTransactionsByStatus(TRANSACTION_STATUS.PENDING);
    } else if (role === INITIATOR_ROLE.MANAGER) {
      return [
        ...this.getTransactionsByStatus(TRANSACTION_STATUS.ADMIN_APPROVED),
        ...this.getTransactionsByStatus(TRANSACTION_STATUS.PENDING)
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
  }

  /**
   * Get transaction statistics
   */
  getTransactionStats(filters = {}) {
    let transactions = this.transactions;

    // Apply filters
    if (filters.clientId) {
      transactions = transactions.filter(t => t.clientId === filters.clientId);
    }
    if (filters.branch) {
      transactions = transactions.filter(t => t.branch === filters.branch);
    }
    if (filters.dateFrom) {
      transactions = transactions.filter(t => new Date(t.createdAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      transactions = transactions.filter(t => new Date(t.createdAt) <= new Date(filters.dateTo));
    }

    const stats = {
      total: transactions.length,
      pending: transactions.filter(t => t.status === TRANSACTION_STATUS.PENDING).length,
      adminApproved: transactions.filter(t => t.status === TRANSACTION_STATUS.ADMIN_APPROVED).length,
      managerApproved: transactions.filter(t => t.status === TRANSACTION_STATUS.MANAGER_APPROVED).length,
      processing: transactions.filter(t => t.status === TRANSACTION_STATUS.PROCESSING).length,
      completed: transactions.filter(t => t.status === TRANSACTION_STATUS.COMPLETED).length,
      rejected: transactions.filter(t =>
        t.status === TRANSACTION_STATUS.ADMIN_REJECTED ||
        t.status === TRANSACTION_STATUS.MANAGER_REJECTED
      ).length,
      failed: transactions.filter(t => t.status === TRANSACTION_STATUS.FAILED).length,

      totalDeposits: transactions
        .filter(t => t.type === TRANSACTION_TYPE.DEPOSIT && t.status === TRANSACTION_STATUS.COMPLETED)
        .reduce((sum, t) => sum + t.amount, 0),

      totalWithdrawals: transactions
        .filter(t => t.type === TRANSACTION_TYPE.WITHDRAWAL && t.status === TRANSACTION_STATUS.COMPLETED)
        .reduce((sum, t) => sum + t.amount, 0),

      pendingAmount: transactions
        .filter(t => [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.ADMIN_APPROVED, TRANSACTION_STATUS.MANAGER_APPROVED, TRANSACTION_STATUS.PROCESSING].includes(t.status))
        .reduce((sum, t) => sum + t.amount, 0)
    };

    return stats;
  }

  /**
   * Export transaction receipt
   */
  generateReceipt(transactionId) {
    const transaction = this.getTransaction(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return {
      receiptNumber: transaction.receiptNumber || 'N/A',
      transactionId: transaction.id,
      date: transaction.completedAt || transaction.createdAt,
      type: transaction.type,
      amount: transaction.amount,
      client: {
        name: transaction.clientName,
        account: transaction.clientAccount
      },
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
      approvalChain: transaction.approvalChain,
      comment: transaction.comment
    };
  }
}

// Export singleton instance
export const transactionService = new TransactionService();
