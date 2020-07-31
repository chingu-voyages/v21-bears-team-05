import React, { useState } from "react";
import Spinner from "./Spinner";
import "./PhotoUpload.css";

const PhotoUpload = ({ setUploadUrl, src, alt, className }) => {
  const [url, setUrl] = useState(src);
  const [uploading, setUploading] = useState(false);
  const uploadPhoto = async (file) => {
    // TODO replace with upload to server service
    const urlFromServer = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        resolve(url);
      }, 1000);
    });
    return urlFromServer;
  };
  const handleUpload = async (e) => {
    const photoFile = e.target.files[0];
    photoFile && setUrl(URL.createObjectURL(photoFile));
    setUploading(true);
    const serverReturnedUrl = await uploadPhoto(photoFile);
    setUploadUrl(serverReturnedUrl);
    setUploading(false);
  };
  return (
    <div className={`${className} photo-upload`}>
      <div className="photo-upload__area">
        {uploading ? (
          <Spinner className="photo-upload__spinner" />
        ) : (
          <input
            className="photo-upload__input"
            aria-label="Upload photo"
            name="photo"
            onChange={handleUpload}
            type="file"
          />
        )}
        <img
          className={`${className}__img photo-upload__img`}
          src={url}
          alt={alt || ""}
        />
      </div>
    </div>
  );
};

export default PhotoUpload;
