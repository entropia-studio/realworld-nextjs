import Link from 'next/link';

export const Comment = ({ description, author, createdAt, updatedAt }) => {
  const { name, image } = author;
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
      </div>
    </div>
  );
};
