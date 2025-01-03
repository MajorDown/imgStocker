export const authorizedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

export const authorizedMimetypes = () => {
  authorizedExtensions.map((ext) => {
    return `image/${ext}`;
  });
};
