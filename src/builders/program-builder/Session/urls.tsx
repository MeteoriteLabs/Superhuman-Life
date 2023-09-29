import { useEffect, useState } from 'react';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Icon from 'components/Icons';

const MIN = 1;

const Urls = (props: any) => {
    const [url, setUrl] = useState<string>();
    const [isUrlExist, setIsUrlExist] = useState(false);
    const [urlArray, setUrlArray] = useState<string[]>(props.value ? props.value: []);

    const handleAdd = () => {
        if (url && url.length && urlArray.includes(url)) setIsUrlExist(true);
        if (url && url.length && !urlArray.includes(url)) setUrlArray([...urlArray, url]);
        setUrl('');
    };

    function handleDelete(url: string) {
        const newArr = urlArray && urlArray.length ? urlArray.filter((curr) => curr !== url) : [];
        setUrlArray(newArr);
    }

    useEffect(() => {
        props.onChange(JSON.stringify(urlArray));
    }, [url]);

    return (
        <div>
            <h5>Enter URL</h5>
            <input
                value={url}
                placeholder="Enter url"
                onChange={(e) => setUrl(e.target.value)}
                type="url"
                minLength={MIN}
                className="p-1 w-50"
            />
            <Button disabled={props.readonly?props.readonly:false} onClick={handleAdd} variant="dark" className="ml-3">
                Add
            </Button>
            {isUrlExist ? <p className="text-danger">url already exist</p> : null}
            {urlArray && urlArray.length
                ? urlArray.map((curr, index) => (
                      <div key={index} className="d-flex my-2">
                          {' '}
                          <div className="shadow  py-1 bg-white rounded w-50 mr-2">
                              <Icon name="link" height={25} width={25} style={{ margin: '10px' }} />
                              {curr}
                          </div>
                          <OverlayTrigger
                              key="open in new tab"
                              placement="right"
                              overlay={
                                  <Tooltip id={`open in new tab`}>
                                      <strong>Open in new tab</strong>.
                                  </Tooltip>
                              }
                          >
                              <img
                                  src="assets/open_in_new_window.svg"
                                  alt="open in new window"
                                  onClick={() => {
                                      window.open(`http://${curr}`, '_blank');
                                  }}
                              />
                          </OverlayTrigger>
                          <div onClick={() => {props.readonly ? null :handleDelete(curr)}} >
                          <Icon
                              name="delete"
                              height={25}
                              width={25}
                              style={{ margin: '12px', cursor: "pointer" }}
                          />{' '}
                          </div>
                      </div>
                  ))
                : null}
        </div>
    );
};

export default Urls;
