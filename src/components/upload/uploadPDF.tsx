import AWS from "aws-sdk";
import { useState } from "react";

const S3_BUCKET: string | undefined = process.env.REACT_APP_S3_BUCKET_NAME;
const REGION: string | undefined = process.env.REACT_APP_S3_BUCKET_REGION;

interface File{
    name: string;
}

function UploadPdf(props: {onChange: (args: string) => void; value: string;}) {
  // Create state to store file
  const [file, setFile] = useState<File>({} as File);
  const [uploadedfile, setUploadedFile] = useState<string|null>(null);

  // Function to upload file to s3
  const uploadFile = async (e) => {
    e.preventDefault();
    // S3 Credentials
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY,
    });
    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    // Files Parameters

    const params: any = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    // Uploading file to s3
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt: any) => {
        // File uploading progress
        console.log(
          "Uploading " + ((evt.loaded * 100) / evt.total) + "%"
        );
      })
      .promise();

    await upload.then((err: any) => {
      // File successfully uploaded
      setUploadedFile(err.$response.request.httpRequest.path);
      props.onChange((err.$response.request.httpRequest.path).toString());
    });
  };

  // Function to handle file and store it to file state
  const handleFileChange = (e) => {
    // Uploaded file
    const file = e.target.files[0];
    // Changing file state
    setFile(file);
  };

  return (
    <div className="border shadow p-3 mb-5 bg-white rounded">
      <div>
        <p>Upload PDF document</p>
        <input type="file" onChange={handleFileChange} />
        <button onClick={(e)=>uploadFile(e)}>Upload</button>
      </div>
      {uploadedfile ? <p className="text-success">Uploaded successfully</p> : null}
    </div>
  );
}

export default UploadPdf;
