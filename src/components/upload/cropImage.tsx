const createImage = (url: any) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });

function getRadianAngle(degreeValue: any) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export default async function getCroppedImg(imageSrc: any, pixelCrop: any, rotation = 0) {
    const image: any = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');

    // Set canvas size to match the desired crop dimensions
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Translate canvas context to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw the image onto the canvas using the pixelCrop coordinates
    ctx.drawImage(image, -pixelCrop.x, -pixelCrop.y);

    // Convert the cropped image on the canvas to a Blob object
    return new Promise((resolve) => {
        canvas.toBlob((file: any) => {
            resolve(new File([file], 'croppedimage', { type: 'image/jpeg' }));
        }, 'image/jpeg');
    });
}
