import React, { useState, useEffect } from 'react';
import { dbRef, onValue } from '../../../Firebase';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { auth } from '../../../Firebase';
import { db } from '../../../Firebase';
import '../../styles/news.css';

export default function News() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const categories = ['all', 'politics', 'business', 'health', 'technology', 'entertainment', 'science', 'history'];

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const categoryFromHash = location.hash.substring(1); // remove the #
      if (categories.includes(categoryFromHash)) {
        setFilter(categoryFromHash);
      }
    }
  }, [location.hash]);
  
  useEffect(() => {
    const newsRef = dbRef(db, 'news');
    const unsubscribe = onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const articles = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
          isFeatured: value.isFeatured || false
        }));
        
        setNewsArticles(articles.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.date) - new Date(a.date);
        }));
      } else {
        setNewsArticles([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredNews = filter === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === filter);

  const currentUser = auth.currentUser;
  const isAdmin = currentUser && currentUser.email === 'zeeshan@gmail.com' ||
  'Khattakjee762@gmail.com' || 'khattak@gmail.com'; // Adjust this condition

  if (loading) return <div className="loading">Loading news...</div>;

  return (
    <section className="news-page">
      <div className="main-text">
        <span>News Updates</span>
        <h2>Latest News</h2>
      </div>

      <div className="filter-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`button ${filter === category ? 'active' : ''}`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredNews.length === 0 ? (
        <div className="no-news">No news articles found.</div>
      ) : (
        <div className="news-gallery">
          {filteredNews.map((article) => (
            <div key={article.id} className={`news-card ${article.isFeatured ? 'featured' : ''}`}>
              {isAdmin && (
                <div className="post-actions">
                  <Link to={`/news/edit/${article.id}`} className="edit-button">
                    Edit
                  </Link>
                </div>
              )}
              
              {article.isFeatured && (
                <div className="featured-badge">Featured</div>
              )}
              
              <Link to={`/news/${article.id}`} className="news-link">
                {article.imageBase64 && (
                  <div className="news-image-container">
                    <img 
                      src={article.imageBase64} 
                      alt={article.title} 
                      className="news-image"
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                <div className="news-content">
                  <h3>{article.title}</h3>
                  <p className="news-excerpt">{article.excerpt}</p>
                  <div className="news-meta">
                    <span>{article.date}</span> | <span>{article.author}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}