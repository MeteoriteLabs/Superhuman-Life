import React ,{useState} from 'react';
import AWS from 'aws-sdk'

const S3_BUCKET ='sapien.systems';
const REGION ='ap-south-1';


AWS.config.update({
    accessKeyId: 'AKIAXAJ4CKOKFOTV67ZP',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

// region : ap-south-1
// bucket : sapien.systems
// prefix : sapien.partner.qa 

// IAM : S3user
// Access Id : AKIAXAJ4CKOKFOTV67ZP
// Secret Access Key : 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


const UploadImageToS3WithNativeSdk = () => {

    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    var albumPhotosKey = "sapien.partner.qa/";
    

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFile = (file) => {
        var photoKey = albumPhotosKey + file.name;

        const params = {
            Body: file,
            Bucket: S3_BUCKET,
            Key: photoKey
        };
        console.log(params);

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })
    }


    return <div>
        <div>Upload Progress is {progress}%</div>
        <input type="file" onChange={handleFileInput}/>
        <button onClick={() => uploadFile(selectedFile)}>Upload</button>
    </div>
}

export default UploadImageToS3WithNativeSdk;