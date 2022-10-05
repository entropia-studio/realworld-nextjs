import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';
import { getArticleBySlug, getArticlePaths, getComments } from '../../lib/api';
import { Layout } from '../../components/Layout';
import { useState } from 'react';
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
  const [isFavoriteButtonDisabled, setIsFavoriteButtonDisabled] =
    useState(false);
  const [isDeleteArticleButtonDisabled, setIsDeleteArticleButtonDisabled] =
    useState(false);
  const [isDeleteCommentButtonDisabled, setIsDeleteCommentButtonDisabled] =
    useState(false);
  const [isFollowButtonDisabled, setIsFollowButtonDisabled] = useState(false);
  const [isPostCommentButtonDisabled, setIsPostCommentButtonDisabled] =
    useState(false);

  const router = useRouter();
  const { user } = useUser();

  const [commentList, setComments] = useState(comments);
  const { username, image } = article.author;

  const manageAuthorSubscription = async (following) => {
    if (!user) {
      router.push(`/api/auth/login`);
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
      router.push(`/api/auth/login`);
      return;
    }
    const options = {
      method: favorite ? 'DELETE' : 'POST',
    };

    const getFavoritesTotal = (favoritesTotal) =>
      favorite ? favoritesTotal - 1 : favoritesTotal + 1;

    setIsFavoriteButtonDisabled(true);
    await fetch(`/api/articles/${slug}/favorite`, options);
    setFavoritesTotal(getFavoritesTotal(favoritesTotal));
    setIsFavoriteButtonDisabled(false);
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
    setIsPostCommentButtonDisabled(true);
    const commentResp = await fetch(
      `/api/articles/${article.slug}/comments`,
      options
    );
    const commentJson = await commentResp.json();
    setIsPostCommentButtonDisabled(false);
    setComments([...(commentList ?? []), commentJson]);
  };

  const deleteComment = async (id) => {
    const options = {
      method: 'DELETE',
    };
    setIsDeleteCommentButtonDisabled(true);
    await fetch(`/api/articles/${article.slug}/comments/${id}`, options);
    setIsDeleteCommentButtonDisabled(false);
    setComments(commentList.filter((comment) => comment.id !== id));
  };

  const editArticle = async () => {
    router.push(`/editor/${slug}`);
  };

  const deleteArticle = async () => {
    const options = {
      method: 'DELETE',
    };
    setIsDeleteArticleButtonDisabled(true);
    await fetch(`/api/articles/${article.slug}`, options);
    setIsDeleteArticleButtonDisabled(false);
    router.push('/');
  };

  return (
    <Layout>
      <div className='article-page'>
        <div className='banner'>
          <div className='container'>
            <h1>{title}</h1>
            <div className='article-meta' style={{ display: 'flex' }}>
              <div style={{ display: 'flex' }}>
                <Link href={`/authors/${username}`}>
                  <>
                    <Image
                      src={image}
                      width={32}
                      height={32}
                      alt={`Username ${username}`}
                    />
                  </>
                </Link>
                <div className='info' style={{ paddingLeft: '.5rem' }}>
                  <Link href={`/authors/${username}`}>
                    <a className='author'>{username}</a>
                  </Link>
                  <span className='date'>
                    {updatedAt ? updatedAt : createdAt}
                  </span>
                </div>
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
                    isFavoriteButtonDisabled={isFavoriteButtonDisabled}
                  />
                </>
              ) : (
                <EditDeleteArticle
                  deleteArticle={deleteArticle}
                  editArticle={editArticle}
                  isDeleteArticleButtonDisabled={isDeleteArticleButtonDisabled}
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
            <div
              className='article-meta'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div style={{ display: 'flex' }}>
                <Link href={`/authors/${username}`}>
                  <>
                    <Image
                      src={image}
                      width={32}
                      height={32}
                      alt={`Username ${username}`}
                    />
                  </>
                </Link>
                <div className='info' style={{ paddingLeft: '.5rem' }}>
                  <Link href={`/authors/${username}`}>
                    <a className='author'>{username}</a>
                  </Link>
                  <span className='date'>
                    {updatedAt ? updatedAt : createdAt}
                  </span>
                </div>
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
                    isFavoriteButtonDisabled={isFavoriteButtonDisabled}
                  />
                </>
              ) : (
                <EditDeleteArticle
                  deleteArticle={deleteArticle}
                  editArticle={editArticle}
                  isDeleteArticleButtonDisabled={isDeleteArticleButtonDisabled}
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
                  isPostCommentButtonDisabled={isPostCommentButtonDisabled}
                ></CommentForm>
              )}
              {commentList?.length > 0 &&
                commentList.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    deleteComment={deleteComment}
                    user={user}
                    isDeleteCommentButtonDisabled={
                      isDeleteCommentButtonDisabled
                    }
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
    fallback: true,
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
