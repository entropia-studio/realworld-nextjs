import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { contentfulClient } from '../../../contentful';
import { getSession } from '@auth0/nextjs-auth0';

export default (async function handler(req, res) {
  const query = {
    content_type: 'realUser',
    include: 10,
    ['fields.username']: req.query.username,
  };

  let following = false;

  try {
    const userEntries = await contentfulClient.getEntries(query);
    const { username, email, bio, image, followers } =
      userEntries.items[0].fields;
    const session = await getSession(req, res);

    if (session) {
      const { user } = session;
      following = isUserFollowing(followers, user.email);
    }

    const profile = {
      username,
      email,
      bio: documentToHtmlString(bio),
      image,
      following,
    };

    res.status(200).json(profile);
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
});

const isUserFollowing = (followers, email) => {
  if (followers?.length < 1) {
    return false;
  }
  return followers?.some((follower) => follower.fields.email === email);
};
