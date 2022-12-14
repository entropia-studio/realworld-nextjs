import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { contentfulClient } from '../../../contentful';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import {
  getEntryById,
  findUserIdByEmail,
  publishEntry,
} from '../utils/contentful';

export default withApiAuthRequired(async function handler(req, res) {
  const query = {
    content_type: 'realUser',
    include: 10,
    ['fields.username']: req.query.username,
  };

  const { method } = req;
  try {
    if (method !== 'POST' && method !== 'DELETE') {
      throw new Error('Method not implemented');
    }

    const userEntries = await contentfulClient.getEntries(query);
    const { bio } = userEntries.items[0].fields;
    const { id: entryId } = userEntries.items[0].sys;

    const session = await getSession(req, res);
    const { user } = session;
    const entryFields = await managePostDelete(req, entryId, user.email);

    const profile = {
      ...entryFields,
      bio: documentToHtmlString(bio),
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

const managePostDelete = async (req, entryId, userEmail) => {
  const { method } = req;
  const userEntry = await getEntryById(entryId);
  const userId = await findUserIdByEmail(userEmail);
  let following = false;

  if (method === 'POST') {
    following = true;
    const followers = {
      'en-US': [
        ...(userEntry.fields.followers?.['en-US'] ?? []),
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: userId,
          },
        },
      ],
    };

    userEntry.fields = {
      ...userEntry.fields,
      followers,
    };
  } else if (method === 'DELETE') {
    const followers = userEntry.fields.followers['en-US']
      .map((follower) => {
        return {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: follower.sys.id,
          },
        };
      })
      .filter((follower) => follower.sys.id !== userId);
    userEntry.fields.followers['en-US'] = followers;
  }

  const entryUpdated = await userEntry.update();
  await publishEntry(entryId);

  return { ...entryUpdated.fields, following };
};
