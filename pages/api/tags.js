import { contentfulClient } from '../../contentful';

export default async function handler(req, res) {
  const query = {
    content_type: 'realTag',
    include: 10,
  };

  try {
    const tags = await (
      await contentfulClient.getEntries(query)
    ).items.map((tagEntry) => tagEntry.fields.name);

    res.status(200).json({
      tags: tags,
    });
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
}
