export const getSlugFromUrl = (urlStr) => {
  const regex = /[A-Za-z0-9]+(-[a-z\0-9]+)/gm;
  return regex.exec(urlStr)[0];
};
