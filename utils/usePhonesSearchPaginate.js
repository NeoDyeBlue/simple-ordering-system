import useSWRInfinite from "swr/infinite";

export default function usePhonesSearchPaginate(url, limit, options) {
  const getKey = (pageIndex, previousPageData) => {
    pageIndex += 1;
    if (previousPageData && !previousPageData.length) return null;
    return `${url}&options=page_${pageIndex},limit_${limit}`;
  };

  const {
    data: paginatedData,
    size,
    setSize,
    error,
    mutate,
  } = useSWRInfinite(getKey, options);

  const phonesData = paginatedData?.flat();

  const endReached =
    paginatedData && paginatedData[paginatedData.length - 1].length < limit;

  const isLoading =
    paginatedData && typeof paginatedData[size - 1] === "undefined";

  return {
    phonesData,
    endReached,
    isLoading,
    size,
    setSize,
    error,
    mutate,
  };
}
