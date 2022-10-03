import { getArticleBySlug } from '../../../lib/api';
import { getArticleCreateUpdateResponse } from './articles';
import {
  findArticleIdBySlug,
  findUserIdByEmail,
  getEntryById,
  publishEntry,
} from './contentful';

export const addFavorite = async (slug, email) => {
  const articleId = await findArticleIdBySlug(slug);
  const articleEntry = await getEntryById(articleId);
  const userId = await findUserIdByEmail(email);

  let favorites = [
    {
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: userId,
      },
    },
  ];

  if (articleEntry.fields.favorites?.['en-US']) {
    favorites = [...favorites, ...articleEntry.fields.favorites['en-US']];
  }

  articleEntry.fields.favorites = {
    'en-US': favorites,
  };

  await articleEntry.update();
  await publishEntry(articleId);

  const articleResponse = {
    ...getArticleCreateUpdateResponse(articleEntry),
    favoritesCount: favorites.length,
  };

  return articleResponse;
};
export const deleteFavorite = async (slug, email) => {
  const articleId = await findArticleIdBySlug(slug);
  const articleEntry = await getEntryById(articleId);
  const userId = await findUserIdByEmail(email);

  articleEntry.fields.favorites = {
    'en-US': articleEntry.fields.favorites?.['en-US'].filter(
      (favorite) => favorite.sys.id !== userId
    ),
  };

  await articleEntry.update();
  await publishEntry(articleId);

  const articleResponse = {
    ...getArticleCreateUpdateResponse(articleEntry),
    favoritesCount: articleEntry.fields.favorites.length,
  };

  return articleResponse;
};

export const isArticleFavorited = async (favorites, email) => {
  if (!favorites || !email) {
    return false;
  }

  const userId = await findUserIdByEmail(email);

  return favorites?.some((favorite) => favorite.sys.id === userId);
};
