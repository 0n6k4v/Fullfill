import {
  faTableCells, faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils
} from '@fortawesome/free-solid-svg-icons';

/**
 * Helper function to get condition colors based on item condition
 * @param {string} conditionId - The condition ID of the item
 * @returns {Object} - Object containing background and text color classes
 */
export const getConditionColors = (conditionId) => {
  const conditionId_lower = conditionId?.toLowerCase();
  switch (conditionId_lower) {
    case 'new':
      return { bg: 'bg-emerald-100', text: 'text-emerald-800' };
    case 'like_new':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'good':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'fair':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    case 'poor':
      return { bg: 'bg-orange-100', text: 'text-orange-800' };
    case 'any':
      return { bg: 'bg-purple-100', text: 'text-purple-800' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
};

/**
 * Helper function to get the category icon
 * @param {string} categoryId - The category ID
 * @returns {IconDefinition} - FontAwesome icon for the category
 */
export const getCategoryIcon = (categoryId) => {
  const categories = [
    { id: 'all', name: 'All Items', icon: faTableCells },
    { id: 'furniture', name: 'Furniture', icon: faCouch },
    { id: 'clothing', name: 'Clothing', icon: faTshirt },
    { id: 'electronics', name: 'Electronics', icon: faLaptop },
    { id: 'appliances', name: 'Appliances', icon: faBlender },
    { id: 'Kids & toys', name: 'Kids & Toys', icon: faBaby },
    { id: 'Books', name: 'Books', icon: faBook },
    { id: 'Kitchen', name: 'Kitchen', icon: faUtensils },
    { id: 'Other', name: 'Other', icon: faTableCells }
  ];

  const category = categories.find(c => c.id === categoryId);
  return category ? category.icon : faTableCells;
};

/**
 * Helper function to format date
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Get estimated distance based on location
 * @param {string} itemLocation - The location name
 * @returns {string} - Estimated distance from user
 */
export const getItemDistance = (itemLocation) => {
  const distanceMap = {
    'Downtown': '0.5 mi',
    'Westside': '2.1 mi',
    'Eastside': '5.2 mi',
    'Northside': '3.9 mi',
    'Southside': '4.1 mi',
  };

  return distanceMap[itemLocation] || '~3.0 mi'; // Default if location not in our map
};

/**
 * Get status text and color classes
 * @returns {Object} - Object containing status text and color class maps
 */
export const getStatusInfo = () => {
  const statusText = {
    1: 'Available',
    2: 'Reserved',
    3: 'Fulfilled'
  };

  const statusClass = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-blue-100 text-blue-800'
  };

  return { statusText, statusClass };
};

/**
 * Get categories list with icons
 * @returns {Array} - List of category objects with id, name, and icon
 */
export const getCategories = () => [
  { id: 'all', name: 'All Items', icon: faTableCells },
  { id: 'furniture', name: 'Furniture', icon: faCouch },
  { id: 'clothing', name: 'Clothing', icon: faTshirt },
  { id: 'electronics', name: 'Electronics', icon: faLaptop },
  { id: 'appliances', name: 'Appliances', icon: faBlender },
  { id: 'Kids & toys', name: 'Kids & Toys', icon: faBaby },
  { id: 'Books', name: 'Books', icon: faBook },
  { id: 'Kitchen', name: 'Kitchen', icon: faUtensils },
  { id: 'Other', name: 'Other', icon: faTableCells }
];

/**
 * Get conditions list
 * @returns {Array} - List of condition objects with id and name
 */
export const getConditions = () => [
  { id: 'all', name: 'All Conditions' },
  { id: 'new', name: 'New' },
  { id: 'like_new', name: 'Like New' },
  { id: 'good', name: 'Good' },
  { id: 'fair', name: 'Fair' },
  { id: 'poor', name: 'Poor' },
  { id: 'any', name: 'Any' }
];
