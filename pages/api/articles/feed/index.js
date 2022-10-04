import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { getFeedArticles } from '../../utils/articles';

export default withApiAuthRequired(async (req, res) => {
  try {
    const session = await getSession(req, res);
    const articles = await getFeedArticles(session);
    res.status(200).json({ articles: articles });
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
});
