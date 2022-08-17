import React from 'react';
import { v4 as uuidv4 } from "uuid";
import { Col} from "react-bootstrap";
import AWS from "aws-sdk";
import "react-rangeslider/lib/index.css";
const _Jimp = require("jimp/browser/lib/jimp");

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

var tus: any = require("tus-js-client");

function DisplayImage() {

    var albumPhotosKey = process.env.REACT_APP_S3_PREFIX_NAME;
    let imgUrl = `https://s3.ap-south-1.amazonaws.com/${S3_BUCKET}/${albumPhotosKey}/sm-003555c1-b07e-4edc-89dd-7e32d49fb237.jpeg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHwaCmFwLXNvdXRoLTEiRjBEAiAruVVqQMZXYzMPcO88JxF0Sp3501PcAaQq1STKfQMnwAIgNMmZOuCZxP25WH5KfJ46f7i6eoJSH4rjCNPf%2B5mciUwq7QII5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw0ODE2OTkxODk2NTIiDDBsdYHjFBeUxEiAPCrBAqjCrP8S83M5QTCt7AkEpVBsJ4F3bbIL8fQz1ffx8jofcKtqvojKhRXRKHu5HAcYY2XZ38VqDfl%2FHp2vzUHXkB%2FGxtDdXad0zX1FzIVmJjA8h9J`;
  return (
    <Col className="ml-3">
        <Col className="rounded-circle"><img src={imgUrl ? imgUrl : 'assets/image_placeholder.svg'} alt="profile picture" /> </Col>
        {/* <Col className="rounded-circle"> <img src="assets/image_placeholder.svg" alt="" /></Col> */}
        {/* <Col className="ml-2"><img src="assets/profile_icons/edit.svg" alt="edit" /></Col> */}
    </Col>
  )
}

export default DisplayImage;
