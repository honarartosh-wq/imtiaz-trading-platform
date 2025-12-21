import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  DollarSign,
  Eye,
  AlertCircle,
  Filter
} from 'lucide-react';
import { getUsers, getAccounts } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalBalance: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, accountsData] = await Promise.all([
        getUsers({ role: 'client' }),
        getAccounts()
      ]);
      setClients(usersData);
      setAccounts(accountsData);
      calculateStats(usersData, accountsData);
    } catch (err) {
      setError('Failed to load client data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (users, accounts) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const stats = {
      totalClients: users.length,
      activeClients: users.filter(u => u.is_active).length,
      totalBalance: accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0),
      newThisMonth: users.filter(u => {
        const created = new Date(u.created_at);
        return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
      }).length
    };
    setStats(stats);
  };

  const getClientAccounts = (clientId) => {
    return accounts.filter(acc => acc.user_id === clientId);
  };

  const getClientTotalBalance = (clientId) => {
    const clientAccounts = getClientAccounts(clientId);
    return clientAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  };

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Management</h2>
          <p className="text-gray-400 mt-1">View and manage all platform clients</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <UserPlus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Clients</h3>
            <Users className="text-blue-400 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalClients}</p>
          <p className="text-gray-400 text-xs mt-1">All registered clients</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Active Clients</h3>
            <TrendingUp className="text-green-400 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.activeClients}</p>
          <p className="text-gray-400 text-xs mt-1">Currently active</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Balance</h3>
            <DollarSign className="text-yellow-400 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-white">${formatCurrency(stats.totalBalance)}</p>
          <p className="text-gray-400 text-xs mt-1">Across all accounts</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">New This Month</h3>
            <Calendar className="text-purple-400 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-purple-400">{stats.newThisMonth}</p>
          <p className="text-gray-400 text-xs mt-1">New registrations</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Clients Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Accounts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const clientAccounts = getClientAccounts(client.id);
                  const totalBalance = getClientTotalBalance(client.id);

                  return (
                    <tr key={client.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{client.name}</div>
                          <div className="text-sm text-gray-400">ID: {client.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Mail className="w-4 h-4" />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Phone className="w-4 h-4" />
                              {client.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {clientAccounts.length} {clientAccounts.length === 1 ? 'Account' : 'Accounts'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-400">
                          ${formatCurrency(totalBalance)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          client.is_active
                            ? 'bg-green-500/20 text-green-400 border border-green-500'
                            : 'bg-red-500/20 text-red-400 border border-red-500'
                        }`}>
                          {client.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {formatDate(client.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No clients found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
