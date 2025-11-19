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
export async function createTransaction(userId, transaction, currentUser = null) {
  try {
    const userIdStr = String(userId);
    
    if (!userIdStr || userIdStr === 'undefined' || userIdStr === 'null') {
      throw new Error('Invalid user ID');
    }

    let user = currentUser;
    
    if (!user) {
      try {
        user = await get(`/users/${userIdStr}`);
      } catch (getError) {
        if (getError.message.includes('404')) {
          const base = import.meta.env.VITE_API_URL || 'https://690868602d902d0651b02a38.mockapi.io/api/v1';
          const allUsersRes = await fetch(`${base}/users`);
          if (allUsersRes.ok) {
            const allUsers = await allUsersRes.json();
            user = allUsers.find(u => String(u.id) === userIdStr);
          }
        }
        if (!user) {
          throw new Error(`User not found (ID: ${userIdStr})`);
        }
      }
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      date: new Date().toISOString(),
    };
    
    const updatedTransactions = [...(user.transactions || []), newTransaction];
    
    try {
      const updatedUser = await put(`/users/${userIdStr}`, {
        ...user,
        transactions: updatedTransactions,
      });
      console.log('Transaction saved to API successfully');
    } catch (apiError) {
      console.warn('Failed to save transaction to API, continuing with local update:', apiError);
    }
    
    return newTransaction;
  } catch (error) {
    console.error('Failed to create transaction:', error);
    if (error.message.includes('404')) {
      throw new Error(`User not found (ID: ${userId}). Please try logging in again.`);
    }
    throw error;
  }
}

/**
 * Update user balance
 * @param {string} userId - User ID
 * @param {number} newBalance - New balance amount
 * @returns {Promise<object>} Updated user data
 */
