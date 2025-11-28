/**
 * Professional Receipt Generator for Transactions
 */

export const generateTransactionReceipt = (transaction, branchInfo = {}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f59e0b',
      'admin_approved': '#3b82f6',
      'manager_approved': '#8b5cf6',
      'processing': '#06b6d4',
      'completed': '#10b981',
      'admin_rejected': '#ef4444',
      'manager_rejected': '#ef4444',
      'failed': '#dc2626'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending Review',
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

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Transaction Receipt - ${transaction.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .receipt-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .receipt-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          padding: 40px;
          text-align: center;
          position: relative;
        }
        .receipt-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect fill="rgba(255,255,255,0.05)" width="50" height="50"/></svg>');
          opacity: 0.1;
        }
        .company-logo {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 10px;
          position: relative;
        }
        .company-name {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
          position: relative;
        }
        .receipt-title {
          font-size: 16px;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 2px;
          position: relative;
        }
        .receipt-body {
          padding: 40px;
        }
        .status-badge {
          display: inline-block;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 30px;
          background-color: ${getStatusColor(transaction.status)}20;
          color: ${getStatusColor(transaction.status)};
          border: 2px solid ${getStatusColor(transaction.status)};
        }
        .info-section {
          margin-bottom: 35px;
        }
        .section-title {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          background: #f9fafb;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .info-value {
          font-size: 16px;
          color: #111827;
          font-weight: 600;
        }
        .amount-highlight {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }
        .amount-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .amount-value {
          font-size: 48px;
          font-weight: bold;
          letter-spacing: -1px;
        }
        .approval-chain {
          margin-top: 35px;
        }
        .approval-step {
          display: flex;
          align-items: flex-start;
          padding: 20px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 15px;
          position: relative;
          transition: all 0.3s;
        }
        .approval-step:hover {
          border-color: #3b82f6;
          transform: translateX(5px);
        }
        .approval-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-right: 20px;
          flex-shrink: 0;
        }
        .approval-icon.created { background: #dbeafe; color: #1e40af; }
        .approval-icon.approved { background: #d1fae5; color: #065f46; }
        .approval-icon.rejected { background: #fee2e2; color: #991b1b; }
        .approval-icon.processing { background: #e0e7ff; color: #3730a3; }
        .approval-icon.completed { background: #d1fae5; color: #065f46; }
        .approval-details {
          flex: 1;
        }
        .approval-action {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
          text-transform: capitalize;
        }
        .approval-user {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .approval-time {
          font-size: 12px;
          color: #9ca3af;
        }
        .approval-comment {
          font-size: 13px;
          color: #4b5563;
          margin-top: 8px;
          font-style: italic;
          padding: 10px;
          background: #f9fafb;
          border-radius: 6px;
          border-left: 3px solid #3b82f6;
        }
        .receipt-footer {
          background: #f9fafb;
          padding: 30px 40px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
        }
        .footer-text {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
        }
        .receipt-number {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          margin-top: 15px;
          border: 1px solid #fbbf24;
        }
        .security-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 120px;
          color: rgba(0,0,0,0.03);
          font-weight: bold;
          pointer-events: none;
          z-index: 0;
        }
        @media print {
          body { padding: 0; background: white; }
          .receipt-container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="receipt-header">
          <div class="company-logo">💼</div>
          <div class="company-name">${branchInfo.name || 'Imtiaz Trading Platform'}</div>
          <div class="receipt-title">Transaction Receipt</div>
        </div>

        <div class="receipt-body">
          <div style="text-align: center;">
            <div class="status-badge">${getStatusLabel(transaction.status)}</div>
          </div>

          <div class="info-section">
            <div class="section-title">Transaction Details</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Transaction ID</div>
                <div class="info-value">${transaction.id}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Receipt Number</div>
                <div class="info-value">${transaction.receiptNumber || 'Pending'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Transaction Type</div>
                <div class="info-value" style="text-transform: capitalize;">${transaction.type}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Payment Method</div>
                <div class="info-value" style="text-transform: capitalize;">${transaction.paymentMethod.replace(/_/g, ' ')}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Created Date</div>
                <div class="info-value" style="font-size: 13px;">${formatDate(transaction.createdAt)}</div>
              </div>
              ${transaction.completedAt ? `
                <div class="info-item">
                  <div class="info-label">Completed Date</div>
                  <div class="info-value" style="font-size: 13px;">${formatDate(transaction.completedAt)}</div>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="amount-highlight">
            <div class="amount-label">${transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} Amount</div>
            <div class="amount-value">$${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          <div class="info-section">
            <div class="section-title">Client Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Client Name</div>
                <div class="info-value">${transaction.clientName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Account Number</div>
                <div class="info-value">${transaction.clientAccount}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Branch</div>
                <div class="info-value">${transaction.branch}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Initiated By</div>
                <div class="info-value" style="text-transform: capitalize;">${transaction.initiatorRole}</div>
              </div>
            </div>
          </div>

          ${transaction.comment ? `
            <div class="info-section">
              <div class="section-title">Comment</div>
              <div style="padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">${transaction.comment}</p>
              </div>
            </div>
          ` : ''}

          <div class="approval-chain">
            <div class="section-title">Approval Chain & Audit Trail</div>
            ${transaction.approvalChain.map(step => {
              const iconMap = {
                'created': '📝',
                'approved': '✅',
                'rejected': '❌',
                'processing': '⚙️',
                'completed': '🎉',
                'failed': '⚠️'
              };

              return `
                <div class="approval-step">
                  <div class="approval-icon ${step.action}">
                    ${iconMap[step.action] || '📋'}
                  </div>
                  <div class="approval-details">
                    <div class="approval-action">${step.action}</div>
                    <div class="approval-user">${step.userName} (${step.role.toUpperCase()})</div>
                    <div class="approval-time">${formatDate(step.timestamp)}</div>
                    ${step.comment ? `<div class="approval-comment">"${step.comment}"</div>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="receipt-footer">
          <div class="footer-text">
            <strong>This is an official transaction receipt</strong><br>
            Generated by ${branchInfo.name || 'Imtiaz Trading Platform'}<br>
            ${branchInfo.address || ''}<br>
            For any queries, please contact your branch manager.
          </div>
          ${transaction.receiptNumber ? `
            <div class="receipt-number">
              Receipt #${transaction.receiptNumber}
            </div>
          ` : ''}
        </div>

        <div class="security-watermark">OFFICIAL</div>
      </div>
    </body>
    </html>
  `;

  return receiptHTML;
};

export const printReceipt = (transaction, branchInfo = {}) => {
  const receiptHTML = generateTransactionReceipt(transaction, branchInfo);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
