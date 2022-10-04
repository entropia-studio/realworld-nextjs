import Link from 'next/link';

export const Comment = ({
  comment,
  deleteComment,
  user,
  isDeleteCommentButtonDisabled,
}) => {
  const { id, description, author, createdAt, updatedAt } = comment;
  const { name, image } = author;

  const onDeleteComment = () => {
    deleteComment(id);
  };

  const isCreatedByUser = author.username === user?.nickname;

  return (
    <div className='card'>
      <div className='card-block'>
        <div
          className='card-text'
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      </div>
      <div className='card-footer'>
        <Link href={`/authors/${author.username}`}>
          <a className='comment-author'>
            <img src={image} className='comment-author-img' />
          </a>
        </Link>
        &nbsp;
        <a className='comment-author'>{name}</a>
        <span className='date-posted'>{updatedAt ? updatedAt : createdAt}</span>
        {isCreatedByUser && (
          <span className='mod-options'>
            <button
              disabled={isDeleteCommentButtonDisabled}
              onClick={onDeleteComment}
              className='btn btn-link btn-sm text-danger'
            >
              <i className='ion-trash-a'></i>
            </button>
          </span>
        )}
      </div>
    </div>
  );
};
