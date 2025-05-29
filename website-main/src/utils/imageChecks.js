import * as faceapi from 'face-api.js';

let modelsLoaded = false;
async function loadModels() {
  if (!modelsLoaded) {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    modelsLoaded = true;
  }
}

// Resize image to a target size (square)
export function resizeImage(image, targetSize = 361) {
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, targetSize, targetSize);
  return canvas.toDataURL('image/jpeg');
}

// Crop image to a square (center crop)
export function cropToSquare(image) {
  const size = Math.min(image.width, image.height);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    (image.width - size) / 2,
    (image.height - size) / 2,
    size,
    size,
    0,
    0,
    size,
    size
  );
  return canvas.toDataURL('image/jpeg');
}

// Check if image is too bright or too dark
export function isImageTooBrightOrDark(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let total = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    total += (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
  }
  const avg = total / (imageData.data.length / 4);
  if (avg < 50) return 'too dark';
  if (avg > 200) return 'too bright';
  return 'ok';
}

// Real face detection using face-api.js
envokes loadModels and returns number of faces
export async function checkFaces(imageElement) {
  await loadModels();
  const detections = await faceapi.detectAllFaces(
    imageElement,
    new faceapi.TinyFaceDetectorOptions()
  );
  return detections.length;
} 