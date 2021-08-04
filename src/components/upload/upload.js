import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Image, ProgressBar } from "react-bootstrap";
import AWS from 'aws-sdk';
import "./upload.css";


const S3_BUCKET = 'sapien.systems';
const REGION = 'ap-south-1';

require('jimp/browser/lib/jimp');
const Jimp = window.Jimp;

var reader = new FileReader();


AWS.config.update({
    accessKeyId: 'AKIAXAJ4CKOKFOTV67ZP',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
})

// region : ap-south-1
// bucket : sapien.systems
// prefix : sapien.partner.qa 

// IAM : S3user
// Access Id : AKIAXAJ4CKOKFOTV67ZP
// Secret Access Key : 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


const UploadImageToS3WithNativeSdk = (props) => {

    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [render, setRender] = useState(null);
    const [url, setUrl] = useState(null);
    const [key, setKey] = useState(null);
    const [imageid, setImageid] = useState(null);
    // const [loading,setLoading] = useState(false);

    props.onChange(imageid);

    var albumPhotosKey = "sapien.partner.qa/";


    const deleteFile = () => {
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

        if (e.target.files[0].type === "image/png" || e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === "image/svg") {
            setRender(1);
        } else {
            setRender(0);
            e.target.value = '';
        }
        console.log(e);
    }

    function onImageLoaded(fileName, filetype) {
        Jimp.read(reader.result)
            .then(img => {
                img.resize(500, Jimp.AUTO)
                    .quality(100)
                    .getBase64(Jimp.AUTO, (err, pic) => {
                        console.log(pic);
                        let photoKey = albumPhotosKey + fileName;
                        setRender(1);
                        setKey(photoKey);
                        setImageid(photoKey.slice(18));
                        uploadTOS3(pic, photoKey, filetype);
                    });
            });
    }

    function uploadTOS3(file, filename, filetype) {
        let buf = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        const params = {
            Body: buf,
            Bucket: S3_BUCKET,
            Key: filename,
            ContentEncoding: 'base64',
            ContentType: filetype
        };
        const paramUrl = {
            Bucket: S3_BUCKET,
            Key: filename
        }

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send(
                (res) => {
                    //get the url of uploaded image
                    var promise = myBucket.getSignedUrlPromise('getObject', paramUrl);
                    promise.then(function (url) {
                        console.log(url);
                        setUrl(url);
                    }, function (err) { console.log(err) });
                }
                , (err) => {
                    if (err) console.log(err)
                })


    }

    const uploadFile = (file) => {
        let fileType = " ";

        if (file.type === "image/png") {
            fileType = ".png";
        } else if (file.type === "image/jpeg") {
            fileType = ".jpeg";
        } else if (file.type === "image/jpg") {
            fileType = ".jpg";
        }else {
            setRender(0);
        }

        if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/svg") {

            var fileName = 'small-' + uuidv4() + fileType;
            reader.onload = function (e) {
                onImageLoaded(fileName, file.type);
            };
            reader.readAsArrayBuffer(file);
        }
        // large	1000px
        // medium	750px
        // small	500px
    }

    return <div className="dropArea p-1">
        {url ?
            <div className="border bg-white border-dark p-4 ">
                <Image src={url} width="500px" height="500px" className="img-thumbnail" alt="" />
                <p className="ml-2 mt-3 text-success">Image Uploaded Successfully!!</p>
                <div className="mt-3 d-flex flex-row-reverse">
                    <button type="button" className="btn-sm btn-danger" onClick={() => deleteFile()}>Remove</button>
                </div>

            </div>
            :
            " "
        }

        <div>
            {render === 0 ? <p className="text-danger">Supported Formats (png/jpeg/jpg)</p> : " "}
            {url ? " " :
                <div className="bg-white">
                    <div className="mb-3 p-4 dropzone" onDragOver={(e) => { e.preventDefault(); }} onDrop={(e) => { e.preventDefault(); uploadFile(e.dataTransfer.files[0]) }}>
                        <p className="d-inline">Drag & Drop Image</p><p className="font-weight-bold d-inline">  (png/jpeg/jpg)</p>
                        <p className="mt-3">OR</p>
                        <input type="file" className="pt-2" onChange={handleFileInput} />
                        <div className="mt-3 d-flex flex-row-reverse">
                            <button type="button" className={render ? "btn-sm btn-success ml-5" : "d-none"} onClick={() => uploadFile(selectedFile)}>Upload</button>
                        </div>
                    </div>
                </div>
            }
            {url ? " " : <div className={render ? " " : "d-none"}><ProgressBar animated now={progress} label={`${progress}%`} /></div>}
        </div>


    </div>
}

export default UploadImageToS3WithNativeSdk;