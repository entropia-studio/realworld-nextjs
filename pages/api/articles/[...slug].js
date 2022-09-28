import { contentfulClient } from '../../../contentful';
import { getSession } from '@auth0/nextjs-auth0';
import { getMinifiedArticle } from '../utils/articles';
import { getCommentsByArticle, postCommentForArticle } from '../utils/comments';

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

    if (action === 'comments') {
      const { method } = req;
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
          payload = await postCommentForArticle(
            userSession,
            article,
            body.comment.body
          );
          break;
      }
      return res.status(200).json(payload);
    }
    const articleMinified = getMinifiedArticle(article, session);
    res.status(200).json({ article: articleMinified });
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
}
