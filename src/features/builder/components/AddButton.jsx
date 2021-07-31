import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Dropdown } from "semantic-ui-react";
/**
 * Expects items to be an array of objects with keys id, title
 * @component
 * @param {array} items expects object with keys id, title
 * @param {function} handleAdd function to add item to your array
 * @param {string} content string used as button text
 */
const AddButton = ({ items, handleAdd, content }) => {
  const { allowAddWorkItem } = useSelector((state) => state.builder);
  const [options, setOptions] = useState([]);

  const ddRef = useRef(null);
  const handleChange = (e, { value }) => {
    handleAdd(value);
  };

  useEffect(() => {
    let selectedItems = document.getElementsByClassName("selected item");
    for (let item of selectedItems) {
      item.classList.remove("active");
      item.classList.remove("selected");
      item.setAttribute("aria-checked", false);
      item.setAttribute("aria-selected", false);
    }
  });

  useEffect(() => {
    if (items.results.length > 0) {
      let config = [];
      items.results.forEach((item) => {
        config.push({
          key: item.id,
          value: item.id,
          text: item.title,
        });
      });
      setOptions(config);
    }
  }, [items, setOptions]);

  return (
    <Dropdown
      disabled={!allowAddWorkItem}
      ref={ddRef}
      text={content}
      floating
      labeled
      button
      scrolling
      basic
      icon="add"
      className="icon"
      onChange={handleChange}
      options={options}
    />
  );
};

export default AddButton;
