import { contentfulClient } from '../../contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatDateAndTime } from '@contentful/f36-components';

export default async function handler(req, res) {
  const query = {
    content_type: 'realArticle',
    include: 10,
  };
  const slugs = await (
    await contentfulClient.getEntries(query)
  ).items.map((article) => {
    const { slug } = article.fields;

    return {
      slug,
    };
  });

  res.status(200).json({ slugs: slugs });
}
