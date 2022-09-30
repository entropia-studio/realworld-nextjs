import { contentfulManagementEnvironment } from '../../../contentful/management';
import { contentfulClient } from '../../../contentful';

export const publishEntry = async (entryId) => {
  const entry = await getEntryById(entryId);
  await entry.publish();
};

export const getEntryById = async (entryId) => {
  return await (await contentfulManagementEnvironment()).getEntry(entryId);
};

export const deleteEntryById = async (entryId) => {
  return await (await contentfulManagementEnvironment()).deleteEntry(entryId);
};

export const unpublishEntryById = async (entryId) => {
  return await (await contentfulManagementEnvironment()).unpublish(entryId);
};

export const findUserIdByEmail = async (email) => {
  const query = {
    content_type: 'realUser',
    include: 10,
    ['fields.email']: email,
  };
  const userEntries = await contentfulClient.getEntries(query);
  return userEntries.items[0].sys.id;
};
export const findArticleIdBySlug = async (slug) => {
  const query = {
    content_type: 'realArticle',
    include: 10,
    ['fields.slug']: slug,
  };
  const articleEntries = await contentfulClient.getEntries(query);
  return articleEntries.items[0].sys.id;
};

export const getRichText = (text) => {
  const richTextDocument = {
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        content: [
          {
            nodeType: 'text',
            marks: [],
            value: text,
            data: {},
          },
        ],
        data: {},
      },
    ],
  };
  return richTextDocument;
};

export const getUserByEmail = async (email) => {
  const query = {
    content_type: 'realUser',
    include: 10,
    ['fields.email']: email,
  };

  return await (
    await contentfulClient.getEntries(query)
  ).items[0];
};
