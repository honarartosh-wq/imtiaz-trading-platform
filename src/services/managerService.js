import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== Product Spreads API ====================

export const getAllSpreads = async () => {
  try {
    const response = await axios.get(`${API_URL}/manager/spreads`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching spreads:', error);
    throw error;
  }
};

export const getSpreadBySymbol = async (symbol) => {
  try {
    const response = await axios.get(`${API_URL}/manager/spreads/${symbol}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching spread for ${symbol}:`, error);
    throw error;
  }
};

export const createSpread = async (spreadData) => {
  try {
    const response = await axios.post(`${API_URL}/manager/spreads`, spreadData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating spread:', error);
    throw error;
  }
};

export const updateSpread = async (symbol, spreadData) => {
  try {
    const response = await axios.put(`${API_URL}/manager/spreads/${symbol}`, spreadData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating spread for ${symbol}:`, error);
    throw error;
  }
};

export const deleteSpread = async (symbol) => {
  try {
    await axios.delete(`${API_URL}/manager/spreads/${symbol}`, {
      headers: getAuthHeader()
    });
    return true;
  } catch (error) {
    console.error(`Error deleting spread for ${symbol}:`, error);
    throw error;
  }
};

// ==================== Branch Commissions API ====================

export const getAllBranches = async () => {
  try {
    const response = await axios.get(`${API_URL}/manager/branches`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const getBranch = async (branchId) => {
  try {
    const response = await axios.get(`${API_URL}/manager/branches/${branchId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching branch ${branchId}:`, error);
    throw error;
  }
};

export const updateBranchCommission = async (branchId, commission) => {
  try {
    const response = await axios.put(
      `${API_URL}/manager/branches/${branchId}/commission`,
      { commission_per_lot: commission },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating commission for branch ${branchId}:`, error);
    throw error;
  }
};
