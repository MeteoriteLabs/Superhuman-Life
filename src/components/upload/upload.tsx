import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Image, Modal, ProgressBar } from 'react-bootstrap';
import AWS from 'aws-sdk';
import Cropper from 'react-easy-crop';
import Slider from 'react-rangeslider';
import { Point, Area } from 'react-easy-crop/types';
import 'react-rangeslider/lib/index.css';
import getCroppedImg from './cropImage';
import './upload.css';
import _Jimp from 'jimp';

const S3_BUCKET: string | undefined = process.env.REACT_APP_S3_BUCKET_NAME;
const REGION: string | undefined = process.env.REACT_APP_S3_BUCKET_REGION;

const reader = new FileReader();

AWS.config.update({
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY
});

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION
});

const tus: any = require('tus-js-client');

export interface UploadImageToS3WithNativeSdkProps {
    removePicture?: any;
    offering?: any;
    allowImage: boolean;
    allowVideo: boolean;
    aspectRatio?: string;
    value: any;
    onChange: any;
    title?: string;
    readonly?: boolean;
    uploadInterface?: string;
    form?: boolean;
}

const UploadImageToS3WithNativeSdk = (props: UploadImageToS3WithNativeSdkProps): JSX.Element => {
    const [progress, setProgress] = useState<number>(0);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [render, setRender] = useState<any>(null);
    const [url, setUrl] = useState<any>(null);
    const [imageid, setImageid] = useState<string | null>('');
    const [videoUpload, setVideoUpload] = useState<any>(false);
    const [videoID, setVideoID] = useState<any>(null);
    const [videoSizeError, setVideoSizeError] = useState<boolean>(false);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<any>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const allowedImageFormats = ['image/png', 'image/jpeg', 'image/jpg'];
    const allowedVideoFormats = ['video/mp4'];
    const albumPhotosKey = process.env.REACT_APP_S3_PREFIX_NAME;
    const [show, setShow] = useState<boolean>(true);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            const cropImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            //setCroppedImage(cropImage);
            uploadFile(cropImage);

            setImageSrc('');
        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, imageSrc]);

    function handleCrop(file) {
        //const file = e.target.files[0];

        if (allowedVideoFormats.indexOf(file.type) > -1) {
            uploadFile(file);
            return;
        } else {
            setImageSrc(URL.createObjectURL(file));
        }
    }

    function deleteAllImages() {
        if (props.removePicture) {
            props.removePicture();
            deleteFile(albumPhotosKey + 'sm-' + imageid);
            deleteFile(albumPhotosKey + 'md-' + imageid);
            deleteFile(albumPhotosKey + 'lg-' + imageid);
            setImageid(null);
            setUrl(null);
            setProgress(0);
            setRender(null);
        } else {
            deleteFile(albumPhotosKey + 'sm-' + imageid);
            deleteFile(albumPhotosKey + 'md-' + imageid);
            deleteFile(albumPhotosKey + 'lg-' + imageid);
            setUrl(undefined);
            setProgress(0);
            setRender(null);
        }
    }

    const deleteFile = (keyName) => {
        const deleteparams = {
            Bucket: S3_BUCKET,
            Key: keyName
        } as AWS.S3.HeadObjectRequest;
        try {
            myBucket.headObject(deleteparams).promise();
            console.log('File Found in S3');
            try {
                myBucket.deleteObject(deleteparams).promise();
                console.log('file deleted Successfully');
            } catch (err) {
                console.log('ERROR in file Deleting : ' + JSON.stringify(err));
            }
        } catch (err: any) {
            console.log('File not Found ERROR : ' + err.code);
        }
    };

    const getVideoDuration = (file) =>
        new Promise((resolve, reject) => {
            const reader: any = new FileReader();
            reader.onload = () => {
                const media = new Audio(reader.result);
                media.onloadedmetadata = () => resolve(media.duration);
            };
            reader.readAsDataURL(file);
            reader.onerror = (error) => reject(error);
        });

    const handleFileInput = async (e) => {
        // if the video is being uploaded in offering then this function is called
        if (props?.offering) {
            const file: any = e.target.files[0];
            const duration: any = await getVideoDuration(file);

            if (parseInt(duration) > 60) {
                setVideoSizeError(true);
                setRender(0);
                e.target.value = '';
                return;
            } else {
                setVideoSizeError(false);
            }
        }

        if (props.allowImage && props.allowVideo) {
            if (
                [...allowedImageFormats, ...allowedVideoFormats].indexOf(e.target.files[0].type) ===
                -1
            ) {
                setRender(0);
                e.target.value = '';
                return;
            }
        } else if (props.allowImage && !props.allowVideo) {
            if (allowedImageFormats.indexOf(e.target.files[0].type) === -1) {
                setRender(0);
                e.target.value = '';
                return;
            }
        } else if (!props.allowImage && props.allowVideo) {
            if (allowedVideoFormats.indexOf(e.target.files[0].type) === -1) {
                setRender(0);
                e.target.value = '';
                return;
            }
        }

        setRender(1);
        setSelectedFile(e.target.files[0]);
        handleCrop(e.target.files[0]);
    };

    function onImageLoadedSmall(fileName, filetype) {
        _Jimp.read(reader.result as string).then((img) => {
            img.resize(500, _Jimp.AUTO)
                .quality(100)
                .getBase64(_Jimp.MIME_JPEG, (err, pic) => {
                    const photoKey = albumPhotosKey + fileName;
                    setRender(1);
                    setImageid(photoKey.split('/')[1].slice(3));
                    uploadTOS3NoUrl(pic, photoKey, filetype);
                });
        });
    }
    function onImageLoadedMedium(fileName, filetype) {
        _Jimp.read(reader.result as string).then((img) => {
            img.resize(750, _Jimp.AUTO)
                .quality(100)
                .getBase64(_Jimp.MIME_JPEG, (err, pic) => {
                    const photoKey = albumPhotosKey + fileName;
                    setRender(1);
                    uploadTOS3NoUrl(pic, photoKey, filetype);
                });
        });
    }
    function onImageLoadedLarge(fileName, filetype) {
        _Jimp.read(reader.result as string).then((img) => {
            img.resize(1000, _Jimp.AUTO)
                .quality(100)
                .getBase64(_Jimp.MIME_JPEG, (err, pic) => {
                    const photoKey = albumPhotosKey + fileName;
                    setRender(1);
                    uploadTOS3(pic, photoKey, filetype);
                });
        });
    }

    function uploadTOS3(file, filename, filetype) {
        const buf = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const params = {
            Body: buf,
            Bucket: S3_BUCKET,
            Key: filename,
            ContentEncoding: 'base64',
            ContentType: filetype
        } as AWS.S3.PutObjectRequest;
        const paramUrl = {
            Bucket: S3_BUCKET,
            Key: filename
        };

        myBucket
            .putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100));
            })
            .send(() => {
                //get the url of uploaded image
                const promise = myBucket.getSignedUrlPromise('getObject', paramUrl);
                promise.then(
                    function (url) {
                        setUrl(url);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            });
    }

    if (props.value && !imageid) {
        if (props.value.split('.')[1] === 'jpeg') {
            setImageid(props.value);
            const paramUrl = {
                Bucket: S3_BUCKET,
                Key: albumPhotosKey + 'lg-' + props.value
            };
            const promise = myBucket.getSignedUrlPromise('getObject', paramUrl);
            promise.then(
                function (url) {
                    setUrl(url);
                },
                function (err) {
                    console.log(err);
                }
            );
        }
    }

    if (props.value && !videoID) {
        if (!props.value.split('.')[1]) {
            setVideoID(props.value);
            setVideoUpload(true);
        }
    }

    function uploadTOS3NoUrl(file, filename, filetype) {
        const buf = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const params = {
            Body: buf,
            Bucket: S3_BUCKET,
            Key: filename,
            ContentEncoding: 'base64',
            ContentType: filetype
        } as AWS.S3.PutObjectRequest;
        myBucket
            .putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100));
            })
            .send((err) => {
                if (err) console.log(err);
            });
    }

    const uploadFile = (file: any) => {
        if (allowedVideoFormats.indexOf(file.type) > -1) {
            VideoUpload(file);
            return;
        }

        if (allowedImageFormats.indexOf(file.type) > -1) {
            const fileType = '.' + file.type.split('/')[1];

            const fileName = uuidv4() + fileType;
            reader.onload = function () {
                onImageLoadedSmall('sm-' + fileName, file.type);
                onImageLoadedMedium('md-' + fileName, file.type);
                onImageLoadedLarge('lg-' + fileName, file.type);
            };
            reader.readAsArrayBuffer(file);
            return;
        }
        setRender(0);
    };

    function handleVideoOrImageInputDragDrop(e): void {
        setShow(true);
        if (props.allowImage && props.allowVideo) {
            if ([...allowedImageFormats, ...allowedVideoFormats].indexOf(e.type) === -1) {
                setRender(0);
                return;
            }
            if (allowedImageFormats.indexOf(e.type) > -1) {
                setRender(1);
                handleCrop(e);
                //uploadFile(e);
                return;
            }
            if (allowedVideoFormats.indexOf(e.type) > -1) {
                setRender(1);
                VideoUpload(e);
                return;
            }
        } else if (props.allowImage && !props.allowVideo) {
            if (allowedImageFormats.indexOf(e.type) === -1) {
                setRender(0);
                return;
            }
            if (allowedImageFormats.indexOf(e.type) > -1) {
                setRender(1);
                handleCrop(e);
                //uploadFile(e);
                return;
            }
        } else if (!props.allowImage && props.allowVideo) {
            if (allowedVideoFormats.indexOf(e.type) === -1) {
                setRender(0);
                return;
            }
            if (allowedVideoFormats.indexOf(e.type) > -1) {
                setRender(1);
                VideoUpload(e);
                return;
            }
        }
    }

    function VideoUpload(file: any) {
        if (allowedVideoFormats.indexOf(file.type) > -1) {
            const options = {
                endpoint: process.env.REACT_APP_CLOUDFLARE_URL,
                chunkSize: 5242880,
                metadata: {
                    name: file.name
                },
                onError: function (error) {
                    throw error;
                },
                onProgress: function (bytesUploaded, bytesTotal) {
                    setProgress(Number(((bytesUploaded / bytesTotal) * 100).toFixed(2)));
                },
                onSuccess: function () {
                    console.log('Upload finished');
                    setVideoUpload(true);
                    setRender(1);
                },
                onAfterResponse: function (req, res) {
                    if (res.getHeader('stream-media-id')) {
                        const value = res.getHeader('stream-media-id');
                        setVideoID(value);
                    }
                }
            };
            const upload = new tus.Upload(file, options);
            upload.start();
        } else {
            setRender(0);
        }
    }

    function handleAspectRatio(data: string) {
        if (data) {
            const dimensions = data.split(':');
            if (dimensions.length === 2) {
                const width = parseInt(dimensions[0]);
                const height = parseInt(dimensions[1]);
                if (!isNaN(width) && !isNaN(height) && height !== 0) {
                    return width / height;
                }
            }
        }

        return 5 / 3;
    }

    function videoDelete() {
        setVideoID(null);
        setProgress(0);
        setRender(null);
        setVideoUpload(false);
    }

    useEffect(() => {
        if (videoID !== '') {
            props.onChange(videoID);
        }
        // eslint-disable-next-line
    }, [videoID]);

    useEffect(() => {
        if (imageid !== '') {
            props.onChange(imageid);
        }
        // eslint-disable-next-line
    }, [imageid]);

    const UploadImageUiBody = (type?: string): JSX.Element => {
        return (
            <>
                <div
                    className="crop-container"
                    style={{
                        backgroundColor: `${
                            props.form ? 'rgba(255,255,255,0)' : 'rgb(255,255,255)'
                        }`
                    }}
                >
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={handleAspectRatio(props.aspectRatio ? props.aspectRatio : '')}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        objectFit="contain"
                    />
                </div>
                <div className="mt-2 ">
                    <Slider
                        className={`controls ${type === 'modal' ? 'modal-controls' : ''}`}
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(zoom: any) => setZoom(zoom)}
                    />
                    <button
                        type="button"
                        className={`uploadButton btn-sm btn-success ml-5 ${
                            type === 'modal' ? 'modal-btn' : ''
                        }`}
                        onClick={() => {
                            showCroppedImage();
                        }}
                        disabled={props.readonly}
                    >
                        Upload
                    </button>
                </div>
            </>
        );
    };

    const UploadImageUi = (props: UploadImageToS3WithNativeSdkProps): JSX.Element => {
        return props.uploadInterface === 'modal' ? (
            <Modal show={imageSrc} onHide={() => setImageSrc('')} className="modalCont">
                {UploadImageUiBody('modal')}
            </Modal>
        ) : (
            <div>{UploadImageUiBody()}</div>
        );
    };

    return (
        <div>
            {props?.title && (
                <div>
                    <span>{props.title}</span>
                </div>
            )}
            <div className="dropArea p-1">
                {url ? (
                    <div className="border bg-white border-dark p-4 ">
                        <Image
                            src={url}
                            width="500vw"
                            height="500vh"
                            className="img-thumbnail"
                            alt="Image Preview"
                        />
                        <p className="ml-2 mt-3 font-weight-bold text-success">Image Uploaded</p>
                        <div className="mt-3 d-flex flex-row-reverse">
                            <button
                                type="button"
                                className="btn-sm btn-danger"
                                onClick={() => deleteAllImages()}
                                disabled={props.readonly}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    ' '
                )}
                {videoUpload ? (
                    <>
                        <div className="border bg-white border-dark p-4 ">
                            <Image
                                src={`https://videodelivery.net/${videoID}/thumbnails/thumbnail.jpg?time=0s`}
                                width="500px"
                                height="500px"
                                className="img-thumbnail"
                                alt="Image Preview For Video"
                            />
                            <p className="text-success font-weight-bold mt-2">
                                {' '}
                                Video Uploaded Successfully!!
                            </p>
                            <div className="mt-3 d-flex flex-row-reverse">
                                <button
                                    type="button"
                                    className="btn-sm btn-danger"
                                    onClick={() => videoDelete()}
                                    disabled={props.readonly}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    ' '
                )}

                {imageSrc ? UploadImageUi(props) : ' '}
                <div>
                    {props.allowImage && !props.allowVideo ? (
                        <>
                            {render === 0 ? (
                                <p className="text-danger">Supported Formats (png/jpeg/jpg)</p>
                            ) : (
                                ' '
                            )}
                        </>
                    ) : (
                        ' '
                    )}
                    {!props.allowImage && props.allowVideo ? (
                        <>
                            {render === 0 ? (
                                <p className="text-danger">Supported Formats (mp4)</p>
                            ) : (
                                ' '
                            )}
                        </>
                    ) : (
                        ' '
                    )}
                    {props.allowImage && props.allowVideo ? (
                        <>
                            {render === 0 ? (
                                <p className="text-danger">Supported Formats (png/jpeg/jpg/mp4)</p>
                            ) : (
                                ' '
                            )}
                        </>
                    ) : (
                        ' '
                    )}
                    {!props.allowImage && !props.allowVideo ? (
                        <p className="text-danger">
                            upload component cannot have both values as false{' '}
                        </p>
                    ) : (
                        ' '
                    )}
                    {url || videoUpload ? (
                        ' '
                    ) : (
                        <div className={`${props.form ? '' : 'bg-white'}`}>
                            <div
                                className={`mb-3 ${props.form ? '' : 'dropzone'}`}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleVideoOrImageInputDragDrop(e.dataTransfer.files[0]);
                                }}
                            >
                                {props.allowImage && !props.allowVideo ? (
                                    <>
                                        <p className="d-inline">Drag & Drop Image (png/jpeg/jpg)</p>
                                    </>
                                ) : (
                                    ' '
                                )}
                                {!props.allowImage && props.allowVideo ? (
                                    <>
                                        <p className="d-inline">Drag & Drop Video</p>
                                        <p className="font-weight-bold d-inline"> (mp4)</p>
                                    </>
                                ) : (
                                    ' '
                                )}
                                {props.allowImage && props.allowVideo ? (
                                    <>
                                        <p className="d-inline">Drag & Drop Image Or Video</p>
                                        <p className="font-weight-bold d-inline">
                                            {' '}
                                            (png/jpeg/jpg/mp4)
                                        </p>
                                    </>
                                ) : (
                                    ' '
                                )}

                                <p className="mt-3">OR</p>
                                <div className={`${props.form ? 'upload-btn-wrapper' : ''}`}>
                                    <button className="btn">Upload a file</button>
                                    <input
                                        id="video-upload"
                                        type="file"
                                        className="pt-2"
                                        disabled={props.readonly}
                                        onChange={handleFileInput}
                                    />
                                </div>

                                {videoSizeError && (
                                    <p className="mt-3 text-danger">
                                        The video duration must be lesser than 60 seconds.
                                    </p>
                                )}

                                <div className="mt-3 d-flex flex-row-reverse">
                                    {selectedFile &&
                                    allowedVideoFormats.indexOf(selectedFile.type) > -1 ? (
                                        <button
                                            type="button"
                                            className={
                                                render ? 'btn-sm btn-success ml-5' : 'd-none'
                                            }
                                            onClick={() => handleCrop(selectedFile)}
                                        >
                                            Upload
                                        </button>
                                    ) : null}
                                </div>

                                {url || videoUpload ? (
                                    ' '
                                ) : (
                                    <div className={render ? 'pt-2' : 'd-none'}>
                                        <ProgressBar
                                            animated
                                            now={progress}
                                            label={`${progress}%`}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadImageToS3WithNativeSdk;
