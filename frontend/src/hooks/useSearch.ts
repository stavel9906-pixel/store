import { useState, ChangeEventHandler, useMemo } from "react";
import { Product } from "../utils/types";

export const useSearch = (searchedArray: Product[]) => {
  const [search, setSearch] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredArray: Product[] = useMemo(() => {
    return searchedArray.filter((product: Product) => {
      // פילטור לפי חיפוש
      const matchesSearch = Object.values(product).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      );

      // פילטור לפי קטגוריות
      const matchesType =
        selectedTypes.length === 0 || // אם לא נבחרו קטגוריות, הכל עובר
        selectedTypes.includes(product.productType.name);

      // שניהם חייבים להתקיים
      return matchesSearch && matchesType;
    });
  }, [searchedArray, search, selectedTypes]);

  const onSearch: ChangeEventHandler<HTMLInputElement> = (event) =>
    setSearch(event.target.value);

  return { search, onSearch, filteredArray, selectedTypes, setSelectedTypes };
};
