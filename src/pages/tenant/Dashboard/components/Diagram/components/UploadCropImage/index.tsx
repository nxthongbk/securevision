import { Box, Button, IconButton, Tooltip } from '@mui/material';

import Cropper from 'react-easy-crop';
import { Upload } from '@phosphor-icons/react';
import { convertPdfToImages } from '~/utils/PDFResolver';
import getCroppedImg from '~/utils/getCroppedImage';
import { useState } from 'react';

const getSrcFromFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
  });
};

function UploadCropImage({ setUploadedFileName }) {
  const [, setFileList] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const crop_img_confirm = async (src) => {
    setUploadedFileName(src);
    setTimeout(() => {}, 500);
  };

  const reduceImageSize = (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > 1000) {
            height *= 1000 / width;
            width = 1000;
          }
        } else {
          if (height > 1000) {
            width *= 1000 / height;
            height = 1000;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        const compressedBase64 = canvas.toDataURL('image/png', 0.7);
        resolve(compressedBase64);
      };
    });
  };

  const upLoadImgHandler = async (file) => {
    const src = file.url || (await getSrcFromFile(file));
    setImageSrc(src);
  };

  const upLoadPdfHandler = async (file) => {
    let src = '';
    await convertPdfToImages(file).then((url) => {
      src = url;
    });
    setImageSrc(src);
  };

  const onChange = async (event) => {
    const file = event.target.files[0];
    setFileList([file]);

    if (file.type !== 'application/pdf') {
      upLoadImgHandler(file);
    } else if (file.type === 'application/pdf') {
      upLoadPdfHandler(file);
    }
  };

  const onCropComplete = async (croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    if ((croppedImage as File).size > 1048576) {
      const resizedImageBase64 = await reduceImageSize(croppedImage as string);
      crop_img_confirm(resizedImageBase64);
    } else {
      crop_img_confirm(croppedImage as string);
    }
  };

  return (
    <Box className='z-50 hidden'>
      <Tooltip title='Upload and crop image' placement='top'>
        <IconButton component='label'>
          <Upload />
          <input type='file' accept='.pdf,.png,.jpg,.jpeg' onChange={onChange} hidden />
        </IconButton>
      </Tooltip>
      {imageSrc && (
        <Box>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Button variant='outlined' onClick={() => setImageSrc(null)}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleCropConfirm}>
              Confirm
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default UploadCropImage;
