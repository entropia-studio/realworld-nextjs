import Link from 'next/link';
export const ArticleRow = ({ article }) => {
  const { title, description, slug, updatedAt, createdAt, favoritesCount } =
    article;
  const { username, image } = article.author;
  return (
    <div className='article-preview'>
      <div className='article-meta'>
        <Link href={`./@${username}`}>
          <img src={image} />
        </Link>
        <div className='info'>
          <Link href={`./@${username}`}>
            <a className='author'>{username}</a>
          </Link>
          <span className='date'>{updatedAt ? updatedAt : createdAt}</span>
        </div>
        <button className='btn btn-outline-primary btn-sm pull-xs-right'>
          <i className='ion-heart'></i> {favoritesCount}
        </button>
      </div>
      <Link href={`./articles/${slug}`}>
        <a className='preview-link'>
          <h1>{title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
          <span>Read more...</span>
        </a>
      </Link>
    </div>
  );
};
