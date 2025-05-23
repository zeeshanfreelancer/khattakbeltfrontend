import React, { useState, useEffect } from 'react';
import { dbRef, push, update, remove, onValue } from '../../../Firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../../Firebase';
import '../../styles/newsform.css';

export default function NewsForm({ onSuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    category: 'Infrastructure',
    imageBase64: '',
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    isFeatured: false
  });

  useEffect(() => {
    if (isEditMode && id) {
      const newsRef = dbRef(db, `news/${id}`);
      const unsubscribe = onValue(newsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setFormData({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            author: data.author || 'Admin',
            category: data.category || '',
            imageBase64: data.imageBase64 || '',
            date: data.date || new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            isFeatured: data.isFeatured || false
          });
        }
      });
      return () => unsubscribe();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500000) {
      toast.error('Image must be smaller than 500KB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        imageBase64: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    if (!formData.imageBase64) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await update(dbRef(db, `news/${id}`), formData);
        toast.success('Post updated successfully!');
      } else {
        await push(dbRef(db, 'news'), formData);
        toast.success('Post created successfully!');
      }
      
      if (onSuccess) onSuccess();
      navigate('/news');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      try {
        await remove(dbRef(db, `news/${id}`));
        toast.success('Post deleted successfully!');
        navigate('/news');
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="news-form-container">
      <h2>{isEditMode ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength="100"
            placeholder="Enter news title"
          />
        </div>

        <div className="form-group">
          <label>Excerpt (Short Description)</label>
          <input
            type="text"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            maxLength="200"
            placeholder="Brief summary of the news"
          />
        </div>

        <div className="form-group">
          <label>Content*</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Write the full news content here"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="politics">Politics</option>
            <option value="business">Business</option>
            <option value="health">Health</option>
            <option value="technology">Technology</option>
            <option value="entertainment">Entertainment</option>
            <option value="science">Science</option>
            <option value="history">History</option>
          </select>
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author name"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            Featured Article
          </label>
        </div>

        <div className="form-group">
          <label>Image* (Max 500KB, JPG/PNG)</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            required={!isEditMode}
          />
          {formData.imageBase64 && (
            <div className="image-preview">
              <img src={formData.imageBase64} alt="Preview" />
              <button 
                type="button" 
                onClick={() => setFormData(prev => ({ ...prev, imageBase64: '' }))}
                className="remove-image"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Publishing...') : 
             (isEditMode ? 'Update Post' : 'Publish Post')}
          </button>
          
          {isEditMode && (
            <button 
              type="button" 
              onClick={handleDelete}
              className="delete-button"
            >
              Delete Post
            </button>
          )}
        </div>
      </form>
    </div>
  );
}