import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== Product Spreads API ====================

export const getAllSpreads = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/manager/spreads`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSpreadBySymbol = async (symbol) => {
  try {
    const response = await axios.get(`${API_URL}/api/manager/spreads/${symbol}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSpread = async (spreadData) => {
  try {
    const response = await axios.post(`${API_URL}/api/manager/spreads`, spreadData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSpread = async (symbol, spreadData) => {
  try {
    const response = await axios.put(`${API_URL}/api/manager/spreads/${symbol}`, spreadData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSpread = async (symbol) => {
  try {
    await axios.delete(`${API_URL}/api/manager/spreads/${symbol}`, {
      headers: getAuthHeader()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// ==================== Branch Commissions API ====================

export const getAllBranches = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/manager/branches`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBranch = async (branchId) => {
  try {
    const response = await axios.get(`${API_URL}/api/manager/branches/${branchId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBranchCommission = async (branchId, commission) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/manager/branches/${branchId}/commission`,
      { commission_per_lot: commission },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
