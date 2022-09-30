import { contentfulClient } from '../../../contentful';
import { getSession } from '@auth0/nextjs-auth0';
import { getMinifiedArticle } from '../utils/articles';
import {
  getCommentsByArticle,
  postComment,
  deleteComment,
} from '../utils/comments';

import { updateArticle, deleteArticle } from '../utils/articles';

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
    const { method } = req;
    let articleResponse = getMinifiedArticle(article, session);

    if (action === 'comments') {
      let payload;
      switch (method) {
        case 'GET':
          payload = {
            comments: getCommentsByArticle(article),
          };
          break;
        case 'POST':
          if (!userSession) {
            throw new Error('User not logged');
          }
          const body = JSON.parse(req.body);
          payload = await postComment(userSession, article, body.comment.body);
          break;
        case 'DELETE':
          if (!userSession) {
            throw new Error('User not logged');
          }
          const idComment = req.query.slug[2];
          payload = await deleteComment(article, idComment);
          break;
      }
      return res.status(200).json(payload);
    }

    if (method === 'PUT' || method === 'DELETE') {
      if (!session) {
        throw new Error('User not logged');
      }
      switch (method) {
        case 'PUT':
          if (!session) {
            throw new Error('User not logged');
          }
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
