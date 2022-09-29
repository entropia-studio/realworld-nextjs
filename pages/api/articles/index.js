import { contentfulClient } from '../../../contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatDateAndTime } from '@contentful/f36-components';
import { getSession } from '@auth0/nextjs-auth0';
import { createArticle, getAuthor, getFavoritesCount } from '../utils/articles';

export default async function handler(req, res) {
  const query = {
    content_type: 'realArticle',
    include: 10,
  };

  const { method } = req;

  try {
    const session = await getSession(req, res);

    if (method === 'POST') {
      if (!session) {
        throw new Error('User not logged');
      }
      const article = await createArticle(
        session.user,
        JSON.parse(req.body).article
      );
      return res.status(200).json(article);
    }

    const articles = await (
      await contentfulClient.getEntries(query)
    ).items.map((article) => {
      const { slug, title, description, body, user, favorites } =
        article.fields;
      const { createdAt, updatedAt } = article.sys;
      const tagList = article.metadata?.tags?.map((tag) => tag.sys.id);
      const author = getAuthor(user, session);
      const id = article.sys.id;
      return {
        id,
        slug,
        title,
        description: documentToHtmlString(description),
        body: documentToHtmlString(body),
        tagList,
        author,
        createdAt: formatDateAndTime(createdAt, 'day'),
        updatedAt: formatDateAndTime(updatedAt, 'day'),
        favorited: false,
        favoritesCount: getFavoritesCount(favorites),
      };
    });

    res.status(200).json({ articles: articles });
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
}
