import { contentfulClient } from '../../contentful';

export default async function handler(req, res) {
  try {
    const tags = await (
      await contentfulClient.getTags()
    ).items.map((tagEntry) => tagEntry.name);

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
