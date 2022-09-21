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
    const { slug, title, description, body, tags, author } = article.fields;
    const { name, bio, image } = author.fields;
    const { createdAt, updatedAt } = author.sys;
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
      author: {
        name,
        bio: documentToHtmlString(bio),
        image: `https:${image.fields.file.url}`,
      },
      createdAt: formatDateAndTime(createdAt, 'day'),
      updatedAt: formatDateAndTime(updatedAt, 'day'),
    };
  });

  res.status(200).json({ articles: articles });
}
