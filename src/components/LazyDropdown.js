import React, { useEffect, useState } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";

const LazyDropdown = () => {
  const [pageCount, setPageCount] = useState(1);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const resetList = () => {
    setSelectedValue(null);
    setDropdownSearch("");
    setPageCount(1);
    getDropdownList(1, true);
  }

  const getDropdownList = (pageCount, reset=false) => {
    console.log("getDropdownList", pageCount, reset);
    const paginationApiUrl = `https://rickandmortyapi.com/api/character/?page=${pageCount}`;
    fetch(paginationApiUrl)
      .then((response) => response.json())
      .then((data) => {
        let result = data["results"];
        if (result && result.length > 0) {
          if (reset) {
            setDropdownOptions(result);
          }
          else if (!dropdownOptions.includes(result[0])) {
            let options = dropdownOptions.concat(result);
            setDropdownOptions(options);
          }
        }
      });
  }

  const getDropdownSearchList = (search) => {
    const searchApiUrl = `https://rickandmortyapi.com/api/character/?name=${search}`;
    fetch(searchApiUrl)
      .then((response) => response.json())
      .then((data) => {
        let result = data["results"];
        if (result) {
          setDropdownOptions(result);
        }
      });
  }

  const handleScrollDownEvent = () => {
    const lazyContainer = document.querySelector("#lazyDropdownSearch-listbox");
    if (lazyContainer && dropdownOptions && dropdownOptions.length > 0) {
      lazyContainer.addEventListener("scrollend", (event) => {
        if (Math.abs(lazyContainer.scrollHeight - lazyContainer.scrollTop - lazyContainer.clientHeight) < 5) {
          setPageCount((count) => count + 1);
        }
      });
    }
  }

  useEffect(() => {
    if (dropdownSearch && dropdownSearch.length > 0) {
      getDropdownSearchList(dropdownSearch);
    } else {
      getDropdownList(pageCount);
    }
  }, [dropdownSearch, pageCount]);

  return (
    <Autocomplete
      id="lazyDropdownSearch"
      value={selectedValue}
      options={dropdownOptions}
      blurOnSelect={true}
      autoComplete={true}
      getOptionLabel={(option) => option.name || ""}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Rick and Morty"
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            src={option.image}
            alt=""
          />
          {option.name}
        </Box>
      )}
      onInputChange={(event, value, reason) => {
        if (reason === "input") {
          setDropdownSearch(value);
        }
      }}
      onChange={(event, option, reason) => {
        if (reason === "selectOption") {
          setSelectedValue(option);
        }
        if (reason === "clear") {
          resetList();
        }
      }}
      onOpen={() => {
        // 'onOpen' is fired when the popup requests to be opened. We need setTimeout for the component to load.
        setTimeout(() => {
          handleScrollDownEvent();
        }, 100);
      }}
    />
  );
}

export default LazyDropdown