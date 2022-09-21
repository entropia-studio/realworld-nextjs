import { getArticleBySlug, getArticlePaths } from '../../lib/api';
import Link from 'next/link';
import { Layout } from '../../components/Layout';
import { Comment } from '../../components/Comment';

export default function Article({ article }) {
  console.log(article);
  const { title, description, updatedAt, createdAt, body, comments } = article;
  const { username, image } = article.author;
  return (
    <Layout>
      <div class='article-page'>
        <div class='banner'>
          <div class='container'>
            <h1>{title}</h1>
            <div class='article-meta'>
              <Link href={`./@${username}`}>
                <img src={image} />
              </Link>
              <div class='info'>
                <Link href={`./@${username}`}>
                  <a className='author'>{username}</a>
                </Link>
                <span class='date'>{updatedAt ? updatedAt : createdAt}</span>
              </div>
              <button class='btn btn-sm btn-outline-secondary'>
                <i class='ion-plus-round'></i>
                &nbsp; Follow {username} <span class='counter'>(10)</span>
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
              <Link href={`./@${username}`}>
                <img src={image} />
              </Link>
              <div class='info'>
                <Link href={`./@${username}`}>
                  <a className='author'>{username}</a>
                </Link>
                <span class='date'>{updatedAt ? updatedAt : createdAt}</span>
              </div>
              <button class='btn btn-sm btn-outline-secondary'>
                <i class='ion-plus-round'></i>
                &nbsp; Follow {username}
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
              {comments?.length ? (
                comments.map((comment) => <Comment {...comment} />)
              ) : (
                <div className='mt-2'></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
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
