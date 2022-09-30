import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { contentfulClient } from '../../contentful';
import { updateUser } from './utils/users';

export default withApiAuthRequired(async function handler(req, res) {
  const { method } = req;

  try {
    const session = getSession(req, res);

    if (method === 'PUT') {
      const userPayload = JSON.parse(req.body).user;
      const userJson = await updateUser(session.user.email, userPayload);
      return res.status(200).json({ user: userJson });
    }

    const query = {
      content_type: 'realUser',
      include: 10,
      ['fields.email']: session.user.email,
    };

    const user = await (await contentfulClient.getEntries(query)).items[0];

    res.status(200).json({
      user: {
        username: user.fields.username,
        image: user.fields.image,
        bio: documentToHtmlString(user.fields.bio),
      },
    });
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
});
