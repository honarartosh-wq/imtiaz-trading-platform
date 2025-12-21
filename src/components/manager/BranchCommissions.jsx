import React, { useState, useEffect } from 'react';
import { Building2, DollarSign, Users, Save, Edit2, AlertCircle } from 'lucide-react';
import { getAllBranches, updateBranchCommission } from '../../services/managerService';

const BranchCommissions = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(null);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllBranches();
      setBranches(data);
    } catch (err) {
      setError('Failed to load branches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branch) => {
    setEditingId(branch.id);
    setEditValue(branch.commission_per_lot.toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSave = async (branchId, branchName) => {
    try {
      setError(null);
      setSaveSuccess(null);

      const commission = parseFloat(editValue);

      if (commission <= 0) {
        setError('Commission must be a positive number');
        return;
      }

      await updateBranchCommission(branchId, commission);

      setSaveSuccess(`Successfully updated commission for ${branchName}`);
      setEditingId(null);
      setEditValue('');

      // Reload branches
      await loadBranches();

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to update commission for ${branchName}. Please try again.`);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading branches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Branch Commission Management</h2>
          <p className="text-gray-400 mt-1">Configure commission per lot for each branch</p>
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

      <div className="grid gap-6">
        {branches.map((branch) => {
          const isEditing = editingId === branch.id;

          return (
            <div
              key={branch.id}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{branch.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(branch.status)}`}>
                        {branch.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Code: {branch.code} | Referral: {branch.referral_code}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => handleEdit(branch)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Commission
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSave(branch.id, branch.name)}
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
                  <p className="text-gray-400 text-sm mb-2">Commission Per Lot</p>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter commission"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-green-400 w-6 h-6" />
                      <p className="text-2xl font-bold text-white">{branch.commission_per_lot.toFixed(2)}</p>
                    </div>
                  )}
                  <p className="text-gray-400 text-xs mt-1">Per standard lot</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Leverage</p>
                  <p className="text-2xl font-bold text-white">1:{branch.leverage}</p>
                  <p className="text-gray-400 text-xs mt-1">Default leverage</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Branch Admin</p>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="text-purple-400 w-5 h-5" />
                    <p className="text-lg font-bold text-white">{branch.admin_name}</p>
                  </div>
                  <p className="text-gray-400 text-xs">{branch.admin_email}</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${branch.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                    <p className="text-lg font-bold text-white">
                      {branch.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Branch status</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {branches.length === 0 && (
        <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
          <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No branches configured yet.</p>
        </div>
      )}
    </div>
  );
};

export default BranchCommissions;
