const contentful = require('contentful-management');

export const contentfulManagementEnvironment = async () => {
  const contentfulManagementClient = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN,
  });
  const space = await contentfulManagementClient.getSpace(
    process.env.CONTENTFUL_SPACE_ID
  );

  return await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT);
};
