import React, {useState, useEffect} from 'react';
import {Spinner} from 'react-bootstrap';

const SapienVideoPlayer = (props: any) => {

     const [show, setShow] = useState(false);
     const [videoUrl, setVideoUrl] = useState(''); 
     const [errorMessage, setErrorMessage] = useState('');
     const [showError, setShowError] = useState(false);

     //here we are getting the video id from the url
     function convertLinkToEmbedId(val: string) {
          return new URL(val).searchParams.get('v');
     };

     useEffect(() => {
          if(props.url.includes('youtube')){
               //we are converting the youtube video url to embed from to display it using iframe
               const embedUrl = `https://www.youtube.com/embed/${convertLinkToEmbedId(props.url)}`;
               setVideoUrl(embedUrl);
               setShow(true);
          }else {
               fetch(process.env.REACT_APP_CLOUDFLARE_URL || '', {
                    method: "POST",
                    body: JSON.stringify({
                         videoId: props.url,
                    }),
               })
               .then((res) => res.json())
               .then((json) => {
                    if(json.success){
                         setVideoUrl(`https://customer-${process.env.REACT_APP_CLOUDFLARE_CUSTOMER_CODE}/${json.result.token}/iframe`);
                         setShow(true);
                    }else {
                         setErrorMessage('Video Not Found');
                         setShowError(true);
                         setShow(true);
                    }
               });
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

     if(!show){
          return (
               <div className='text-center'>
                    <Spinner animation="border" variant='danger'/>
                    <br />
                    <span><b>Please wait while we load the content</b></span>
               </div>
          )
     }else return(
          <div>
               {!showError && <iframe src={videoUrl} height="400" width="600" title="Iframe Example"></iframe>}
               {showError && <div className='text-center'><b>{errorMessage}</b></div>}
          </div>
     );
};

export default SapienVideoPlayer;