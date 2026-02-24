import { PAGINATION } from "@/config/constant";
import { useEffect, useState } from "react";

type UseEntitySearchProps<
  T extends {
    search: string;
    page: number;
  },
> = {
  params: T;
  setSearch: (params: T) => void;
  debounce?: number;
};

export const useEntitySearch = <T extends { search: string; page: number }>({
  params,
  setSearch,
  debounce = 500,
}: UseEntitySearchProps<T>) => {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setSearch({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setSearch({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounce);
    return () => clearTimeout(timer);
  }, [localSearch, params, setSearch, debounce]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params]);

  return {
    search: localSearch,
    onSearchChange: setLocalSearch,
  };
};
