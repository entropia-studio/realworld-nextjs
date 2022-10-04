import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatDateAndTime } from '@contentful/f36-components';
import { getCommentsByArticle } from './comments';
import {
  deleteEntryById,
  findArticleIdBySlug,
  findFollowedAuthors,
  findUserIdByEmail,
  getArticlesByAuthorId,
  getEntryById,
  getRichText,
  publishEntry,
} from './contentful';
import { contentfulManagementEnvironment } from '../../../contentful/management';
import { contentfulClient } from '../../../contentful';
import { createTag } from './tags';
import slugify from 'slugify';

export const createArticle = async (user, article) => {
  const articleJson = await getArticleToContentful(user, article);

  const articleEntry = await (
    await contentfulManagementEnvironment()
  ).createEntry('realArticle', articleJson);

  await publishEntry(articleEntry.sys.id);

  return getArticleCreateUpdateResponse(articleJson);
};

export const updateArticle = async (user, slug, article) => {
  const articleJson = await getArticleToContentful(user, article);

  const articleId = await findArticleIdBySlug(slug);

  const articleEntry = await getEntryById(articleId);

  articleEntry.fields = { ...articleJson.fields };
  articleEntry.metadata = { ...articleJson.metadata };

  await articleEntry.update();
  await publishEntry(articleId);

  return getArticleCreateUpdateResponse(articleJson);
};

export const deleteArticle = async (slug) => {
  const articleId = await findArticleIdBySlug(slug);
  const articleEntry = await getEntryById(articleId);
  await articleEntry.unpublish();
  await deleteEntryById(articleId);
  return {};
};

export const getArticleCreateUpdateResponse = (articleContentful) => {
  const article = {
    title: articleContentful.fields.title['en-US'],
    description: articleContentful.fields.description['en-US'],
    body: articleContentful.fields.body['en-US'],
    slug: articleContentful.fields.slug['en-US'],
    tagList: articleContentful.metadata.tags,
  };
  return article;
};

const getArticleToContentful = async (user, article) => {
  const userId = await findUserIdByEmail(user.email);
  const tagList = getTagList(article.tags?.trim());
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
  return articleJson;
};

const getTagList = (tagStr) => {
  if (tagStr?.length === 0) {
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

export const getFeedArticles = async (session) => {
  const userId = await findUserIdByEmail(session.user.email);
  const followedAuthors = await findFollowedAuthors(userId);
  if (followedAuthors?.length === 0) {
    return;
  }
  const authorIdList = followedAuthors.map((user) => user.sys.id);
  const articles = await (
    await getArticlesByAuthorId(authorIdList)
  ).map((article) => getMinifiedArticle(article, session));
  return articles;
};

export const getMinifiedArticle = (article, session) => {
  const { slug, title, description, body, user, favorites } = article.fields;
  const { createdAt, updatedAt } = article.sys;
  const tagList = article.metadata?.tags?.map((tag) => tag.sys.id);

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
    favorited: false,
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
