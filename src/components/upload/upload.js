import {useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Image} from "react-bootstrap";
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
    const [render,setRender] = useState(false);
    const [url,setUrl]= useState(null);
    const [key,setKey] = useState(null);
    // const [loading,setLoading] = useState(false);

    var albumPhotosKey = "sapien.partner.qa/";
    
   
    const deleteFile =() => {
        var deleteparams = {
            Bucket: S3_BUCKET, 
            Key: key
           };
           myBucket.deleteObject(deleteparams, function(err, data) {
             if (err) console.log(err); // an error occurred
             else     console.log(data);           // successful response
           });
           setUrl(null);
           setProgress(0);
           console.log(key);
    }

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);

        if(e.target.files[0].type === "image/png"|| e.target.files[0].type === "image/jpeg"||e.target.files[0].type === "image/jpg"||e.target.files[0].type === "image/svg"){
            setRender(false);
        }else{
            setRender(true);
        }
        //console.log(e);
    }

    const uploadFile = (file) => {
        //png,jpeg,jpg,svg
        let fileType =" ";

        if(file.type === "image/png"){
         fileType=".png";
        }else if(file.type === "image/jpeg"){
         fileType=".jpeg";
        }else if(file.type === "image/jpg"){
         fileType=".jpg";
        }else if(file.type === "image/svg"){
         fileType=".svg";
        }

        if(file.type === "image/png"|| file.type === "image/jpeg"||file.type === "image/jpg"||file.type === "image/svg"){
        var photoKey = albumPhotosKey + uuidv4()+fileType;
        console.log(photoKey.slice(18));
        // var deletekey = uuidv4()+fileType;
        // console.log(photoKey);
        // //console.log(deletekey);
        setKey(photoKey.slice(18));

        const params = {
            Body: file,
            Bucket: S3_BUCKET,
            Key: photoKey
        };
        const paramUrl = {
            Bucket: S3_BUCKET,
            Key: photoKey
        }
        //console.log(params);

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })

            var promise = myBucket.getSignedUrlPromise('getObject', paramUrl);
            promise.then(function(url) {
            //console.log('The URL is', url);
            setTimeout(() => setUrl(url),1000);
            }, function(err) { console.log(err) });
        }
        
    }


    return <div>
        {url? " ":<div><p className="text-primary">Upload Progress is {progress}%</p></div>}
        {url?
        <>
        <Image src={url} width="500px" height="500px" className="img-thumbnail" alt=""/>
        <button type="button" className="btn-sm btn-secondary ml-5"  onClick={() => deleteFile()}>Remove</button>
        </>
        :
        <p className="font-weight-bold border border-primary w-25 p-4">Upload image to see preview</p>
        }

        <div>
        {render?<p className="text-danger">Supported Formats (png/jpeg/jpg/svg)</p>: " "}
        {url?" ":
        <div>
            <div>
            <input type="file" className="pt-2"  onChange={handleFileInput}/>
            <button type="button" className={render?"d-none":"btn-sm btn-secondary"} onClick={() => uploadFile(selectedFile)}>Upload</button>
            </div>
        </div>
        }
        
        </div>
        

    </div>
}

export default UploadImageToS3WithNativeSdk;