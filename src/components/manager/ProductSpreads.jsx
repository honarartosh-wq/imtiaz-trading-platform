import React, { useState, useEffect } from 'react';
import { TrendingUp, Save, Edit2, AlertCircle } from 'lucide-react';
import { getAllSpreads, updateSpread } from '../../services/managerService';

const ProductSpreads = () => {
  const [spreads, setSpreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(null);

  useEffect(() => {
    loadSpreads();
  }, []);

  const loadSpreads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSpreads();
      setSpreads(data);
    } catch (err) {
      setError('Failed to load product spreads. Please try again.');
      console.error('Error loading spreads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (spread) => {
    setEditingId(spread.id);
    setEditValues({
      extra_spread: spread.extra_spread,
      base_spread: spread.base_spread
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSave = async (symbol) => {
    try {
      setError(null);
      setSaveSuccess(null);

      await updateSpread(symbol, {
        extra_spread: parseFloat(editValues.extra_spread),
        base_spread: parseFloat(editValues.base_spread)
      });

      setSaveSuccess(`Successfully updated spread for ${symbol}`);
      setEditingId(null);
      setEditValues({});

      // Reload spreads
      await loadSpreads();

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to update spread for ${symbol}. Please try again.`);
      console.error('Error saving spread:', err);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'forex':
        return 'bg-blue-500/20 text-blue-400';
      case 'commodity':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'crypto':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading product spreads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Product Spreads Management</h2>
          <p className="text-gray-400 mt-1">Configure extra spreads for each trading product</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
          {saveSuccess}
        </div>
      )}

      <div className="grid gap-4">
        {spreads.map((spread) => {
          const isEditing = editingId === spread.id;
          const totalSpread = spread.base_spread + spread.extra_spread;

          return (
            <div
              key={spread.id}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{spread.symbol}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(spread.category)}`}>
                        {spread.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{spread.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => handleEdit(spread)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSave(spread.symbol)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Base Spread</p>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editValues.base_spread}
                      onChange={(e) => setEditValues({ ...editValues, base_spread: e.target.value })}
                      className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-white">{spread.base_spread}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">From LP</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Extra Spread</p>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editValues.extra_spread}
                      onChange={(e) => setEditValues({ ...editValues, extra_spread: e.target.value })}
                      className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-yellow-400">{spread.extra_spread}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">Platform markup</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Total Spread</p>
                  <p className="text-2xl font-bold text-green-400">
                    {isEditing
                      ? (parseFloat(editValues.base_spread) + parseFloat(editValues.extra_spread)).toFixed(1)
                      : totalSpread.toFixed(1)
                    }
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Final client spread</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Status</p>
                  <p className="text-2xl font-bold">
                    {spread.is_active ? (
                      <span className="text-green-400">Active</span>
                    ) : (
                      <span className="text-red-400">Inactive</span>
                    )}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Product status</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {spreads.length === 0 && (
        <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
          <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No product spreads configured yet.</p>
        </div>
      )}
    </div>
  );
};

export default ProductSpreads;
