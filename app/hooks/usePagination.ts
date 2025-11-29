import { useMemo, useState } from "react";

export default function usePagination(data: any) {
  // Local State
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const total = data.length;
  const totalPages = Math.ceil(total / limit);

  const paginatedRows = useMemo(
    () => data.slice((page - 1) * limit, page * limit),
    [data, page, limit]
  );

  const indexPaginate = (page - 1) * limit;

  return {
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    paginatedRows,
    indexPaginate,
  };
}
