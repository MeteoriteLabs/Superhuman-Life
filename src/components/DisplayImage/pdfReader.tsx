import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import AWS from 'aws-sdk';

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;
const REGION = process.env.REACT_APP_S3_BUCKET_REGION;

AWS.config.update({
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY
});

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION
});

const DisplayPdf: React.FC<{
    imageName: string;
    defaultImageUrl: string;
    imageCSS: string;
}> = (props) => {
    const [photoUrl, setPhotoUrl] = useState<string>(props.defaultImageUrl);
    const imageName = props.imageName;

    const paramUrl = {
        Bucket: S3_BUCKET,
        Key: imageName
    };

    useEffect(() => {
        setPhotoUrl(props.defaultImageUrl);
        if (props.imageName && props.imageName.length) {
            const promise = myBucket.getSignedUrlPromise('getObject', paramUrl);

            promise.then(
                function (url) {
                    if (url) {
                        setPhotoUrl(url);
                    }
                },
                function (err) {
                    console.log(err, 'image not found');
                }
            );
        }
    }, [props.imageName, props.defaultImageUrl]);

    return (
        <>
            {/* {photoUrl && <object width="100%" height="400" data={photoUrl} type="application/pdf" >   </object>} */}
            <Button
                variant="dark"
                className='m-2'
                onClick={() => {
                    window.open(photoUrl, '_blank');
                }}
            >
                Download {props.imageName}
            </Button>
        </>
    );
};

export default DisplayPdf;
