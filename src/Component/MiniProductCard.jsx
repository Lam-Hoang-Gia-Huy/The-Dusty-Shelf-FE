import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MiniProductCard.css';

const MiniProductCard = ({ book }) => {
    const navigate = useNavigate();

    if (!book) return null;

    const handleViewDetail = () => {
        navigate(`/product/${book.id}`);
    };

    // Format price in VND
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(book.price || 0);

    return (
        <div className="mini-product-card">
            <div className="mini-product-card-img-container">
                <img 
                    src={book.imageUrl || 'https://via.placeholder.com/80x110?text=No+Image'} 
                    alt={book.name} 
                    className="mini-product-card-img" 
                />
            </div>
            <div className="mini-product-card-info">
                <h4 className="mini-product-card-title">{book.name}</h4>
                <p className="mini-product-card-price">{formattedPrice}</p>
                <button 
                    className="mini-product-card-btn" 
                    onClick={handleViewDetail}
                >
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
};

export default MiniProductCard;
