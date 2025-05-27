// src/utils/cropImage.js

const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(new Error(`Görsel yüklenemedi: ${error.message}`)));
      image.setAttribute('crossOrigin', 'anonymous'); // Cross-origin sorunlarını önlemek için
      image.src = url;
    });

function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width, height, rotation) {
    const rotRad = getRadianAngle(rotation);

    return {
        width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

/**
 * This function was adapted from the Konva.js example
 * @see https://konvajs.org/docs/Image_Transformer.html
 */
export default async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
) {
    // Girdi kontrolleri
    if (!imageSrc || typeof imageSrc !== 'string') {
        throw new Error('Geçersiz görsel URL\'si: imageSrc bir string olmalı.');
    }
    if (!pixelCrop || !pixelCrop.width || !pixelCrop.height || !pixelCrop.x || !pixelCrop.y) {
        throw new Error('Geçersiz kırpma alanı: pixelCrop nesnesi eksik veya hatalı.');
    }

    try {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Canvas context oluşturulamadı.');
        }

        const rotRad = getRadianAngle(rotation);

        // Calculate bounding box of the rotated image
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
            image.width,
            image.height,
            rotation
        );

        // Set canvas size to match the bounding box
        canvas.width = bBoxWidth;
        canvas.height = bBoxHeight;

        // Translate canvas origin to the center of the image
        ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
        ctx.rotate(rotRad);
        ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
        ctx.translate(-image.width / 2, -image.height / 2);

        // Draw rotated image
        ctx.drawImage(image, 0, 0);

        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');

        if (!croppedCtx) {
            throw new Error('Kırpılmış canvas context oluşturulamadı.');
        }

        // Set the size of the cropped canvas
        croppedCanvas.width = pixelCrop.width;
        croppedCanvas.height = pixelCrop.height;

        // Draw the cropped image onto the new canvas
        croppedCtx.drawImage(
            canvas,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        // As a blob
        return new Promise((resolve, reject) => {
            croppedCanvas.toBlob(
                (file) => {
                    if (file) {
                        resolve(file);
                    } else {
                        reject(new Error('Kırpılmış görsel Blob olarak oluşturulamadı.'));
                    }
                },
                'image/jpeg',
                0.9 // JPEG formatında, %90 kalite ile
            );
        });
    } catch (error) {
        console.error('Görsel kırpma işlemi sırasında hata oluştu:', error);
        throw error; // Hata yukarıya iletilsin
    }
}