import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import useSWR from 'swr';
import { getArticleBySlug, getArticlePaths, getComments } from '../../lib/api';
import { Layout } from '../../components/Layout';
import { useState } from 'react';
import { API_URL } from '../../lib/api';
import { fetcher } from '../../lib/util';
import { Comment } from '../../components/Comment';
import { CommentForm } from '../../components/articles/comments/CommentForm';
import FollowAuthor from '../../components/articles/FollowAuthor';
import EditDeleteArticle from '../../components/articles/EditDeleteArticle';
import { FavoriteArticle } from '../../components/articles/FavoriteArticle';

export default function Article({ article, comments }) {
  const {
    title,
    description,
    updatedAt,
    createdAt,
    body,
    favoritesCount,
    slug,
  } = article;

  const [favoritesTotal, setFavoritesTotal] = useState(favoritesCount);
  const [isFavoriteButtonEnabled, setIsFavoriteButtonEnabled] = useState(false);
  const [isFollowButtonDisabled, setIsFollowButtonDisabled] = useState(false);

  const { data: profileData, error } = useSWR(
    `${API_URL}/profiles/${article.author.username}`,
    fetcher
  );
  const router = useRouter();
  const { user } = useUser();

  const [commentList, setComments] = useState(comments);
  const { username, image } = article.author;

  const manageAuthorSubscription = async (following) => {
    if (!user) {
      router.push('/api/auth/login');
      return;
    }
    const options = {
      method: following ? 'DELETE' : 'POST',
    };
    setIsFollowButtonDisabled(true);
    await fetch(`/api/follow/${username}`, options);
    setIsFollowButtonDisabled(false);
  };

  const manageFavorite = async (favorite) => {
    if (!user) {
      router.push('/api/auth/login');
      return;
    }
    setIsFavoriteButtonEnabled(true);
    const options = {
      method: favorite ? 'DELETE' : 'POST',
    };

    const getFavoritesTotal = (favoritesTotal) =>
      favorite ? favoritesTotal - 1 : favoritesTotal + 1;

    await fetch(`/api/articles/${slug}/favorite`, options);
    setFavoritesTotal(getFavoritesTotal(favoritesTotal));
    setIsFavoriteButtonEnabled(false);
  };

  const createComment = async (payload) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        comment: {
          body: payload,
        },
      }),
    };
    const commentResp = await fetch(
      `${API_URL}/articles/${article.slug}/comments`,
      options
    );

    const commentJson = await commentResp.json();
    setComments([...(commentList ?? []), commentJson]);
  };

  const deleteComment = async (id) => {
    const options = {
      method: 'DELETE',
    };
    await fetch(`${API_URL}/articles/${article.slug}/comments/${id}`, options);
    setComments(commentList.filter((comment) => comment.id !== id));
  };

  const editArticle = async () => {
    router.push(`../editor/${slug}`);
  };

  const deleteArticle = async () => {
    const options = {
      method: 'DELETE',
    };
    await fetch(`${API_URL}/articles/${article.slug}`, options);
    router.push('/');
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
              {user?.nickname !== article.author.username ? (
                <>
                  <FollowAuthor
                    manageAuthorSubscription={manageAuthorSubscription}
                    username={username}
                    isFollowButtonDisabled={isFollowButtonDisabled}
                  />
                  &nbsp;&nbsp;
                  <FavoriteArticle
                    slug={slug}
                    manageFavorite={manageFavorite}
                    favoritesTotal={favoritesTotal}
                    isFavoriteButtonEnabled={isFavoriteButtonEnabled}
                  />
                </>
              ) : (
                <EditDeleteArticle
                  deleteArticle={deleteArticle}
                  editArticle={editArticle}
                />
              )}
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
              {user?.nickname !== article.author.username ? (
                <>
                  <FollowAuthor
                    username={username}
                    manageAuthorSubscription={manageAuthorSubscription}
                    isFollowButtonDisabled={isFollowButtonDisabled}
                  />
                  &nbsp;&nbsp;
                  <FavoriteArticle
                    slug={slug}
                    manageFavorite={manageFavorite}
                    favoritesTotal={favoritesTotal}
                    isFavoriteButtonEnabled={isFavoriteButtonEnabled}
                  />
                </>
              ) : (
                <EditDeleteArticle
                  deleteArticle={deleteArticle}
                  editArticle={editArticle}
                />
              )}
            </div>
          </div>

          <div className='row'>
            <div className='col-xs-12 col-md-8 offset-md-2'>
              {user && (
                <CommentForm
                  user={user}
                  createComment={createComment}
                ></CommentForm>
              )}
              {commentList?.length &&
                commentList.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    deleteComment={deleteComment}
                    user={user}
                  />
                ))}
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
  const comments = (await getComments(slug)).comments ?? null;

  return {
    props: {
      article,
      comments,
    },
  };
}
