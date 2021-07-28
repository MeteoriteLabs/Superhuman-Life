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
    const [render,setRender] = useState(null);
    const [url,setUrl]= useState(null);
    const [key,setKey] = useState(null);
    // const [loading,setLoading] = useState(false);

    var albumPhotosKey = "sapien.partner.qa/";
    
   
    const deleteFile =() => {
        var deleteparams = {
            Bucket: S3_BUCKET, 
            Key: key
           };
           try {
             myBucket.headObject(deleteparams).promise()
            console.log("File Found in S3")
            try {
             myBucket.deleteObject(deleteparams).promise()
                console.log("file deleted Successfully")
            }
            catch (err) {
                 console.log("ERROR in file Deleting : " + JSON.stringify(err))
            }
        } catch (err) {
                console.log("File not Found ERROR : " + err.code)
        }
           setUrl(null);
           setProgress(0);
           setRender(null);
           //console.log(key);
    }

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);

        if(e.target.files[0].type === "image/png"|| e.target.files[0].type === "image/jpeg"||e.target.files[0].type === "image/jpg"||e.target.files[0].type === "image/svg"){
            setRender(1);
        }else{
            setRender(0);
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
        setKey(photoKey);

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


    return <div className="border border-dark w-50 p-4 bg-white ml-3">
        {url? " ":<div><p className="text-primary">Upload Progress is {progress}%</p></div>}
        {url?
        <div>
        <p className="font-weight-bold ml-2 text-success">Image Uploaded Successfully!!</p>
        <Image src={url} width="500px" height="500px" className="img-thumbnail" alt=""/>
        <div className="mt-3 d-flex flex-row-reverse">
        <button type="button" className="btn-sm btn-danger"  onClick={() => deleteFile()}>Remove</button>
        </div>
        
        </div>
        :
        <p className="font-weight-bold border border-primary w-10 p-4">Upload image to see preview</p>
        }

        <div>
        {render === 0?<p className="text-danger">Supported Formats (png/jpeg/jpg/svg)</p>:" "}
        {url?" ":
        <div>
            <div>
            <input type="file" className="pt-2"  onChange={handleFileInput}/>
            <button type="button" className={render?"btn-sm btn-success":"d-none"} onClick={() => uploadFile(selectedFile)}>Upload</button>
            </div>
        </div>
        }
        
        </div>
        

    </div>
}

export default UploadImageToS3WithNativeSdk;