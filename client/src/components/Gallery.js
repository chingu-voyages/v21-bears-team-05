import React, { useState, useEffect } from "react";
import Button from "./Button";
import PhotoUpload from "./PhotoUpload";
import { addToGallery, removeFromGallery } from "../services/recipes";
import { getUserData } from "../services/users";
import "./Gallery.css";

const Gallery = ({ galleryList, ingredients, setGalleryList, recipeId }) => {
  const [index, setIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fullViewOpen, setFullViewOpen] = useState(false);
  const [uploadedBy, setUploadedBy] = useState();
  const [showConfirm, setShowConfirm] = useState(false);

  const firstNineIngredients = ingredients.slice(0, 9);

  const handleAddPhoto = async (url) => {
    const updatedGallery = await addToGallery(url, recipeId);
    if (updatedGallery) {
      setGalleryList(updatedGallery);
      setIndex(updatedGallery.length - 1);
    }
    setUploading(false);
  };
  const handleDelete = async (url) => {
    const updatedGallery = await removeFromGallery(url, recipeId);
    if (updatedGallery) {
      setGalleryList([...updatedGallery]);
      index > updatedGallery.length - 1 && setIndex(updatedGallery.length - 1);
    }
    setShowConfirm(false);
  };
  useEffect(() => {
    const updateUploadedBy = async (uploadedBy) => {
      const uploadedByData = await getUserData({ ref: { uuid: uploadedBy } });
      if (uploadedByData) {
        const currentUser = await getUserData();
        const { name, avatar, uuid } = uploadedByData;
        setUploadedBy({
          name,
          avatar,
          isCurrentUser: uuid === currentUser.uuid,
        });
      } else {
        setUploadedBy(null);
      }
    };
    galleryList[index] && updateUploadedBy(galleryList[index].uploadedBy);
  }, [index, galleryList]);
  return (
    <div className="gallery">
      <nav className="gallery__nav">
        {galleryList?.map((item, i) => (
          <Button
            key={item.url}
            className={`gallery__slide-list-button glass-button ${
              index === i ? "gallery__slide-list-button--active" : ""
            }`}
            onClick={() => {
              setIndex(i);
              setUploading(false);
            }}
          ></Button>
        ))}
        <Button
          className="gallery__add-button glass-button"
          onClick={() => setUploading(!uploading)}
        ></Button>
      </nav>
      {showConfirm && (
        <dialog open className="gallery__fullview">
          <img
            className="gallery__fullview__image"
            src={galleryList[index]?.url}
            alt=""
          />
          <div>
            Delete this image?
            <Button
              onClick={() => {
                setShowConfirm(false);
                setFullViewOpen(true);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => handleDelete(galleryList[index].url)}>
              Delete
            </Button>
          </div>
        </dialog>
      )}
      {fullViewOpen ? (
        <dialog
          open
          onClick={() => setFullViewOpen(false)}
          className="gallery__fullview"
        >
          <img
            className="gallery__fullview__image"
            src={galleryList[index]?.url}
            alt=""
          />
          <div className="gallery__fullview__info">
            {uploadedBy?.isCurrentUser ? (
              <Button onClick={() => setShowConfirm(true)}>
                Delete this image
              </Button>
            ) : (
              `Photo uploaded by: ${uploadedBy?.name || "unknown"}`
            )}
          </div>
        </dialog>
      ) : uploading ? (
        <PhotoUpload
          openFileUploaderOnMount
          className="gallery__new-image"
          alt="Upload new image"
          setUploadUrl={handleAddPhoto}
        />
      ) : galleryList?.length > 0 ? (
        <img
          onClick={() => setFullViewOpen(true)}
          className="gallery__image"
          src={galleryList[index]?.url}
          alt=""
          title={`Uploaded by ${
            uploadedBy?.name ? uploadedBy?.name : "unknown"
          }`}
        />
      ) : (
        <div className="gallery__placeholder">
          {firstNineIngredients.map((item) => (
            <div key={item.uuid} className="gallery__placeholder__item">
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
