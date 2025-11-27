import { useState, ChangeEventHandler, useMemo } from "react";

export const useSearch = <T extends object>(searchedArray: Array<T>) => {
  const [search, setSearch] = useState<string>("");

  const filteredArray : Array<T> = useMemo(() => {
    return searchedArray.filter((object: T) =>
    Object.values(object).some((value) =>
      (value).toString().includes(search)
    )); 
  }, [searchedArray, search]);

  const onSearch: ChangeEventHandler<HTMLInputElement> = (event) =>
    setSearch(event.target.value);

  return { search, onSearch, filteredArray };
};
