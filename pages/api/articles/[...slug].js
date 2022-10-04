import { contentfulClient } from '../../../contentful';
import { getSession } from '@auth0/nextjs-auth0';
import { getMinifiedArticle } from '../utils/articles';
import {
  getCommentsByArticle,
  postComment,
  deleteComment,
} from '../utils/comments';

import { updateArticle, deleteArticle } from '../utils/articles';
import {
  addFavorite,
  deleteFavorite,
  isArticleFavorited,
} from '../utils/favorites';

export default async function handler(req, res) {
  const slug = req.query.slug[0];
  const action = req.query.slug?.length > 1 ? req.query.slug[1] : undefined;

  const query = {
    content_type: 'realArticle',
    include: 10,
    ['fields.slug']: slug,
  };

  try {
    const session = await getSession(req, res);
    const userSession = session ? session.user : undefined;
    const article = await (await contentfulClient.getEntries(query)).items[0];
    let articleResponse = await getMinifiedArticle(article, session);
    const { method } = req;

    if (method !== 'GET') {
      if (!userSession) {
        throw new Error('User not logged');
      }
    }

    if (action === 'comments') {
      let payload;
      switch (method) {
        case 'GET':
          payload = {
            comments: getCommentsByArticle(article),
          };
          break;
        case 'POST':
          const body = JSON.parse(req.body);
          payload = await postComment(userSession, article, body.comment.body);
          break;
        case 'DELETE':
          const idComment = req.query.slug[2];
          payload = await deleteComment(article, idComment);
          break;
      }
      return res.status(200).json(payload);
    }

    if (action === 'favorite') {
      switch (method) {
        case 'GET':
          const isFavorited = await isArticleFavorited(
            article.fields?.favorites,
            session?.user?.email
          );
          articleResponse = {
            favorited: isFavorited,
          };
          break;
        case 'POST':
          articleResponse = await addFavorite(slug, session.user?.email);
          break;
        case 'DELETE':
          articleResponse = await deleteFavorite(slug, session.user?.email);
          break;
      }
      return res.status(200).json({ article: articleResponse });
    }

    switch (method) {
      case 'PUT':
        articleResponse = await updateArticle(
          session.user,
          slug,
          JSON.parse(req.body).article
        );
        break;
      case 'DELETE':
        articleResponse = await deleteArticle(slug);
        break;
    }

    res.status(200).json({ article: articleResponse });
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
}
