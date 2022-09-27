import { contentfulClient } from '../../contentful';

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
