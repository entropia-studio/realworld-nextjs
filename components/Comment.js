import Link from 'next/link';

export const Comment = ({
  id,
  description,
  author,
  createdAt,
  updatedAt,
  deleteComment,
  user,
}) => {
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
        <Link href={`./@${author.name}`}>
          <a className='comment-author'>
            <img src={image} className='comment-author-img' />
          </a>
        </Link>
        &nbsp;
        <a className='comment-author'>{name}</a>
        <span className='date-posted'>{updatedAt ? updatedAt : createdAt}</span>
        {isCreatedByUser && (
          <span class='mod-options'>
            <i class='ion-trash-a' onClick={onDeleteComment}></i>
          </span>
        )}
      </div>
    </div>
  );
};
