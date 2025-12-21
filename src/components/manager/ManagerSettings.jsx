import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  DollarSign,
  Clock,
  Save,
  AlertCircle,
  Globe,
  Database
} from 'lucide-react';

const ManagerSettings = ({ user }) => {
  const [settings, setSettings] = useState({
    // Platform Settings
    platformName: 'Imtiaz Trading Platform',
    platformCurrency: 'USD',
    platformTimezone: 'UTC',
    maintenanceMode: false,

    // Notification Settings
    emailNotifications: true,
    branchAlerts: true,
    riskAlerts: true,
    systemAlerts: true,
    dailyReports: true,
    weeklyReports: true,

    // Global Commission Settings
    defaultStandardCommission: 0.0008,
    defaultBusinessCommission: 0.0006,
    defaultVIPCommission: 0.0005,

    // Trading Settings
    globalMaxLeverage: 200,
    defaultLeverage: 100,
    marginCallLevel: 100,
    stopOutLevel: 50,
    weekendTrading: true,

    // Risk Management
    maxPositionSize: 100.0,
    maxDailyDrawdown: 10000,
    autoHedgingEnabled: true,
    slippageProtection: true,

    // API & Integration
    apiEnabled: true,
    webhooksEnabled: false,
    mt5Integration: true,

    // Security
    sessionTimeout: 60,
    requireStrongPassword: true,
    twoFactorAuth: true,
    ipWhitelist: false,

    // Data Retention
    logRetentionDays: 90,
    backupFrequency: 'daily',
    autoArchive: true
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
    setSuccess('Settings saved successfully! Changes will take effect immediately.');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" />
            Manager Settings
          </h2>
          <p className="text-gray-400 mt-1">Configure global platform settings and preferences</p>
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

      {/* Platform Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Platform Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Platform Name
            </label>
            <input
              type="text"
              name="platformName"
              value={settings.platformName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Base Currency
            </label>
            <select
              name="platformCurrency"
              value={settings.platformCurrency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Timezone
            </label>
            <select
              name="platformTimezone"
              value={settings.platformTimezone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="PST">PST</option>
              <option value="GMT">GMT</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
              />
              <div>
                <span className="text-white font-medium">Maintenance Mode</span>
                <p className="text-xs text-gray-400">Disable trading for maintenance</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Notification Preferences</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <p className="text-sm text-gray-400">Receive email alerts</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="branchAlerts"
              checked={settings.branchAlerts}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
            />
            <div>
              <span className="text-white font-medium">Branch Alerts</span>
              <p className="text-sm text-gray-400">Get branch activity notifications</p>
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
              <p className="text-sm text-gray-400">High-risk activities</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="systemAlerts"
              checked={settings.systemAlerts}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
            />
            <div>
              <span className="text-white font-medium">System Alerts</span>
              <p className="text-sm text-gray-400">System status updates</p>
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
              <p className="text-sm text-gray-400">Daily summary emails</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="weeklyReports"
              checked={settings.weeklyReports}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
            />
            <div>
              <span className="text-white font-medium">Weekly Reports</span>
              <p className="text-sm text-gray-400">Weekly summary emails</p>
            </div>
          </label>
        </div>
      </div>

      {/* Global Commission Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-400" />
          <h3 className="text-xl font-bold text-white">Default Commission Rates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Standard Account
            </label>
            <input
              type="number"
              step="0.0001"
              name="defaultStandardCommission"
              value={settings.defaultStandardCommission}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Business Account
            </label>
            <input
              type="number"
              step="0.0001"
              name="defaultBusinessCommission"
              value={settings.defaultBusinessCommission}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              VIP Account
            </label>
            <input
              type="number"
              step="0.0001"
              name="defaultVIPCommission"
              value={settings.defaultVIPCommission}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Trading Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Trading Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Global Max Leverage
            </label>
            <input
              type="number"
              name="globalMaxLeverage"
              value={settings.globalMaxLeverage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Default Leverage
            </label>
            <input
              type="number"
              name="defaultLeverage"
              value={settings.defaultLeverage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Margin Call Level (%)
            </label>
            <input
              type="number"
              name="marginCallLevel"
              value={settings.marginCallLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Stop Out Level (%)
            </label>
            <input
              type="number"
              name="stopOutLevel"
              value={settings.stopOutLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Max Position Size
            </label>
            <input
              type="number"
              step="0.01"
              name="maxPositionSize"
              value={settings.maxPositionSize}
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
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="ipWhitelist"
                checked={settings.ipWhitelist}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
              />
              <span className="text-white font-medium">IP Whitelist</span>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Data Management</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Log Retention (days)
            </label>
            <input
              type="number"
              name="logRetentionDays"
              value={settings.logRetentionDays}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Backup Frequency
            </label>
            <select
              name="backupFrequency"
              value={settings.backupFrequency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="autoArchive"
                checked={settings.autoArchive}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
              />
              <span className="text-white font-medium">Auto Archive</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSettings;
