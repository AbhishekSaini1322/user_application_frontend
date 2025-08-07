import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAxiosHelper from '../../api/axiosHelper';
import { ApiPaths } from '../../api/endpoints';
import { toastSuccess, toastError } from '../../utils/toast';
import './items.css';
import ItemPopup from './ItemPopup';
import ConfirmModal from './ConfirmModal';

const Items = () => {
  const dispatch = useDispatch();
  const { AxiosPost, AxiosGet, AxiosDelete, AxiosPut } = useAxiosHelper(); // Added AxiosPut
  
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingItems, setFetchingItems] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 9
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupItemId, setPopupItemId] = useState(null);
  const [gridKey, setGridKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Function to fetch items with filters
  const fetchItems = async (filterParams = {}) => {
    setFetchingItems(true);
    setIsAnimating(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.keys(filterParams).forEach(key => {
        if (filterParams[key] && filterParams[key] !== '') {
          queryParams.append(key, filterParams[key]);
        }
      });
      
      const endpoint = `${ApiPaths.getItems}?${queryParams.toString()}`;
      const res = await AxiosGet(endpoint);
      console.log("111111111111111111",res)
      if (res?.success) {
        setItems(res.items || []);
        setPagination({
          currentPage: res.currentPage || 1,
          totalPages: res.totalPages || 1,
          totalItems: res.totalItems || 0
        });
      } else {
        toastError(res?.message || "Failed to fetch items");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to fetch items";
      toastError(errorMsg);
    } finally {
      setFetchingItems(false);
      // Delay animation reset to allow for smooth transition
      setTimeout(() => setIsAnimating(false), 100);
    }
  };

  // Load items on component mount and when filters change
  React.useEffect(() => {
    fetchItems(filters);
  }, [filters.search, filters.minPrice, filters.maxPrice, filters.page]); 

  useEffect(() => {
    if (!isAnimating) {
      setGridKey(prev => prev + 1);
    }
  }, [items, isAnimating]);

  // Handle filter changes with automatic application
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      page: 1,
      limit: 9
    });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price) {
      toastError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
        console.log('File being sent:', selectedFile.name, selectedFile.type, selectedFile.size);
      }

      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const res = await AxiosPost(ApiPaths.addItem, formDataToSend);
      
      if (res?.success || res?.status === 200) {
        toastSuccess(res?.message || "Item added successfully!");
        setFormData({ title: '', description: '', price: '' });
        setSelectedFile(null);
        setShowAddForm(false);
        // Refresh the items list after successful addition
        fetchItems(filters);
      } else {
        toastError(res?.message || "Failed to add item");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to add item";
      toastError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price.toString()
    });
    setShowAddForm(true);
  };


const handleUpdateItem = async (e) => {
  e.preventDefault();

  if (!formData.title || !formData.description || !formData.price) {
    toastError("Please fill all required fields");
    return;
  }

  setLoading(true);
  try {
    const itemId = editingItem.itemId || editingItem.id;
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);

    if (selectedFile) {
      formDataToSend.append('image', selectedFile);
    }

    const res = await AxiosPut(`${ApiPaths.updateItem}/${itemId}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res?.success) {
      toastSuccess(res?.message || "Item updated successfully!");
      setFormData({ title: '', description: '', price: '' });
      setSelectedFile(null);
      setEditingItem(null);
      setShowAddForm(false);
      fetchItems(filters);
    } else {
      toastError(res?.message || "Failed to update item");
    }
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error?.message || "Failed to update item";
    toastError(errorMsg);
  } finally {
    setLoading(false);
  }
};

  const handleDeleteItem = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setItemToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    if (!itemToDelete) return;
    
    // Temporarily remove the item from the list to prevent blinking
    const itemToRemove = items.find(item => (item.itemId || item.id) === itemToDelete);
    if (itemToRemove) {
      setItems(prevItems => prevItems.filter(item => (item.itemId || item.id) !== itemToDelete));
    }
    
    try {
      const res = await AxiosDelete(`${ApiPaths.deleteItem}?itemId=${itemToDelete}`);
      if (res?.success) {
        toastSuccess(res?.message || 'Item deleted successfully!');
        // Don't refetch items since we already updated the state
      } else {
        toastError(res?.message || 'Failed to delete item');
        // Restore the item if deletion failed
        if (itemToRemove) {
          setItems(prevItems => [...prevItems, itemToRemove]);
        }
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to delete item';
      toastError(errorMsg);
      // Restore the item if deletion failed
      if (itemToRemove) {
        setItems(prevItems => [...prevItems, itemToRemove]);
      }
    } finally {
      setItemToDelete(null);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', price: '' });
    setSelectedFile(null);
    setEditingItem(null);
    setShowAddForm(false);
  };

  return (
    <div className="items-container">
      <div className="items-header">
        <h2>Items Management</h2>
        <button 
          className="add-item-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add New Item
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search items..."
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min Price"
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max Price"
              className="filter-input"
            />
          </div>
          
          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear
            </button>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
              <div className="form-group">
                <label htmlFor="title">Item Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter item title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter item description"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="file">Item Image (Optional)</label>
                <input
                  type="file"
                  id="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (editingItem ? 'Updating...' : 'Adding...') : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {fetchingItems ? (
        <div className="loading-section">
          <p>Loading items...</p>
        </div>
      ) : (
        <>
          <div className={`items-grid ${isAnimating ? 'items-grid-animating' : ''}`} key={gridKey}>
            {items.map(item => (
              <div key={item.itemId || item.id} className="item-card" onClick={() => { setPopupItemId(item.itemId || item.id); setPopupOpen(true); }} style={{ cursor: 'pointer' }}>
                <div className="item-header">
                  <h3>{item.title || item.name}</h3>
                  <div className="item-actions">
                    <button 
                      className="edit-btn"
                      onClick={e => { e.stopPropagation(); handleEditItem(item); }}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={e => handleDeleteItem(e, item.itemId || item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="item-details">
                  <p className="item-price">${item.price?.toFixed(2) || '0.00'}</p>
                  <p className="item-description">{item.description}</p>
                  {item.image && (
                    <div className="item-image-wrapper">
                      <img src={item.image} alt={item.title} className="item-image" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && !fetchingItems && (
            <div className="no-items">
              <p>No items found. Add your first item!</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="pagination-btn"
              >
                Previous
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn${pagination.currentPage === i + 1 ? ' active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                  disabled={pagination.currentPage === i + 1}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="pagination-btn"
              >
                Next
              </button>
              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages} 
              </span>
            </div>
          )}
        </>
      )}
      <ItemPopup itemId={popupItemId} open={popupOpen} onClose={() => setPopupOpen(false)} />
      <ConfirmModal
        open={confirmOpen}
        message="Are you sure you want to delete this item?"
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setItemToDelete(null); }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Items;