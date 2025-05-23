import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, dbRef, onValue } from '../../../Firebase';
import { Link } from 'react-router-dom';
import '../../styles/newsdetail.css';

export default function NewsDetail() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const newsRef = dbRef(db, `news/${id}`);
    const unsubscribe = onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNewsItem({ id, ...data });
        setError(null);
      } else {
        setError('News article not found');
      }
      setLoading(false);
    }, (error) => {
      setError('Error loading news article');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) return <div className="loading">Loading news details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!newsItem) return <div className="not-found">News article not found!</div>;

  return (
    <div className="news-detail">
      <div className="news-container">
        <h1>{newsItem.title}</h1>
        
        {newsItem.imageBase64 && (
          <img 
            src={newsItem.imageBase64} 
            alt={newsItem.title} 
            className="detail-image"
          />
        )}

        <p className="excerpt">{newsItem.excerpt}</p>
        
        <div className="meta">
          <span>{newsItem.date}</span> | <span>By {newsItem.author}</span>
          {newsItem.category && <span> | Category: {newsItem.category}</span>}
        </div>

        <div className="content">
          {newsItem.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <Link to="/news" className="back-button">
          ← Back to News
        </Link>
      </div>
    </div>
  );
}