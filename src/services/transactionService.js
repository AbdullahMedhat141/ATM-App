import { get, post, put, del } from './api';

/**
 * Transaction service for handling transaction-related API calls
 */

/**
 * Get all transactions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of transactions
 */
export async function getTransactions(userId) {
  try {
    // Fetch user data which includes transactions
    const user = await get(`/users/${userId}`);
    return user?.transactions || [];
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    // Return empty array on error instead of throwing
    return [];
  }
}

/**
 * Create a new transaction
 * @param {string} userId - User ID
 * @param {object} transaction - Transaction data
 * @returns {Promise<object>} Created transaction
 */
export async function createTransaction(userId, transaction) {
  try {
    // Get current user data
    const user = await get(`/users/${userId}`);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create new transaction
    const newTransaction = {
      id: Date.now(), // Temporary ID
      ...transaction,
      date: new Date().toISOString(),
    };
    
    // Add transaction to user's transactions array
    const updatedTransactions = [...(user.transactions || []), newTransaction];
    
    // Update user with new transaction
    const updatedUser = await put(`/users/${userId}`, {
      ...user,
      transactions: updatedTransactions,
    });
    
    return newTransaction;
  } catch (error) {
    console.error('Failed to create transaction:', error);
    throw error;
  }
}

/**
 * Update user balance
 * @param {string} userId - User ID
 * @param {number} newBalance - New balance amount
 * @returns {Promise<object>} Updated user data
 */
export async function updateBalance(userId, newBalance) {
  try {
    const user = await get(`/users/${userId}`);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = await put(`/users/${userId}`, {
      ...user,
      balance: newBalance,
    });
    return updatedUser;
  } catch (error) {
    console.error('Failed to update balance:', error);
    throw error;
  }
}

/**
 * Get user balance
 * @param {string} userId - User ID
 * @returns {Promise<number>} Current balance
 */
export async function getBalance(userId) {
  try {
    const user = await get(`/users/${userId}`);
    return user?.balance || 0;
  } catch (error) {
    console.error('Failed to fetch balance:', error);
    // Return 0 on error instead of throwing
    return 0;
  }
}

/**
 * Deposit money
 * @param {string} userId - User ID
 * @param {number} amount - Deposit amount
 * @returns {Promise<object>} Updated user data
 */
export async function depositMoney(userId, amount) {
  try {
    const user = await get(`/users/${userId}`);
    if (!user) {
      throw new Error('User not found');
    }
    const newBalance = (user.balance || 0) + amount;
    
    // Create transaction
    await createTransaction(userId, {
      type: 'Deposit',
      amount: amount,
      currency: 'ILS',
    });
    
    // Update balance
    return await updateBalance(userId, newBalance);
  } catch (error) {
    console.error('Failed to deposit money:', error);
    throw error;
  }
}

/**
 * Withdraw money
 * @param {string} userId - User ID
 * @param {number} amount - Withdrawal amount
 * @returns {Promise<object>} Updated user data
 */
export async function withdrawMoney(userId, amount) {
  try {
    const user = await get(`/users/${userId}`);
    if (!user) {
      throw new Error('User not found');
    }
    const currentBalance = user.balance || 0;
    
    if (amount > currentBalance) {
      throw new Error('Insufficient balance');
    }
    
    const newBalance = currentBalance - amount;
    
    // Create transaction
    await createTransaction(userId, {
      type: 'Withdraw',
      amount: amount,
      currency: 'ILS',
    });
    
    // Update balance
    return await updateBalance(userId, newBalance);
  } catch (error) {
    console.error('Failed to withdraw money:', error);
    throw error;
  }
}

/**
 * Clear all transactions
 * @param {string} userId - User ID
 * @returns {Promise<object>} Updated user data
 */
export async function clearTransactions(userId) {
  try {
    const user = await get(`/users/${userId}`);
    if (!user) {
      throw new Error('User not found');
    }
    return await put(`/users/${userId}`, {
      ...user,
      transactions: [],
    });
  } catch (error) {
    console.error('Failed to clear transactions:', error);
    throw error;
  }
}
