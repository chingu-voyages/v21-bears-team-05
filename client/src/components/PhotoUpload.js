import React, { useState, useRef, useEffect } from "react";
import Spinner from "./Spinner";
import { status, authModalToggle } from "../services/subscribers";
import axios from "axios";
import placeholderImage from "../images/placeholderImage.svg";
import { getUserData } from "../services/users.mjs";
import "./PhotoUpload.css";

const PhotoUpload = ({ setUploadUrl, src, alt, className, handleClick, openFileUploaderOnMount }) => {
  const [url, setUrl] = useState(src);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState();
  const ref = useRef();
  const uploadPhoto = async (file) => {
    const settings = {
      type: "POST",
      headers: {
        Authorization: `Client-ID ${
          process.env.NODE_ENV === "production"
            ? process.env.REACT_APP_IMGUR_CLIENT_ID
            : process.env.REACT_APP_IMGUR_CLIENT_ID_DEV
        }`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    const formData = new FormData();
    formData.append("image", file);
    let res;
    try {
      res = await axios.post(
        `https://api.imgur.com/3/image`,
        formData,
        settings
      );
      if (res.data.success) {
        const urlFromServer = res.data.data?.link;
        return urlFromServer;
      }
    } catch (e) {
      console.error(e.message);
    }
  };
  const uploadingRef = useRef();
  const handleUpload = async () => {
    const userData = await getUserData();
    if (userData.uuid === "guest") {
      // request auth
      status.message("Please Login/signup to add to recipe galleries")
      authModalToggle.open()
      return false
    }
    uploadingRef.current = true;
    setError(false);
    const photoFile = ref.current.files[0];
    photoFile && setUrl(URL.createObjectURL(photoFile));
    status.inProgress("Uploading photo...");
    setUploading(true);
    let serverReturnedUrl;
    try {
      serverReturnedUrl = await uploadPhoto(photoFile);
      new URL(serverReturnedUrl);
    } catch (e) {
      console.error(e);
      status.error("Photo upload failed! Please check your connection", "Uploading photo...");
      setUploading(false);
      setError(true);
      return false;
    }
    setUploading(false);
    setUploadUrl(serverReturnedUrl);
    status.done("Photo uploaded", "Uploading photo...");
  };
  useEffect(() => {
    if (openFileUploaderOnMount && ref.current) {
      ref.current.click();
    }
  }, [openFileUploaderOnMount, ref ])
  return (
    <div className={`${className} photo-upload`}>
      <div className="photo-upload__area">
        {uploading ? (
          <Spinner className="photo-upload__spinner" />
        ) : handleClick ? (
          <div className="photo-upload__input" onClick={handleClick}></div>
        ) : (
          <input
            ref={ref}
            accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp"
            className="photo-upload__input"
            aria-label="Upload photo"
            name="photo"
            onChange={handleUpload}
            type="file"
          />
        )}
        {error && (
          <div className="photo-upload__fail">
            !
          </div>
        )}
        <img
          className={`${className}__img photo-upload__img`}
          src={url || placeholderImage}
          alt={alt || ""}
        />
      </div>
    </div>
  );
};

export default PhotoUpload;
