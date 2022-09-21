import { getArticleBySlug, getArticlePaths } from '../../lib/api';
import Link from 'next/link';

export default function Article({ article }) {
  console.log(article);
  const { title, description, updatedAt, createdAt, body, comments } = article;
  const { name, image } = article.author;
  return (
    <div class='article-page'>
      <div class='banner'>
        <div class='container'>
          <h1>{title}</h1>
          <div class='article-meta'>
            <Link href={`./@${name}`}>
              <img src={image} />
            </Link>
            <div class='info'>
              <Link href={`./@${name}`}>
                <a className='author'>{name}</a>
              </Link>
              <span class='date'>{updatedAt ? updatedAt : createdAt}</span>
            </div>
            <button class='btn btn-sm btn-outline-secondary'>
              <i class='ion-plus-round'></i>
              &nbsp; Follow {name} <span class='counter'>(10)</span>
            </button>
            &nbsp;&nbsp;
            <button class='btn btn-sm btn-outline-primary'>
              <i class='ion-heart'></i>
              &nbsp; Favorite Post <span class='counter'>(29)</span>
            </button>
          </div>
        </div>
      </div>

      <div class='container page'>
        <div class='row article-content'>
          <div class='col-md-12'>
            <div
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
            <h2 id='introducing-ionic'>{title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: body,
              }}
            />
          </div>
        </div>

        <hr />

        <div class='article-actions'>
          <div class='article-meta'>
            <Link href={`./@${name}`}>
              <img src={image} />
            </Link>
            <div class='info'>
              <Link href={`./@${name}`}>
                <a className='author'>{name}</a>
              </Link>
              <span class='date'>{updatedAt ? updatedAt : createdAt}</span>
            </div>
            <button class='btn btn-sm btn-outline-secondary'>
              <i class='ion-plus-round'></i>
              &nbsp; Follow {name}
            </button>
            &nbsp;
            <button class='btn btn-sm btn-outline-primary'>
              <i class='ion-heart'></i>
              &nbsp; Favorite Post <span class='counter'>(29)</span>
            </button>
          </div>
        </div>

        <div class='row'>
          <div class='col-xs-12 col-md-8 offset-md-2'>
            <form class='card comment-form'>
              <div class='card-block'>
                <textarea
                  class='form-control'
                  placeholder='Write a comment...'
                  rows='3'
                ></textarea>
              </div>
              <div class='card-footer'>
                <img src={image} class='comment-author-img' />
                <button class='btn btn-sm btn-primary'>Post Comment</button>
              </div>
            </form>
            {comments.map((comment) => (
              <div class='card'>
                <div class='card-block'>
                  <div
                    class='card-text'
                    dangerouslySetInnerHTML={{
                      __html: comment.description,
                    }}
                  />
                </div>
                <div class='card-footer'>
                  <Link href={`./@${comment.author.name}`}>
                    <a class='comment-author'>
                      <img
                        src={comment.author.image}
                        class='comment-author-img'
                      />
                    </a>
                  </Link>
                  &nbsp;
                  <a class='comment-author'>{comment.author.name}</a>
                  <span class='date-posted'>Dec 29th</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = await getArticlePaths();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = (await getArticleBySlug(params.slug)).article;

  return {
    props: {
      article,
    },
  };
}
