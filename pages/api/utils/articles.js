import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatDateAndTime } from '@contentful/f36-components';
import { getCommentsByArticle } from './comments';
import { findUserIdByEmail, getRichText, publishEntry } from './contentful';
import { contentfulManagementEnvironment } from '../../../contentful/management';
import { contentfulClient } from '../../../contentful';
import { createTag } from './tags';
import slugify from 'slugify';

export const createArticle = async (user, article) => {
  const userId = await findUserIdByEmail(user.email);
  const tagList = getTagList(article.tags);
  const tags = await getTagsForArticle(tagList);
  const { title, description, body } = article;
  const slug = slugify(title);

  const articleJson = {
    metadata: {
      tags: tags?.length ? tags : [],
    },
    fields: {
      slug: { 'en-US': slug },
      title: { 'en-US': title },
      description: { 'en-US': getRichText(description) },
      body: { 'en-US': getRichText(body) },
      user: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: userId,
          },
        },
      },
    },
  };

  const articleEntry = await (
    await contentfulManagementEnvironment()
  ).createEntry('realArticle', articleJson);

  await publishEntry(articleEntry.sys.id);

  return {
    article: {
      title,
      description,
      body,
      slug,
      tagList,
    },
  };
};

const getTagList = (tagStr) => {
  if (tagStr.trim().length === 0) {
    return null;
  }
  return tagStr
    .trim()
    .split(',')
    .map((tag) => tag.trim());
};

export const getTagsForArticle = async (articleTagList) => {
  if (!articleTagList) {
    return null;
  }
  // Get all the environment tags
  const contentfulTags = await (await contentfulClient.getTags()).items;
  const tags = await Promise.all(
    articleTagList.map(async (articleTag) => {
      const articleName = articleTag.trim();
      // Search if the tag is created on Contentful
      const isTagCreated = contentfulTags.some(
        (tag) => tag.name === articleName
      );
      if (!isTagCreated) {
        await createTag(articleName);
      }
      return {
        sys: {
          type: 'Link',
          linkType: 'Tag',
          id: articleName,
        },
      };
    })
  );
  return tags;
};

export const getMinifiedArticle = (article, session) => {
  const { slug, title, description, body, user, favorites } = article.fields;
  const { createdAt, updatedAt } = article.sys;
  const tagList = article.metadata.tags?.map((tag) => tag.sys.id);

  const articleMinified = {
    slug,
    title,
    description: documentToHtmlString(description),
    body: documentToHtmlString(body),
    tagList,
    author: getAuthor(user, session),
    comments: getCommentsByArticle(article),
    createdAt: formatDateAndTime(createdAt, 'day'),
    updatedAt: formatDateAndTime(updatedAt, 'day'),
    favoritesCount: getFavoritesCount(favorites),
  };
  return articleMinified;
};

export const getAuthor = (user, session) => {
  const { username } = user.fields;
  const userSession = session ? session.user : undefined;
  const following = isUserFollowed(userSession);

  const author = {
    username,
    bio: user.fields.bio ? documentToHtmlString(user.fields.bio) : null,
    image: user.fields.image ?? null,
    following,
  };
  return author;
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
