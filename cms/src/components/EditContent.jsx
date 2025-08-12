import { useNavigate, useParams } from "react-router-dom"
import { useContent } from "../context/ContentContext";
import { useEffect, useState } from "react";
import { isNotEmpty } from "../utils/validations";

export default function EditContent() {
  const {id} = useParams();
  const {data, editContent} = useContent();
  const navigate = useNavigate();
  const contentToEdit = data.find((item) => item.id === Number(id));

  const [title, setTitle] = useState(contentToEdit?.title || '');
  const [body, setBody] = useState(contentToEdit?.body || '');
  const [category, setCategory] = useState(contentToEdit?.category ||'Misc');
  const [error, setError]  = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if(!contentToEdit) {
      navigate('/view');
    }
  }, [contentToEdit, navigate])

  const handleSubmit = (e) => {
      e.preventDefault();
      if(!isNotEmpty(title) || !isNotEmpty(body)) {
        setError('Please fill title and body for article');
        return;
      }
      const newContent = {
        id: contentToEdit.id,
        title,
        body,
        category,
        date: new Date().toISOString(),
        author: contentToEdit.author
      }
      editContent(newContent);
      navigate('/view')
    }

  return (
    <div className="panel">
      <h2>Edit Content</h2>
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-group">
          <label htmlFor="edit-title">Title:</label>
          <input 
            id="edit-title" 
            type="text" 
            placeholder="Enter title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-body">Content:</label>
          <textarea 
            id="edit-body" 
            placeholder="Enter content" 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-category">Category:</label>
          <select 
            id="edit-category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="News">News</option>
            <option value="Blog">Blog</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Misc">Misc</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input 
              type="checkbox" 
              checked={showPreview} 
              onChange={() => setShowPreview((prev => !prev))}
            />
            Show preview
          </label>
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn">
          Save Changes
        </button>
      </form>
      {showPreview && (
        <div className="preview">
          <h3>Preview</h3>
          <h4>{title || 'Title'}</h4>
          <p>{body || 'Content preview'}</p>
          <small>Category: {category}</small>
        </div>
      )}
    </div>
  )
}