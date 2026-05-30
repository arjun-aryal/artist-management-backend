export const buildPagination = ({ page = 1, limit = 10, paginate = false }) => {
  if (!paginate) {
    return { clause: "", params: [] };
  }

  const pageNumber = Math.max(1, parseInt(page));
  const pageSize = Math.max(1, parseInt(limit));

  const offset = (pageNumber - 1) * pageSize;

  return {
    clause: `LIMIT $1 OFFSET $2`,
    params: [pageSize, offset],
  };
};
