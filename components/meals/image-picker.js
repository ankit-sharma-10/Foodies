'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

import classes from './image-picker.module.css';

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState(null);
  const imageInput = useRef();

  useEffect(() => {
    return () => {
      if (pickedImage) {
        URL.revokeObjectURL(pickedImage);
      }
    };
  }, [pickedImage]);

  function handlePickClick() {
    imageInput.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      if (pickedImage) {
        URL.revokeObjectURL(pickedImage);
      }
      setPickedImage(null);
      return;
    }

    if (pickedImage) {
      URL.revokeObjectURL(pickedImage);
    }

    setPickedImage(URL.createObjectURL(file));
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              fill
              sizes="10rem"
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg, image/webp"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
          required
        />
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
