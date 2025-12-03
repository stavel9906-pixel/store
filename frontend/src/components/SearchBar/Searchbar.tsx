import { ChangeEventHandler, forwardRef } from "react";
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  searchResult: string;
  searchAction: ChangeEventHandler<HTMLInputElement>;
  placeHolder?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ searchResult, searchAction, placeHolder }, ref) => (
    <>
    <div className="flex-grow-1">
      <div
        className="form-outline flex-grow-1"
        data-mdb-input-init
      >
        <input
          ref={ref}
          id="search-focus"
          type="search"
          className="form-control"
          placeholder={placeHolder ?? "Enter text to search"}
          value={searchResult}
          onChange={searchAction}
        />
      </div>
      
    </div>
    <button
        type="button"
        className="btn btn-primary ms-2"
        data-mdb-ripple-init
      >
        <SearchIcon />
      </button></>
  )
);

SearchBar.displayName = "SearchBar";
