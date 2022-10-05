import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import { FavoriteArticleHeart } from './FavoriteArticleHeart';

export const ArticleRow = ({ article }) => {
  const {
    title,
    description,
    slug,
    updatedAt,
    createdAt,
    favoritesCount,
    tagList,
  } = article;
  const { username, image } = article.author;

  const { user } = useUser();
  const router = useRouter();
  const [isFavoriteButtonDisabled, setIsFavoriteButtonDisabled] =
    useState(false);
  const [favoritesTotal, setFavoritesTotal] = useState(favoritesCount);

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

  return (
    <div className='article-preview'>
      <div
        className='article-meta'
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex' }}>
          <Link href={`/authors/${username}`}>
            <>
              <Image
                src={image}
                width={32}
                height={32}
                alt={`User ${username}`}
              />
            </>
          </Link>
          <div className='info' style={{ paddingLeft: '.5rem' }}>
            <Link href={`/authors/${username}`}>
              <a className='author'>{username}</a>
            </Link>
            <span className='date'>{updatedAt ? updatedAt : createdAt}</span>
          </div>
        </div>

        <FavoriteArticleHeart
          slug={slug}
          manageFavorite={manageFavorite}
          favoritesTotal={favoritesTotal}
          isFavoriteButtonDisabled={isFavoriteButtonDisabled}
        />
      </div>
      <Link href={`/articles/${slug}`}>
        <a className='preview-link'>
          <h1>{title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
          <span>Read more...</span>
          {tagList?.length > 0 && (
            <ul className='tag-list'>
              {tagList.map((tag) => (
                <li
                  key={tag}
                  className='tag-default tag-pill tag-outline ng-binding ng-scope'
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </a>
      </Link>
    </div>
  );
};
