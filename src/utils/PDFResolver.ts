const loadPDFJS = async () => {
  const PDFJS = await import('pdfjs-dist');
  return PDFJS;
};

export const readFileData = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};

//param: file -> the input file (e.g. event.target.files[0])
//return: images -> an array of images encoded in base64
export const convertPdfToImages = async (file: File): Promise<any> => {
  const PDFJS = await loadPDFJS();
  const data = await readFileData(file);
  const pdf = await PDFJS.getDocument(data).promise;
  const canvas = document.createElement("canvas");

  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.5 });
  const context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await page.render({ canvasContext: context, viewport: viewport }).promise;
  const images = canvas.toDataURL('image/jpeg', 1);

  canvas.remove();
  return images;
}