import React, { useState, useEffect } from 'react';
import {
  Server,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Activity,
  Zap,
  Globe
} from 'lucide-react';
import {
  getAllLiquidityProviders,
  createLiquidityProvider,
  updateLiquidityProvider,
  deleteLiquidityProvider
} from '../../services/managerService';

const LiquidityProviders = () => {
  const [lps, setLps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLp, setEditingLp] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    lp_type: 'prime_broker',
    status: 'active',
    api_endpoint: '',
    websocket_url: '',
    max_lot_size: 100.0,
    min_lot_size: 0.01,
    base_commission: 0.0,
    markup_percentage: 0.0,
    priority: 100,
    supported_symbols: '',
    description: '',
    contact_email: '',
    is_active: true
  });

  useEffect(() => {
    loadLps();
  }, []);

  const loadLps = async () => {
    try {
      setLoading(true);
      const data = await getAllLiquidityProviders();
      setLps(data);
    } catch (err) {
      setError('Failed to load liquidity providers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingLp) {
        await updateLiquidityProvider(editingLp.id, formData);
        setSuccess('LP updated successfully');
      } else {
        await createLiquidityProvider(formData);
        setSuccess('LP created successfully');
      }
      setShowModal(false);
      resetForm();
      await loadLps();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save LP');
    }
  };

  const handleEdit = (lp) => {
    setEditingLp(lp);
    setFormData({
      name: lp.name,
      code: lp.code,
      lp_type: lp.lp_type,
      status: lp.status,
      api_endpoint: lp.api_endpoint || '',
      websocket_url: lp.websocket_url || '',
      max_lot_size: lp.max_lot_size,
      min_lot_size: lp.min_lot_size,
      base_commission: lp.base_commission,
      markup_percentage: lp.markup_percentage,
      priority: lp.priority,
      supported_symbols: lp.supported_symbols || '',
      description: lp.description || '',
      contact_email: lp.contact_email || '',
      is_active: lp.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (lp) => {
    if (window.confirm(`Delete ${lp.name}?`)) {
      try {
        await deleteLiquidityProvider(lp.id);
        setSuccess('LP deleted successfully');
        await loadLps();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Failed to delete LP');
      }
    }
  };

  const resetForm = () => {
    setEditingLp(null);
    setFormData({
      name: '',
      code: '',
      lp_type: 'prime_broker',
      status: 'active',
      api_endpoint: '',
      websocket_url: '',
      max_lot_size: 100.0,
      min_lot_size: 0.01,
      base_commission: 0.0,
      markup_percentage: 0.0,
      priority: 100,
      supported_symbols: '',
      description: '',
      contact_email: '',
      is_active: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'disconnected': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'prime_broker': return 'bg-blue-500/20 text-blue-400';
      case 'ecn': return 'bg-purple-500/20 text-purple-400';
      case 'market_maker': return 'bg-orange-500/20 text-orange-400';
      case 'aggregator': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading liquidity providers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Liquidity Providers</h2>
          <p className="text-gray-400 mt-1">Manage LP connections and configurations</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add LP
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* LP List */}
      <div className="grid gap-6">
        {lps.map((lp) => (
          <div key={lp.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{lp.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(lp.lp_type)}`}>
                      {lp.lp_type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(lp.status)}`}>
                      {lp.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Code: {lp.code} | Priority: {lp.priority}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(lp)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(lp)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="text-green-400 w-4 h-4" />
                  <p className="text-gray-400 text-sm">Performance</p>
                </div>
                <p className="text-white font-bold">{lp.success_rate?.toFixed(1)}%</p>
                <p className="text-gray-400 text-xs mt-1">Success rate</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-yellow-400 w-4 h-4" />
                  <p className="text-gray-400 text-sm">Latency</p>
                </div>
                <p className="text-white font-bold">{lp.avg_latency_ms?.toFixed(0)}ms</p>
                <p className="text-gray-400 text-xs mt-1">Average</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="text-blue-400 w-4 h-4" />
                  <p className="text-gray-400 text-sm">Lot Range</p>
                </div>
                <p className="text-white font-bold">{lp.min_lot_size} - {lp.max_lot_size}</p>
                <p className="text-gray-400 text-xs mt-1">Min - Max</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-purple-400 w-4 h-4" />
                  <p className="text-gray-400 text-sm">Commission</p>
                </div>
                <p className="text-white font-bold">${lp.base_commission}</p>
                <p className="text-gray-400 text-xs mt-1">+ {lp.markup_percentage}% markup</p>
              </div>
            </div>

            {lp.description && (
              <p className="text-gray-400 text-sm mt-4">{lp.description}</p>
            )}
          </div>
        ))}
      </div>

      {lps.length === 0 && (
        <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
          <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No liquidity providers configured</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingLp ? 'Edit' : 'Add'} Liquidity Provider
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type *</label>
                  <select
                    required
                    value={formData.lp_type}
                    onChange={(e) => setFormData({ ...formData, lp_type: e.target.value })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="prime_broker">Prime Broker</option>
                    <option value="ecn">ECN</option>
                    <option value="market_maker">Market Maker</option>
                    <option value="aggregator">Aggregator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="disconnected">Disconnected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Min Lot Size</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.min_lot_size}
                    onChange={(e) => setFormData({ ...formData, min_lot_size: parseFloat(e.target.value) })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Max Lot Size</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.max_lot_size}
                    onChange={(e) => setFormData({ ...formData, max_lot_size: parseFloat(e.target.value) })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Supported Symbols</label>
                <input
                  type="text"
                  placeholder="EURUSD,GBPUSD,XAUUSD"
                  value={formData.supported_symbols}
                  onChange={(e) => setFormData({ ...formData, supported_symbols: e.target.value })}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {editingLp ? 'Update' : 'Create'} LP
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiquidityProviders;
