import { contentfulManagementEnvironment } from '../../../contentful/management';
export const createTag = async (tag) => {
  return await (
    await contentfulManagementEnvironment()
  ).createTag(tag, tag, 'public');
};
