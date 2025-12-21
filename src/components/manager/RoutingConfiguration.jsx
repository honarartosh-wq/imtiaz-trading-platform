import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeftRight,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';
import {
  getAllRoutingRules,
  getRoutingRule,
  createRoutingRule,
  updateRoutingRule,
  deleteRoutingRule,
  getAllLiquidityProviders
} from '../../services/managerService';

const RoutingConfiguration = () => {
  const [rules, setRules] = useState([]);
  const [liquidityProviders, setLiquidityProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    client_type: '',
    account_type: '',
    min_lot_size: '',
    max_lot_size: '',
    routing_type: 'a_book',
    lp_id: '',
    backup_lp_id: '',
    a_book_percentage: 100.0,
    priority: 100,
    is_active: true,
    active_hours_start: '',
    active_hours_end: '',
    active_days: '',
    max_slippage_pips: '',
    max_daily_volume: '',
    stop_loss_required: false,
    description: ''
  });

  const loadRules = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllRoutingRules();
      setRules(data);
      setError(null);
    } catch (err) {
      setError('Failed to load routing rules. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLiquidityProviders = useCallback(async () => {
    try {
      const data = await getAllLiquidityProviders();
      setLiquidityProviders(data.filter(lp => lp.is_active));
    } catch (err) {
      // Silently fail, LPs are optional
    }
  }, []);

  useEffect(() => {
    loadRules();
    loadLiquidityProviders();
  }, [loadRules, loadLiquidityProviders]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      symbol: '',
      client_type: '',
      account_type: '',
      min_lot_size: '',
      max_lot_size: '',
      routing_type: 'a_book',
      lp_id: '',
      backup_lp_id: '',
      a_book_percentage: 100.0,
      priority: 100,
      is_active: true,
      active_hours_start: '',
      active_hours_end: '',
      active_days: '',
      max_slippage_pips: '',
      max_daily_volume: '',
      stop_loss_required: false,
      description: ''
    });
    setEditingRule(null);
  };

  const handleEdit = async (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name || '',
      symbol: rule.symbol || '',
      client_type: rule.client_type || '',
      account_type: rule.account_type || '',
      min_lot_size: rule.min_lot_size || '',
      max_lot_size: rule.max_lot_size || '',
      routing_type: rule.routing_type || 'a_book',
      lp_id: rule.lp_id || '',
      backup_lp_id: rule.backup_lp_id || '',
      a_book_percentage: rule.a_book_percentage || 100.0,
      priority: rule.priority || 100,
      is_active: rule.is_active !== undefined ? rule.is_active : true,
      active_hours_start: rule.active_hours_start || '',
      active_hours_end: rule.active_hours_end || '',
      active_days: rule.active_days || '',
      max_slippage_pips: rule.max_slippage_pips || '',
      max_daily_volume: rule.max_daily_volume || '',
      stop_loss_required: rule.stop_loss_required || false,
      description: rule.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this routing rule?')) {
      return;
    }

    try {
      await deleteRoutingRule(ruleId);
      setSuccess('Routing rule deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      loadRules();
    } catch (err) {
      setError('Failed to delete routing rule. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        symbol: formData.symbol || null,
        client_type: formData.client_type || null,
        account_type: formData.account_type || null,
        min_lot_size: formData.min_lot_size ? parseFloat(formData.min_lot_size) : null,
        max_lot_size: formData.max_lot_size ? parseFloat(formData.max_lot_size) : null,
        routing_type: formData.routing_type,
        lp_id: formData.lp_id ? parseInt(formData.lp_id, 10) : null,
        backup_lp_id: formData.backup_lp_id ? parseInt(formData.backup_lp_id, 10) : null,
        a_book_percentage: parseFloat(formData.a_book_percentage),
        priority: parseInt(formData.priority, 10),
        is_active: formData.is_active,
        active_hours_start: formData.active_hours_start || null,
        active_hours_end: formData.active_hours_end || null,
        active_days: formData.active_days || null,
        max_slippage_pips: formData.max_slippage_pips ? parseFloat(formData.max_slippage_pips) : null,
        max_daily_volume: formData.max_daily_volume ? parseFloat(formData.max_daily_volume) : null,
        stop_loss_required: formData.stop_loss_required,
        description: formData.description || null
      };

      if (editingRule) {
        await updateRoutingRule(editingRule.id, payload);
        setSuccess('Routing rule updated successfully');
      } else {
        await createRoutingRule(payload);
        setSuccess('Routing rule created successfully');
      }

      setTimeout(() => setSuccess(null), 3000);
      setShowModal(false);
      resetForm();
      loadRules();
    } catch (err) {
      setError('Failed to save routing rule. Please check all fields.');
    }
  };

  const getRoutingTypeBadge = (type) => {
    const badges = {
      a_book: { color: 'bg-green-100 text-green-800', label: 'A-Book' },
      b_book: { color: 'bg-blue-100 text-blue-800', label: 'B-Book' },
      hybrid: { color: 'bg-purple-100 text-purple-800', label: 'Hybrid' }
    };
    const badge = badges[type] || badges.a_book;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>;
  };

  const getLPName = (lpId) => {
    const lp = liquidityProviders.find(l => l.id === lpId);
    return lp ? lp.name : 'N/A';
  };

  const filteredRules = rules.filter(rule => {
    if (filter === 'all') return true;
    if (filter === 'active') return rule.is_active;
    if (filter === 'inactive') return !rule.is_active;
    if (filter === 'a_book') return rule.routing_type === 'a_book';
    if (filter === 'b_book') return rule.routing_type === 'b_book';
    if (filter === 'hybrid') return rule.routing_type === 'hybrid';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-blue-600" />
            Routing Configuration
          </h2>
          <p className="text-gray-600 mt-1">Manage order routing rules and LP assignment</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Routing Rule
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700 font-medium">{success}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All Rules' },
          { key: 'active', label: 'Active' },
          { key: 'inactive', label: 'Inactive' },
          { key: 'a_book', label: 'A-Book' },
          { key: 'b_book', label: 'B-Book' },
          { key: 'hybrid', label: 'Hybrid' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {filteredRules.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ArrowLeftRight className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No routing rules found</h3>
            <p className="text-gray-600">Create your first routing rule to get started</p>
          </div>
        ) : (
          filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                    {getRoutingTypeBadge(rule.routing_type)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-gray-600">Priority: {rule.priority}</span>
                  </div>
                  {rule.description && (
                    <p className="text-gray-600 text-sm mb-3">{rule.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rule Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600 mb-1">Symbol</div>
                  <div className="font-medium">{rule.symbol || 'All Symbols'}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600 mb-1">Client Type</div>
                  <div className="font-medium">{rule.client_type || 'All Types'}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600 mb-1">Account Type</div>
                  <div className="font-medium">{rule.account_type || 'All Accounts'}</div>
                </div>
              </div>

              {/* Lot Size Range */}
              {(rule.min_lot_size || rule.max_lot_size) && (
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Lot Size Range:</span>
                  <span className="font-medium">
                    {rule.min_lot_size || '0'} - {rule.max_lot_size || '∞'}
                  </span>
                </div>
              )}

              {/* LP Assignment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-blue-600 mb-1">Primary LP</div>
                  <div className="font-medium text-gray-900">{getLPName(rule.lp_id)}</div>
                </div>
                {rule.backup_lp_id && (
                  <div className="bg-orange-50 p-3 rounded">
                    <div className="text-sm text-orange-600 mb-1">Backup LP</div>
                    <div className="font-medium text-gray-900">{getLPName(rule.backup_lp_id)}</div>
                  </div>
                )}
              </div>

              {/* A-Book/B-Book Split */}
              {rule.routing_type === 'hybrid' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">A-Book / B-Book Split</span>
                    <span className="font-medium">{rule.a_book_percentage}% / {100 - rule.a_book_percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-500 h-full"
                      style={{ width: `${rule.a_book_percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Time-based Routing */}
              {(rule.active_hours_start || rule.active_days) && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {rule.active_hours_start && (
                    <span>Hours: {rule.active_hours_start} - {rule.active_hours_end}</span>
                  )}
                  {rule.active_days && (
                    <span>Days: {rule.active_days}</span>
                  )}
                </div>
              )}

              {/* Risk Management */}
              {(rule.max_slippage_pips || rule.max_daily_volume || rule.stop_loss_required) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Risk Management</span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    {rule.max_slippage_pips && (
                      <span>Max Slippage: {rule.max_slippage_pips} pips</span>
                    )}
                    {rule.max_daily_volume && (
                      <span>Max Daily Volume: {rule.max_daily_volume}</span>
                    )}
                    {rule.stop_loss_required && (
                      <span className="text-orange-600 font-medium">SL Required</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRule ? 'Edit Routing Rule' : 'Add New Routing Rule'}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rule Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <input
                      type="number"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rule Conditions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Rule Conditions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Symbol (optional)
                    </label>
                    <input
                      type="text"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleInputChange}
                      placeholder="e.g., EURUSD"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Type (optional)
                    </label>
                    <input
                      type="text"
                      name="client_type"
                      value={formData.client_type}
                      onChange={handleInputChange}
                      placeholder="e.g., VIP, Standard"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type (optional)
                    </label>
                    <input
                      type="text"
                      name="account_type"
                      value={formData.account_type}
                      onChange={handleInputChange}
                      placeholder="e.g., Live, Demo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Lot Size (optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="min_lot_size"
                      value={formData.min_lot_size}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Lot Size (optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="max_lot_size"
                      value={formData.max_lot_size}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Routing Configuration */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Routing Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Routing Type *
                    </label>
                    <select
                      name="routing_type"
                      value={formData.routing_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="a_book">A-Book (Send to LP)</option>
                      <option value="b_book">B-Book (Internal)</option>
                      <option value="hybrid">Hybrid (Split)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary LP
                    </label>
                    <select
                      name="lp_id"
                      value={formData.lp_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">None</option>
                      {liquidityProviders.map(lp => (
                        <option key={lp.id} value={lp.id}>{lp.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Backup LP
                    </label>
                    <select
                      name="backup_lp_id"
                      value={formData.backup_lp_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">None</option>
                      {liquidityProviders.map(lp => (
                        <option key={lp.id} value={lp.id}>{lp.name}</option>
                      ))}
                    </select>
                  </div>
                  {formData.routing_type === 'hybrid' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        A-Book Percentage
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        name="a_book_percentage"
                        value={formData.a_book_percentage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Time-based Routing */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Time-based Routing (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active Hours Start
                    </label>
                    <input
                      type="time"
                      name="active_hours_start"
                      value={formData.active_hours_start}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active Hours End
                    </label>
                    <input
                      type="time"
                      name="active_hours_end"
                      value={formData.active_hours_end}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active Days
                    </label>
                    <input
                      type="text"
                      name="active_days"
                      value={formData.active_days}
                      onChange={handleInputChange}
                      placeholder="e.g., mon,tue,wed"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Risk Management */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Risk Management (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Slippage (pips)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="max_slippage_pips"
                      value={formData.max_slippage_pips}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Daily Volume
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="max_daily_volume"
                      value={formData.max_daily_volume}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="stop_loss_required"
                      checked={formData.stop_loss_required}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Require Stop Loss</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutingConfiguration;
