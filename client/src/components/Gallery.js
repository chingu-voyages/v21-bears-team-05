import React, { useState } from "react";
import "./Gallery.css"

const Gallery = ({ galleryList, ingredients }) => {
  const [index, setIndex] = useState(0);
  return (
    <div className="gallery">
      {galleryList?.length > 0 ? (
        <img
          src={galleryList[index].url}
          alt=""
          title={`Uploaded by ${galleryList[index].uploadedBy}`}
        />
      ) : (
        <div className="gallery__placeholder">
          {ingredients.map((item) => (
            <div key={item.id} className="gallery__placeholder__item">
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery