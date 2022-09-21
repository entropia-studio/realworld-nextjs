import Link from 'next/link';

export const Comment = ({ description, author, createdAt, updatedAt }) => {
  const { name, image } = author;
  return (
    <div class='card'>
      <div class='card-block'>
        <div
          class='card-text'
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      </div>
      <div class='card-footer'>
        <Link href={`./@${author.name}`}>
          <a class='comment-author'>
            <img src={image} class='comment-author-img' />
          </a>
        </Link>
        &nbsp;
        <a class='comment-author'>{name}</a>
        <span class='date-posted'>{updatedAt ? updatedAt : createdAt}</span>
      </div>
    </div>
  );
};
