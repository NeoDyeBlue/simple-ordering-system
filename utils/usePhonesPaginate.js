import useSWRInfinite from "swr/infinite";

export default function usePhonesPaginate(url, limit, options) {
  const getKey = (pageIndex, previousPageData) => {
    if (typeof window !== "undefined") {
      pageIndex += 1;
      if (previousPageData && !previousPageData.phones.length) return null;
      return `${url},createdAt_$lte~${sessionStorage.getItem(
        "sessionDate"
      )}&options=page_${pageIndex},limit_${limit}`;
    }
  };

  const {
    data: paginatedData,
    size,
    setSize,
    error,
    mutate,
  } = useSWRInfinite(getKey, options);

  const phonesData = paginatedData?.reduce((data, { brand, phones }) => {
    data[brand] ??= { brand: brand, phones: [] };
    if (Array.isArray(phones)) {
      data[brand].phones = data[brand].phones.concat(phones);
    } else {
      data[brand].phones.push(phones);
    }

    return data;
  }, {});

  const endReached =
    paginatedData &&
    paginatedData[paginatedData.length - 1].phones.length < limit;

  const isLoading =
    paginatedData && typeof paginatedData[size - 1] === "undefined";

  return {
    phonesData: phonesData && Object.values(phonesData)[0],
    endReached,
    isLoading,
    size,
    setSize,
    error,
    mutate,
  };
}