export async function updateBalance(userId, newBalance, currentUser = null) {
  try {
    const userIdStr = String(userId);
    
    if (!userIdStr || userIdStr === 'undefined' || userIdStr === 'null') {
      throw new Error('Invalid user ID');
    }

    let user = currentUser;
    
    if (!user) {
      try {
        user = await get(`/users/${userIdStr}`);
      } catch (getError) {
        if (getError.message.includes('404')) {
          const base = import.meta.env.VITE_API_URL || 'https://690868602d902d0651b02a38.mockapi.io/api/v1';
          const allUsersRes = await fetch(`${base}/users`);
          if (allUsersRes.ok) {
            const allUsers = await allUsersRes.json();
            user = allUsers.find(u => String(u.id) === userIdStr);
          }
        }
        if (!user) {
          throw new Error(`User not found (ID: ${userIdStr})`);
        }
      }
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    try {
      const updatedUser = await put(`/users/${userIdStr}`, {
        ...user,
        balance: newBalance,
      });
      console.log('Balance updated in API successfully');
      return updatedUser;
    } catch (apiError) {
      console.warn('Failed to update balance in API, continuing with local update:', apiError);
      return {
        ...user,
        balance: newBalance,
      };
    }
  } catch (error) {
    console.error('Failed to update balance:', error);
    if (error.message.includes('404')) {
      throw new Error(`User not found (ID: ${userId}). Please try logging in again.`);
    }
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
export async function depositMoney(userId, amount, currentUser = null) {
  try {
    const userIdStr = String(userId);
    
    if (!userIdStr || userIdStr === 'undefined' || userIdStr === 'null') {
      throw new Error('Invalid user ID');
    }

    let user = currentUser;
    
    if (!user) {
      try {
        user = await get(`/users/${userIdStr}`);
      } catch (getError) {
        if (getError.message.includes('404')) {
          const base = import.meta.env.VITE_API_URL || 'https://690868602d902d0651b02a38.mockapi.io/api/v1';
          const allUsersRes = await fetch(`${base}/users`);
          if (allUsersRes.ok) {
            const allUsers = await allUsersRes.json();
            user = allUsers.find(u => String(u.id) === userIdStr);
          }
        }
        if (!user) {
          throw new Error(`User not found (ID: ${userIdStr})`);
        }
      }
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const newBalance = (user.balance || 0) + amount;
    
    try {
      await createTransaction(userIdStr, {
        type: 'Deposit',
        amount: amount,
        currency: 'ILS',
      }, user);
    } catch (transactionError) {
      console.warn('Transaction creation had API issues, but continuing with local update:', transactionError);
    }
    
    let updatedUser;
    try {
      updatedUser = await updateBalance(userIdStr, newBalance, user);
    } catch (balanceError) {
      console.warn('Balance update had API issues, but continuing with local update:', balanceError);
      updatedUser = {
        ...user,
        balance: newBalance,
      };
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Failed to deposit money:', error);
    if (error.message.includes('Invalid user ID') || error.message.includes('User not found')) {
      throw error;
    }
    if (currentUser) {
      return {
        ...currentUser,
        balance: (currentUser.balance || 0) + amount,
      };
    }
    throw error;
  }
}

/**
 * Withdraw money
 * @param {string} userId - User ID
 * @param {number} amount - Withdrawal amount
 * @returns {Promise<object>} Updated user data
 */
export async function withdrawMoney(userId, amount, currentUser = null) {
  try {
    const userIdStr = String(userId);
    
    if (!userIdStr || userIdStr === 'undefined' || userIdStr === 'null') {
      throw new Error('Invalid user ID');
    }

    let user = currentUser;
    
    if (!user) {
      try {
        user = await get(`/users/${userIdStr}`);
      } catch (getError) {
        console.error('Failed to fetch user:', getError);
        if (getError.message.includes('404')) {
          console.log('User not found by ID, trying alternative approach...');
          const base = import.meta.env.VITE_API_URL || 'https://690868602d902d0651b02a38.mockapi.io/api/v1';
          const allUsersRes = await fetch(`${base}/users`);
          if (allUsersRes.ok) {
            const allUsers = await allUsersRes.json();
            user = allUsers.find(u => String(u.id) === userIdStr);
            if (!user) {
              throw new Error(`User with ID ${userIdStr} not found in API`);
            }
          } else {
            throw getError;
          }
        } else {
          throw getError;
        }
      }
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const currentBalance = user.balance || 0;
    
    if (amount > currentBalance) {
      throw new Error('Insufficient balance');
    }
    
    const newBalance = currentBalance - amount;
    
    try {
      await createTransaction(userIdStr, {
        type: 'Withdraw',
        amount: amount,
        currency: 'ILS',
      }, user);
    } catch (transactionError) {
      console.warn('Transaction creation had API issues, but continuing with local update:', transactionError);
    }
    
    let updatedUser;
    try {
      updatedUser = await updateBalance(userIdStr, newBalance, user);
    } catch (balanceError) {
      console.warn('Balance update had API issues, but continuing with local update:', balanceError);
      updatedUser = {
        ...user,
        balance: newBalance,
      };
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Failed to withdraw money:', error);
    if (error.message.includes('Insufficient balance')) {
      throw error;
    }
    if (currentUser) {
      return {
        ...currentUser,
        balance: (currentUser.balance || 0) - amount,
      };
    }
    throw error;
  }
}

/**
 * Clear all transactions
 * @param {string} userId - User ID
 * @returns {Promise<object>} Updated user data
 */
export async function clearTransactions(userId, currentUser = null) {
  try {
    const userIdStr = String(userId);
    
    if (!userIdStr || userIdStr === 'undefined' || userIdStr === 'null') {
      throw new Error('Invalid user ID');
    }

    let user = currentUser;
    
    if (!user) {
      try {
        user = await get(`/users/${userIdStr}`);
      } catch (getError) {
        if (getError.message.includes('404')) {
          const base = import.meta.env.VITE_API_URL || 'https://690868602d902d0651b02a38.mockapi.io/api/v1';
          const allUsersRes = await fetch(`${base}/users`);
          if (allUsersRes.ok) {
            const allUsers = await allUsersRes.json();
            user = allUsers.find(u => String(u.id) === userIdStr);
          }
        }
        if (!user) {
          throw new Error(`User not found (ID: ${userIdStr})`);
        }
      }
    }
    
    if (!user) {
      throw new Error('User not found');
    }

    try {
      const base = import.meta.env.VITE_API_URL || 'https://690868602d902d0651b02a38.mockapi.io/api/v1';
      const deleteRes = await fetch(`${base}/users/${userIdStr}`, {
        method: 'DELETE',
      });
      
      if (deleteRes.ok) {
        return {
          ...user,
          balance: 0,
          transactions: [],
        };
      }
    } catch (deleteError) {
      console.warn('DELETE method not supported, trying PUT:', deleteError);
    }

    try {
      const updatedUser = await put(`/users/${userIdStr}`, {
        ...user,
        balance: 0,
        transactions: [],
      });
      return updatedUser;
    } catch (putError) {
      console.warn('PUT also failed, returning local reset:', putError);
      return {
        ...user,
        balance: 0,
        transactions: [],
      };
    }
  } catch (error) {
    console.error('Failed to clear transactions:', error);
    if (currentUser) {
      return {
        ...currentUser,
        balance: 0,
        transactions: [],
      };
    }
    throw error;
  }
}
