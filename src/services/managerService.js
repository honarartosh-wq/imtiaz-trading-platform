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

// ==================== Liquidity Provider APIs ====================

export const getAllLiquidityProviders = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/manager/liquidity-providers`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLiquidityProvider = async (lpId) => {
  try {
    const response = await axios.get(`${API_URL}/api/manager/liquidity-providers/${lpId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createLiquidityProvider = async (lpData) => {
  try {
    const response = await axios.post(`${API_URL}/api/manager/liquidity-providers`, lpData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateLiquidityProvider = async (lpId, lpData) => {
  try {
    const response = await axios.put(`${API_URL}/api/manager/liquidity-providers/${lpId}`, lpData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteLiquidityProvider = async (lpId) => {
  try {
    await axios.delete(`${API_URL}/api/manager/liquidity-providers/${lpId}`, {
      headers: getAuthHeader()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// ==================== Routing Rule APIs ====================

export const getAllRoutingRules = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/manager/routing-rules`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRoutingRule = async (ruleId) => {
  try {
    const response = await axios.get(`${API_URL}/api/manager/routing-rules/${ruleId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRoutingRule = async (ruleData) => {
  try {
    const response = await axios.post(`${API_URL}/api/manager/routing-rules`, ruleData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRoutingRule = async (ruleId, ruleData) => {
  try {
    const response = await axios.put(`${API_URL}/api/manager/routing-rules/${ruleId}`, ruleData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoutingRule = async (ruleId) => {
  try {
    await axios.delete(`${API_URL}/api/manager/routing-rules/${ruleId}`, {
      headers: getAuthHeader()
    });
    return true;
  } catch (error) {
    throw error;
  }
};
