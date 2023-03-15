import React ,{useState} from 'react';
import AWS from 'aws-sdk'

const S3_BUCKET: any = process.env.REACT_APP_S3_BUCKET_NAME;
const REGION: any = process.env.REACT_APP_S3_BUCKET_REGION;


AWS.config.update({
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY,
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

function ImageUploader() {
  const [progress , setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (e) => {
      setSelectedFile(e.target.files[0]);
  }

  const uploadFile = (file) => {

      const params = {
          ACL: 'public-read',
          Body: file,
          Bucket: S3_BUCKET,
          Key: file.name
      };

      myBucket.putObject(params)
          .on('httpUploadProgress', (evt) => {
              setProgress(Math.round((evt.loaded / evt.total) * 100))
              console.log("no error")
          })
          .send((err) => {
              if (err) console.log("Error",err)
          })
  }

  return (
    <div>
        <div>Native SDK File Upload Progress is {progress}%</div>
        <input type="file" onChange={handleFileInput}/>
        <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
    </div>
  )
}

export default ImageUploader;
