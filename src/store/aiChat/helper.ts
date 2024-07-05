export const getPageNumber = (url: string | null) => {
  if (url) {
    const urlObject = new URL(url);
    const pageNumber = urlObject.searchParams.get("page");
    return Number(pageNumber);
  }
  return undefined;
};
