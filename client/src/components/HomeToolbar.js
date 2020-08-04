import React from "react";
import Button from "./Button";
import "./HomeToolbar.css";

const HomeToolbar = ({ handleSetFilter, filter, listView, setListView, query, handleSetQuery }) => {
  return (
    <div className="home-toolbar">
      <div className="home-toolbar__filter">
        <svg
        className={`home-toolbar__icon ${
          filter ? "home-toolbar__icon--active" : ""
        }`}
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.6625 19.519L10.6624 19.5191L10.6719 19.5254C10.8771 19.6622 11.1082 19.7483 11.3599 19.7584C11.6056 19.7682 11.8385 19.7043 12.0517 19.5919C12.2726 19.4873 12.4632 19.3322 12.596 19.1177C12.7307 18.9001 12.7851 18.655 12.7851 18.4062V9.40242L19.1426 3.04496C19.3295 2.85803 19.4661 2.6307 19.5174 2.36395C19.5684 2.09874 19.5271 1.83662 19.4291 1.59165C19.3298 1.34354 19.1748 1.12358 18.9477 0.968722C18.7202 0.813626 18.4588 0.75 18.1914 0.75H1.87889C1.61152 0.75 1.35009 0.813626 1.12261 0.968722C0.895496 1.12358 0.74046 1.34354 0.641216 1.59165C0.543228 1.83662 0.501925 2.09874 0.552928 2.36395C0.604226 2.6307 0.74075 2.85803 0.927682 3.04496L7.28514 9.40242V16.4375C7.28514 16.882 7.48054 17.256 7.82436 17.5311L7.83686 17.5411L7.84997 17.5502L10.6625 19.519Z"
              fill="#7B7A7A"
            />
          </svg>
        <select value={filter} onChange={handleSetFilter}>
          <option value="">No filter</option>
          <option value="cupboard">Filter by cupboard ingredients</option>
        </select>
      </div>
      <div className="home-toolbar__search">
        <svg
         className={`home-toolbar__icon ${
          query ? "home-toolbar__icon--active" : ""
        }`}
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.6105 6.88006L14.6104 6.88018L14.6199 6.88949C15.7109 7.95169 16.25 9.22878 16.25 10.75C16.25 12.2716 15.7104 13.5669 14.6152 14.6621C13.5541 15.7232 12.2756 16.25 10.75 16.25C9.22637 16.25 7.93118 15.7243 6.83796 14.662C5.77565 13.5688 5.25 12.2736 5.25 10.75C5.25 9.22444 5.77679 7.94594 6.83793 6.8848C7.93313 5.7896 9.22842 5.25 10.75 5.25C12.2712 5.25 13.5483 5.78915 14.6105 6.88006ZM25.5 22.5625C25.5 22.1189 25.339 21.7257 25.0254 21.4121L20.3379 16.7246C20.0755 16.4621 19.7572 16.3065 19.4003 16.2628C20.466 14.6184 21 12.777 21 10.75C21 7.92943 19.9939 5.50551 17.9942 3.50582C15.9945 1.50613 13.5706 0.5 10.75 0.5C7.92943 0.5 5.50551 1.50613 3.50582 3.50582C1.50613 5.50551 0.5 7.92943 0.5 10.75C0.5 13.5706 1.50613 15.9945 3.50582 17.9942C5.50551 19.9939 7.92943 21 10.75 21C12.777 21 14.6184 20.466 16.2628 19.4003C16.3065 19.7572 16.4621 20.0755 16.7246 20.3379L21.4121 25.0254C21.7257 25.339 22.1189 25.5 22.5625 25.5C23.0061 25.5 23.3993 25.339 23.7129 25.0254L25.0254 23.7129C25.339 23.3993 25.5 23.0061 25.5 22.5625Z"
              fill="white"
            />
          </svg>
        <input type="text" placeholder="Search recipes" value={query} onChange={handleSetQuery} />
      </div>
      <div className="home-toolbar__view">
        <Button
          className="glass-button"
          onClick={() => setListView(!listView)}
        >
           <svg
           className={`home-toolbar__icon ${
            listView ? "home-toolbar__icon--active" : ""
          }`}
            width="26"
            height="23"
            viewBox="0 0 26 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.8333 13.1667V15.3333H0.5V13.1667H24.8333ZM24.8333 19.5V21.6667H0.5V19.5H24.8333ZM24.8333 6.83333V9H0.5V6.83333H24.8333ZM24.8333 2.66667H0.5V0.5H24.8333V2.66667Z"
              fill="white"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default HomeToolbar;
