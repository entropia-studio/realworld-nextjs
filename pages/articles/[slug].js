import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import { getArticleBySlug, getArticlePaths, getComments } from '../../lib/api';
import Link from 'next/link';
import { Layout } from '../../components/Layout';
import { Comment } from '../../components/Comment';
import { API_URL } from '../../lib/api';
import { useState, useEffect } from 'react';
import { CommentForm } from '../../components/articles/comments/CommentForm';

export default function Article({ article, comments }) {
  const router = useRouter();
  const { user } = useUser();
  const [profile, setProfile] = useState();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const profileResp = await fetch(
      `${API_URL}/profiles/${article.author.username}`
    );
    const profileJson = await profileResp.json();
    setProfile(profileJson);
  };

  const { title, description, updatedAt, createdAt, body, favoritesCount } =
    article;

  const { username, image } = article.author;

  const manageAuthorSubscription = async (following) => {
    if (!user) {
      router.push('/api/auth/login');
    } else {
      const options = {
        method: following ? 'DELETE' : 'POST',
      };
      const profileResp = await fetch(`/api/follow/${username}`, options);
      const profileJson = await profileResp.json();
      setProfile(profileJson);
    }
  };

  const createComment = (comment) => {
    console.log('create comment', comment);
  };

  const getFollowText = () => {
    if (!user) {
      return 'Follow';
    }
    return profile?.following ? 'Unfollow' : 'Follow';
  };

  return (
    <Layout>
      <div className='article-page'>
        <div className='banner'>
          <div className='container'>
            <h1>{title}</h1>
            <div className='article-meta'>
              <Link href={`./@${username}`}>
                <img src={image} />
              </Link>
              <div className='info'>
                <Link href={`./@${username}`}>
                  <a className='author'>{username}</a>
                </Link>
                <span className='date'>
                  {updatedAt ? updatedAt : createdAt}
                </span>
              </div>
              <button
                className='btn btn-sm btn-outline-secondary'
                onClick={() => manageAuthorSubscription(profile.following)}
              >
                <i className='ion-plus-round'></i>
                &nbsp; {getFollowText()} {username}{' '}
                <span className='counter'></span>
              </button>
              &nbsp;&nbsp;
              <button className='btn btn-sm btn-outline-primary'>
                <i className='ion-heart'></i>
                &nbsp; Favorite Post{' '}
                <span className='counter'>({favoritesCount})</span>
              </button>
            </div>
          </div>
        </div>

        <div className='container page'>
          <div className='row article-content'>
            <div className='col-md-12'>
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

          <div className='article-actions'>
            <div className='article-meta'>
              <Link href={`./@${username}`}>
                <img src={image} />
              </Link>
              <div className='info'>
                <Link href={`./@${username}`}>
                  <a className='author'>{username}</a>
                </Link>
                <span className='date'>
                  {updatedAt ? updatedAt : createdAt}
                </span>
              </div>
              <button
                className='btn btn-sm btn-outline-secondary'
                onClick={() => manageAuthorSubscription(profile.following)}
              >
                <i className='ion-plus-round'></i>
                &nbsp; {getFollowText()} {username}
              </button>
              &nbsp;
              <button className='btn btn-sm btn-outline-primary'>
                <i className='ion-heart'></i>
                &nbsp; Favorite Post{' '}
                <span className='counter'>({favoritesCount})</span>
              </button>
            </div>
          </div>

          <div className='row'>
            <div className='col-xs-12 col-md-8 offset-md-2'>
              {user && (
                <CommentForm
                  image={image}
                  createComment={createComment}
                ></CommentForm>
              )}
              {comments?.length ? (
                comments.map((comment) => (
                  <Comment key={comment.id} {...comment} />
                ))
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
  const { slug } = params;
  const article = (await getArticleBySlug(slug)).article;
  const comments = (await getComments(slug)).comments;

  return {
    props: {
      article,
      comments,
    },
  };
}
