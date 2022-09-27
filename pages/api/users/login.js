import { contentfulClient } from '../../../contentful';

export default async function handler(req, res) {
  const query = {
    content_type: 'realUser',
    include: 10,
    ['fields.username']: 'jsanchez',
  };

  try {
    const user = await (await contentfulClient.getEntries(query)).items[0];

    res.status(200).json(user);
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
}
