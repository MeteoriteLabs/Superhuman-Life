import { useEffect, useState } from 'react';
import AWS from "aws-sdk";

const S3_BUCKET: any = process.env.REACT_APP_S3_BUCKET_NAME;
const REGION: any = process.env.REACT_APP_S3_BUCKET_REGION;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,

});

var albumPhotosKey = process.env.REACT_APP_S3_PREFIX_NAME;

function DisplayImage(props: any) {
  const [photoUrl, setPhotoUrl] = useState<string>(props.defaultImageUrl);
  var imageName = 'sm-' + props.imageName;

  const paramUrl = {
    Bucket: S3_BUCKET,
    Key: albumPhotosKey + imageName,
  };

  useEffect(() => {
    setPhotoUrl(props.defaultImageUrl);
    if (props.imageName && props.imageName.length) {
      var promise = myBucket.getSignedUrlPromise("getObject", paramUrl);
      
      promise.then(
        function (url) {
          if (url) {
            setPhotoUrl(url);
          }
        },
        function (err) {
          console.log("image not found");
        }
      );
    }
    // eslint-disable-next-line
  },[props.imageName, props.defaultImageUrl])
  
  return (
    <img src={photoUrl} alt="profile" className={props.imageCSS} />
  )
}

export default DisplayImage;
