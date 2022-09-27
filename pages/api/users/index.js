import { contentfulClient } from '../../../contentful';

export default async function handler(req, res) {
  const query = {
    content_type: 'realUser',
    include: 10,
    ['fields.username']: req.body.username,
  };

  try {
    const user = await (await contentfulClient.getEntries(query))[0];

    res.status(200).json(user);
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
}
