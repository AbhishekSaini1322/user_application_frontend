import React, { useEffect, useState, useRef } from 'react';
import useAxiosHelper from '../../api/axiosHelper';
import { ApiPaths } from '../../api/endpoints';
import './items.css';
import './ItemPopup.css';

const ItemPopup = ({ itemId, open, onClose }) => {
  const { AxiosGet } = useAxiosHelper();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!open || !itemId) {
      hasFetched.current = false;
      return;
    }

    if (hasFetched.current) return;
    
    setLoading(true);
    setError('');
    setItem(null);
    hasFetched.current = true;

    const fetchItem = async () => {
      try {
        const endpoint = `${ApiPaths.getItems}?itemId=${itemId}`;
        const res = await AxiosGet(endpoint);
        if (res?.success && res.items && res.items.length > 0) {
          setItem(res.items[0]);
        } else {
          setError(res?.message || 'Item not found');
        }
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Failed to fetch item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, open]);

  // Reset when popup closes
  useEffect(() => {
    if (!open) {
      hasFetched.current = false;
      setItem(null);
      setError('');
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="item-popup-overlay">
      <div className="item-popup-modal">
        <button className="item-popup-close" onClick={onClose}>&times;</button>
        
        {loading ? (
          <div className="item-popup-loading">
            Loading item details...
          </div>
        ) : error ? (
          <div className="item-popup-error">
            <strong>Error:</strong> {error}
          </div>
        ) : item ? (
          <div className="item-popup-content">
            <div className="item-popup-header">
              <h2>{item.title || item.name}</h2>
            </div>
            
            <div className="item-popup-body">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.title || item.name} 
                  className="item-popup-image" 
                />
              )}
              
              <div className="item-popup-price">
                <div className="item-popup-price-value">
                  ${item.price?.toFixed(2) || '0.00'}
                </div>
              </div>
              
              <div className="item-popup-description">
                {item.description}
              </div>
              
              <div className="item-popup-details">
                <p>
                  <strong>Item ID:</strong> 
                  <span>{item.itemId || item.id}</span>
                </p>
                <p>
                  <strong>Created:</strong> 
                  <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</span>
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ItemPopup; 