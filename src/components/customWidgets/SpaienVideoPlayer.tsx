import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";

const SapienVideoPlayer: React.FC<{url: string;}> = (props) => {
  const [show, setShow] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  //here we are getting the video id from the url
  function convertLinkToEmbedId(val: string) {
    return new URL(val).searchParams.get("v");
  }

  useEffect(() => {
    if (props.url.includes("https://www.youtube.com/")) {
      //we are converting the youtube video url to embed from to display it using iframe
      let embedUrl: string;
      if (props.url.includes("https://www.youtube.com/shorts")) {
        embedUrl = `https://www.youtube.com/embed/${props.url
          .split("/")
          .pop()}`;
      } else {
        embedUrl = `https://www.youtube.com/embed/${convertLinkToEmbedId(
          props.url
        )}`;
      }
      setVideoUrl(embedUrl);
      setShow(true);
    } else {
      fetch(process.env.REACT_APP_CLOUDFLARE_URL || "", {
        method: "POST",
        body: JSON.stringify({
          videoId: props.url,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setVideoUrl(
              `https://customer-${process.env.REACT_APP_CLOUDFLARE_CUSTOMER_CODE}/${json.result.token}/iframe`
            );
            setShow(true);
          } else {
            setErrorMessage("Video Not Found");
            setShow(true);
          }
        });
    }
  }, []);

  if (!show) {
    return (
      <Loader/>
    );
  } else
    return (
      <div>
        {!errorMessage && (
          <iframe
            src={videoUrl}
            height="400"
            width="600"
            title="Iframe Example"
          ></iframe>
        )}
        {errorMessage && (
          <div className="text-center">
            <b>{errorMessage}</b>
          </div>
        )}
      </div>
    );
};

export default SapienVideoPlayer;
