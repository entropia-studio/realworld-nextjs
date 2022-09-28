import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatDateAndTime } from '@contentful/f36-components';
import {
  getEntryById,
  getUserByEmail,
  getRichText,
  publishEntry,
} from './contentful';
import { getAuthor } from './articles';
import { contentfulManagementEnvironment } from '../../../contentful/management';

export const getCommentsByArticle = (article) => {
  const comments = article.fields.comments?.map((comment) => {
    const { user, description } = comment.fields;
    const { createdAt, updatedAt } = comment.sys;
    return {
      id: comment.sys.id,
      author: getAuthor(user),
      description: documentToHtmlString(description),
      createdAt: formatDateAndTime(createdAt, 'day'),
      updatedAt: formatDateAndTime(updatedAt, 'day'),
    };
  });
  return comments;
};

export const postCommentForArticle = async (
  userSession,
  articleEntry,
  comment
) => {
  const article = await getEntryById(articleEntry.sys.id);
  const commentEntry = await createComment(userSession, articleEntry, comment);

  const commentsLinked = articleEntry.fields.comments
    ? articleEntry.fields.comments.map((comment) => {
        return {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: comment.sys.id,
          },
        };
      })
    : [];

  const comments = {
    'en-US': [
      ...commentsLinked,
      {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: commentEntry.id,
        },
      },
    ],
  };

  article.fields = {
    ...article.fields,
    comments,
  };

  await article.update();
  await publishEntry(articleEntry.sys.id);

  return getMinifiedComment(commentEntry);
};

const getMinifiedComment = (comment) => {
  return {
    id: comment.id,
    author: comment.author,
    description: documentToHtmlString(comment.description['en-US']),
  };
};

const createComment = async (userSession, articleEntry, comment) => {
  const user = await getUserByEmail(userSession.email);

  const commentPayload = {
    fields: {
      internalName: {
        'en-US': `${articleEntry.fields.title} - Comment ${
          (articleEntry.fields.comments || []).length + 1
        }`,
      },
      description: { 'en-US': getRichText(comment) },
      user: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: user.sys.id,
          },
        },
      },
    },
  };

  const commentEntry = await (
    await contentfulManagementEnvironment()
  ).createEntry('realComment', commentPayload);

  await publishEntry(commentEntry.sys.id);

  const commentJson = {
    id: commentEntry.sys.id,
    ...commentEntry.fields,
    author: getAuthor(user, undefined),
  };
  return commentJson;
};
