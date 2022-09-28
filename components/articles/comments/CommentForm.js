import React, { useState } from 'react';

export const CommentForm = ({ image, createComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setComment('');
    createComment(comment);
  };

  return (
    <form className='card comment-form' onSubmit={handleSubmit}>
      <div className='card-block'>
        <textarea
          className='form-control'
          placeholder='Write a comment...'
          rows='3'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      <div className='card-footer'>
        <img src={image} className='comment-author-img' />
        <button className='btn btn-sm btn-primary'>Post Comment</button>
      </div>
    </form>
  );
};
