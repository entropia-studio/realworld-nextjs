import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatDateAndTime } from '@contentful/f36-components';
import { getCommentsByArticle } from './comments';

export const getMinifiedArticle = (article, session) => {
  const { slug, title, description, body, tags, user, favorites } =
    article.fields;
  const { createdAt, updatedAt } = article.sys;
  const tagList = tags.map((tag) => {
    return {
      name: tag.fields.name,
    };
  });

  const articleMinified = {
    slug,
    title,
    description: documentToHtmlString(description),
    body: documentToHtmlString(body),
    tagList,
    author: getAuthor(user, session),
    comments: getCommentsByArticle(article),
    createdAt: formatDateAndTime(createdAt, 'day'),
    updatedAt: formatDateAndTime(updatedAt, 'day'),
    favoritesCount: getFavoritesCount(favorites),
  };
  return articleMinified;
};

export const getAuthor = (user, session) => {
  const { username } = user.fields;
  const userSession = session ? session.user : undefined;
  const following = isUserFollowed(userSession);

  const author = {
    username,
    bio: user.fields.bio ? documentToHtmlString(user.fields.bio) : null,
    image: user.fields.image ?? null,
    following,
  };
  return author;
};

export const isUserFollowed = (user) => {
  if (!user?.followers || user?.followers?.length === 0) {
    return false;
  }

  return user.followers?.some(
    (follower) => follower.fields.email === user.email
  );
};

export const getFavoritesCount = (favorites) => {
  return favorites ? favorites.length : 0;
};
