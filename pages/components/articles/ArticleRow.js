import Link from 'next/link';
export const ArticleRow = ({ article }) => {
  const { title, description, slug, updatedAt, createdAt } = article;
  const { name, image } = article.author;
  return (
    <div className='article-preview'>
      <div className='article-meta'>
        <Link href={`./@${name}`}>
          <img src={image} />
        </Link>
        <div className='info'>
          <Link href={`./@${name}`}>
            <a className='author'>{name}</a>
          </Link>
          <span className='date'>{updatedAt ? updatedAt : createdAt}</span>
        </div>
        <button className='btn btn-outline-primary btn-sm pull-xs-right'>
          <i className='ion-heart'></i> 29
        </button>
      </div>
      <Link href={`./article/${slug}`}>
        <a className='preview-link'>
          <h1>{title}</h1>
          <p
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
