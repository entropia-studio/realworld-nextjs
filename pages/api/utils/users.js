import {
  findUserIdByEmail,
  getEntryById,
  getRichText,
  publishEntry,
} from './contentful';

export const updateUser = async (email, userPayload) => {
  const userId = await findUserIdByEmail(email);
  const userEntry = await getEntryById(userId);
  const userContentfulPayload = getUserToContentful(userPayload);
  userEntry.fields = { ...userEntry.fields, ...userContentfulPayload.fields };
  await userEntry.update();
  await publishEntry(userId);
  return userPayload;
};

const getUserToContentful = (userPayload) => {
  const userContentfulPayload = {
    fields: {
      username: { 'en-US': userPayload.username },
      bio: { 'en-US': getRichText(userPayload.bio ?? '') },
      image: { 'en-US': userPayload.image },
    },
  };
  return userContentfulPayload;
};
