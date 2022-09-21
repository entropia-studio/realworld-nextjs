import { contentfulClient } from '../../contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatDateAndTime } from '@contentful/f36-components';

export default async function handler(req, res) {
  const query = {
    content_type: 'realArticle',
    include: 10,
  };
  const articles = await (
    await contentfulClient.getEntries(query)
  ).items.map((article) => {
    const { slug, title, description, body, tags, user } = article.fields;
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
      createdAt: formatDateAndTime(createdAt, 'day'),
      updatedAt: formatDateAndTime(updatedAt, 'day'),
    };
  });

  res.status(200).json({ articles: articles });
}

export const getAuthor = (user) => {
  const { username, bio, image } = user.fields;
  return {
    username,
    bio: documentToHtmlString(bio),
    image,
  };
};
