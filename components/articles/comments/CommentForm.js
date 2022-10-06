import React, { useState } from 'react';
import Image from 'next/image';

export const CommentForm = ({
  user,
  createComment,
  isPostCommentButtonDisabled,
}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createComment(comment);
    setComment('');
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
        {user && (
          <>
            <Image
              src={user.picture}
              className='comment-author-img'
              width={32}
              height={32}
              alt={`Username ${user.nickname}`}
            />
          </>
        )}
        <button
          className='btn btn-sm btn-primary'
          disabled={isPostCommentButtonDisabled}
        >
          Post Comment
        </button>
      </div>
    </form>
  );
};
