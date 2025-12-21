import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  DollarSign,
  Clock,
  Save,
  AlertCircle
} from 'lucide-react';

const AdminSettings = ({ user, branchName }) => {
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    depositAlerts: true,
    withdrawalAlerts: true,
    kycAlerts: true,
    riskAlerts: true,
    dailyReports: false,

    // Branch Settings
    branchName: branchName || 'Main Branch',
    branchCode: user?.branchCode || 'MAIN001',
    timezone: 'UTC',
    currency: 'USD',

    // Commission Settings (view-only for admin)
    standardCommission: 0.0008,
    businessCommission: 0.0006,

    // Trading Hours
    tradingHoursStart: '00:00',
    tradingHoursEnd: '23:59',
    weekendTrading: false,

    // Risk Management
    maxLeverage: 100,
    marginCallLevel: 100,
    stopOutLevel: 50,
    maxPositionSize: 100.0,

    // Security
    sessionTimeout: 30,
    requireStrongPassword: true,
    twoFactorAuth: false
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = () => {
    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" />
            Admin Settings
          </h2>
          <p className="text-gray-400 mt-1">Configure your branch and preferences</p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-900 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-100 font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-100">Error</h3>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Branch Information */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Branch Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Branch Name
            </label>
            <input
              type="text"
              name="branchName"
              value={settings.branchName}
              onChange={handleInputChange}
              disabled
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Contact Manager to change</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Branch Code
            </label>
            <input
              type="text"
              name="branchCode"
              value={settings.branchCode}
              onChange={handleInputChange}
              disabled
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Contact Manager to change</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Timezone
            </label>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="PST">PST</option>
              <option value="GMT">GMT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleInputChange}
              disabled
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Contact Manager to change</p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Notification Preferences</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
            />
            <div>
              <span className="text-white font-medium">Email Notifications</span>
              <p className="text-sm text-gray-400">Receive email alerts for important events</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="depositAlerts"
              checked={settings.depositAlerts}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
            />
            <div>
              <span className="text-white font-medium">Deposit Alerts</span>
              <p className="text-sm text-gray-400">Get notified when clients make deposits</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="withdrawalAlerts"
              checked={settings.withdrawalAlerts}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
            />
            <div>
              <span className="text-white font-medium">Withdrawal Alerts</span>
              <p className="text-sm text-gray-400">Get notified about withdrawal requests</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="kycAlerts"
              checked={settings.kycAlerts}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
            />
            <div>
              <span className="text-white font-medium">KYC Alerts</span>
              <p className="text-sm text-gray-400">Get notified about pending KYC verifications</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="riskAlerts"
              checked={settings.riskAlerts}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
            />
            <div>
              <span className="text-white font-medium">Risk Alerts</span>
              <p className="text-sm text-gray-400">Get notified about high-risk client activities</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="dailyReports"
              checked={settings.dailyReports}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
            />
            <div>
              <span className="text-white font-medium">Daily Reports</span>
              <p className="text-sm text-gray-400">Receive daily summary reports via email</p>
            </div>
          </label>
        </div>
      </div>

      {/* Commission Settings (Read-Only) */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-400" />
          <h3 className="text-xl font-bold text-white">Commission Rates (View Only)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Standard Account Commission
            </label>
            <input
              type="number"
              step="0.0001"
              name="standardCommission"
              value={settings.standardCommission}
              disabled
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Contact Manager to change</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Business Account Commission
            </label>
            <input
              type="number"
              step="0.0001"
              name="businessCommission"
              value={settings.businessCommission}
              disabled
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Contact Manager to change</p>
          </div>
        </div>
      </div>

      {/* Trading Hours */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Trading Hours</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Start Time
            </label>
            <input
              type="time"
              name="tradingHoursStart"
              value={settings.tradingHoursStart}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              End Time
            </label>
            <input
              type="time"
              name="tradingHoursEnd"
              value={settings.tradingHoursEnd}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="weekendTrading"
                checked={settings.weekendTrading}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
              />
              <span className="text-white font-medium">Weekend Trading</span>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-red-400" />
          <h3 className="text-xl font-bold text-white">Security Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-3 pt-8">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="requireStrongPassword"
                checked={settings.requireStrongPassword}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
              />
              <span className="text-white font-medium">Require Strong Passwords</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
              />
              <span className="text-white font-medium">Two-Factor Authentication</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
