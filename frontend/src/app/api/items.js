"use server";

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch all items with optional filtering
 * @param {Object} options - Filter and pagination options
 * @returns {Promise<Object>} - Items and pagination data
 */
export async function getItems(options = {}) {
  const {
    page = 1,
    limit = 20,
    type,
    category,
    condition,
    search,
    location,
    status,
    dateFilter
  } = options;

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Construct query parameters
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString()
  });

  // Add optional filters if provided
  if (type) params.append('type', type);
  if (category) params.append('category', category);
  if (condition) params.append('condition', condition);
  if (search) params.append('search', search);
  if (location) params.append('location', location);
  if (status) params.append('status', status.toString());
  if (dateFilter) params.append('date_filter', dateFilter);

  try {
    const response = await fetch(`${API_URL}/api/items?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Error fetching items: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return { items: [], total: 0, page: 1, page_size: limit };
  }
}

/**
 * Fetch a single item by ID
 * @param {string|number} id - Item ID
 * @returns {Promise<Object>} - Item data
 */

export async function getItemById(id) {
  try {
    const response = await fetch(`${API_URL}/api/items/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch item ${id}:`, error);
    return null;
  }
}

/**
 * Fetch similar items based on an item's category
 * @param {string|number} id - Current item ID
 * @param {string} category - Category to match
 * @param {number} limit - Maximum number of similar items
 * @returns {Promise<Array>} - List of similar items
 */
export async function getSimilarItems(id, category, limit = 3) {
  try {
    const response = await fetch(`${API_URL}/api/items/${id}/similar?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Error fetching similar items: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch similar items for ${id}:`, error);
    return [];
  }
}

/**
 * Create a new item
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} - Created item
 */
export async function createItem(itemData, token) {
  try {
    const response = await fetch(`${API_URL}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      throw new Error(`Error creating item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create item:', error);
    throw error;
  }
}

/**
 * Update an existing item
 * @param {string|number} id - Item ID
 * @param {Object} itemData - Updated item data
 * @returns {Promise<Object>} - Updated item
 */
export async function updateItem(id, itemData, token) {
  try {
    const response = await fetch(`${API_URL}/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      throw new Error(`Error updating item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update item ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an item
 * @param {string|number} id - Item ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteItem(id, token) {
  try {
    const response = await fetch(`${API_URL}/api/items/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error deleting item: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete item ${id}:`, error);
    return false;
  }
}
