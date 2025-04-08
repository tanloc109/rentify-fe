import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating }) => {
    const labels = ['Rất tệ', 'Tệ', 'Ổn', 'Tốt', 'Rất tốt'];

    const styles = {
        starRatingContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px',
        },
        starsContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '8px',
        },
        ratingLabel: {
            fontWeight: 'bold',
            height: '24px',
        },
    };

    return (
        <div style={styles.starRatingContainer}>
            <div style={styles.starsContainer}>
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;

                    return (
                        <label key={index}>
                            <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                onClick={() => setRating(ratingValue)}
                                style={{ display: 'none' }}
                            />
                            <FaStar
                                color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                                size={30}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'color 200ms',
                                    margin: '0 2px',
                                }}
                            />
                        </label>
                    );
                })}
            </div>
            <div style={styles.ratingLabel}>
                {rating > 0 && <span>{labels[rating - 1]}</span>}
            </div>
        </div>
    );
};

export default StarRating;
