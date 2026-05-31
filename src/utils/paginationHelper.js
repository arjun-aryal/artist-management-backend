export const buildPagination = ({
  page = 1,
  limit = 10,
  startIndex,
  paginate = false,
}) => {
  if (!paginate) {
    return { clause: "", params: [] };
  }
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const pageNumber = Math.max(1, parseInt(page));
  const pageSize = Math.max(1, parseInt(limit));

  const offset = (pageNumber - 1) * pageSize;

  return {
    clause: `LIMIT $${startIndex} OFFSET $${startIndex + 1}`,
    params: [pageSize, offset],
  };
};
