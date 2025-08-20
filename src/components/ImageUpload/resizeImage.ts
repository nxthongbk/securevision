// Function to handle image resizing
export const resizeImage = (file: any, maxWidth: number, maxHeight: number) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      const canvas = document.createElement('canvas');
      let width = image.width;
      let height = image.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(image, 0, 0, width, height);

      canvas.toBlob((blob: any) => {
        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg');
    };
  });
};
