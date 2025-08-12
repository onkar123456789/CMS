import { useContent } from "../context/ContentContext"
import { useAuth } from "../context/AuthContext"
import { useState } from "react";
import { isNotEmpty } from "../utils/validations";
import { Link } from "react-router-dom";

export default function ViewContent() {

  const {data, deleteContent, addComment} = useContent();
  const {user} = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Newest');
  const [commentInput, setCommentInput] = useState({});

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this content?')){
      deleteContent(id);
    }
  }

  const handleCommentChange = (contentId, value) => {
    setCommentInput((prev) => ({...prev, [contentId]: value}));
  }

  const handleCommentSubmit = (e, contentId) => {
    e.preventDefault();
    const commentText = commentInput[contentId];
    console.log(commentText);
    if(!isNotEmpty(commentText)) return;
    const newComment = {
      id: Date.now(),
      author: user.username,
      text: commentText,
      date: new Date().toISOString()
    }
    addComment(contentId,newComment);
    setCommentInput((prev) => ({...prev, [contentId]: ''}))
  }

  const filteredContent = data.filter((item) => {
    console.log('Filter satrts', item)
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a,b) => {
    switch(sortOption) {
      case 'Newest':
        return new Date(b.date) - new Date(a.date);
      case 'Oldest':
        return new Date(a.date) - new Date(b.date);
      case 'Title A-Z':
        return a.title.localeCompare(b.title);
      case 'Title Z-A':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  })

  return (
    <div className="panel">
      <h2>View Content</h2>
      <div className="controls">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="fliter-sort">
          <label>
            Filter by Category:
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All</option>
              <option value="News">News</option>
              <option value="Blog">Blog</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Misc">Misc</option>
            </select>
          </label>
          <label>
            Sort by:
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Title A-Z">Title A-Z</option>
              <option value="Title Z-A">Title Z-A</option>
            </select>
          </label>
        </div>
      </div>
      {filteredContent.length === 0 ? (<p>No content available.</p>) : (
        <ul className="content-list">
          {filteredContent.map((item) => (
            <li key={item.id} className="content-item">
              <div className="content-header">
                <div>
                  <h3>{item.title}</h3>
                  <small>Category: {item.category} | Author: {item.author}</small>
                </div>
                {(item.author === user.username) && <div className="content-actions">
                  <Link to={`/edit/${item.id}`} className="btn-edit">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(item.id)} className="btn-delete">
                    Delete
                  </button>
                </div>}
              </div>
              <p>{item.body}</p>
              <small>{new Date(item.date).toLocaleString()}</small>
              <div className="comments-section">
                <h4>Comments</h4>
                {item.comments && item.comments.length > 0 ? (
                  <ul className="comments-list">
                    {item.comments.map((comment) => (
                      <li key={comment.id} className="comment-item">
                        <p>
                          <strong>{comment.author}</strong>: {comment.text}
                        </p>
                        <small>{new Date(comment.date).toLocaleString()}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
                )}
                {((item.author !== user.username)) && <form className="comment-form" onSubmit={(e) => handleCommentSubmit(e, item.id)}>
                  <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInput[item.id] || ''}
                  onChange={(e) => handleCommentChange(item.id, e.target.value)}
                  />
                  <button type="submit" className="btn">
                    Comment
                  </button>
                </form>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}