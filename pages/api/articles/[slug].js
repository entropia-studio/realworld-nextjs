import { contentfulClient } from '../../../contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatDateAndTime } from '@contentful/f36-components';
import { getAuthor, getFavoritesCount } from '../articles';

export default async function handler(req, res) {
  const { slug } = req.query;
  const query = {
    content_type: 'realArticle',
    include: 10,
    ['fields.slug']: slug,
  };
  const articles = await (
    await contentfulClient.getEntries(query)
  ).items.map((article) => {
    const { slug, title, description, body, tags, user, favorites } =
      article.fields;
    const { createdAt, updatedAt } = article.sys;
    const tagList = tags.map((tag) => {
      return {
        name: tag.fields.name,
      };
    });
    return {
      slug,
      title,
      description: documentToHtmlString(description),
      body: documentToHtmlString(body),
      tagList,
      author: getAuthor(user),
      comments: getComments(article),
      createdAt: formatDateAndTime(createdAt, 'day'),
      updatedAt: formatDateAndTime(updatedAt, 'day'),
      favoritesCount: getFavoritesCount(favorites),
    };
  });
  try {
    res.status(200).json({ article: articles[0] });
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
}

const getComments = (article) => {
  const comments = article.fields.comments?.map((comment) => {
    const { user, description } = comment.fields;
    const { createdAt, updatedAt } = comment.sys;
    return {
      author: getAuthor(user),
      description: documentToHtmlString(description),
      createdAt: formatDateAndTime(createdAt, 'day'),
      updatedAt: formatDateAndTime(updatedAt, 'day'),
    };
  });
  return comments;
};
