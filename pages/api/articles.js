import { contentfulClient } from '../../contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatDateAndTime } from '@contentful/f36-components';
import { getSession } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
  const query = {
    content_type: 'realArticle',
    include: 10,
  };

  try {
    const session = await getSession(req, res);
    const articles = await (
      await contentfulClient.getEntries(query)
    ).items.map((article) => {
      const { slug, title, description, body, tags, user, favorites } =
        article.fields;
      const { createdAt, updatedAt } = article.sys;
      const tagList = tags.map((tag) => {
        return {
          name: tag.fields.name,
        };
      });
      const author = getAuthor(user, session);
      return {
        slug,
        title,
        description: documentToHtmlString(description),
        body: documentToHtmlString(body),
        tagList,
        author,
        createdAt: formatDateAndTime(createdAt, 'day'),
        updatedAt: formatDateAndTime(updatedAt, 'day'),
        favorited: false,
        favoritesCount: getFavoritesCount(favorites),
      };
    });

    res.status(200).json({ articles: articles });
  } catch (error) {
    res.status(422).json({
      errors: {
        body: [error.message || 'Server error'],
      },
    });
  }
}

export const getAuthor = (user, session) => {
  const { username, bio, image } = user.fields;
  const userSession = session ? session.user : undefined;
  const following = isUserFollowed(userSession);

  return {
    username,
    bio: documentToHtmlString(bio),
    image,
    following,
  };
};

export const isUserFollowed = (user) => {
  if (!user?.followers || user?.followers?.length === 0) {
    return false;
  }

  return user.followers?.some(
    (follower) => follower.fields.email === user.email
  );
};

export const getFavoritesCount = (favorites) => {
  return favorites ? favorites.length : 0;
};
