import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChangeMakerWebsiteContext } from '../../../context/changemakerWebsite-context';

function WebsiteBuilder_template(): JSX.Element {
  const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

  return (
    <div className="my-5">
      <hr />
      <div className="mb-2 mt-5 d-flex justify-content-between align-items-baseline">
        <h4 style={{ fontSize: 18, fontWeight: 600 }}>Preview</h4>
        <div className="d-flex" style={{ gap: 10 }}>
          <a
            href={`https://${changemakerWebsiteState.templateUrl}`}
            target="_blank"
            rel="noreferrer">
            <Button variant="outline-primary" size="sm">
              Preview
            </Button>
          </a>

          <Link to="/website/templates/liveEditor">
            <Button variant="outline-primary" size="sm">
              Live Editor
            </Button>
          </Link>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        {changemakerWebsiteState.thumbnail ? (
          <div
            style={{
              overflow: 'hidden',
              objectFit: 'cover',
              width: '100%',
              height: 600,
              position: 'absolute',
              top: 0
            }}>
            <img
              src={changemakerWebsiteState.thumbnail}
              alt="template"
              width={1400}
              height={900}
              style={{ objectFit: 'cover', width: '100%', height: 600 }}
            />
          </div>
        ) : null}
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ width: '100%', height: 600, border: '1px solid #ccc' }}>
          <p className="text-center" style={{ fontSize: '100px' }}>
            🌆
          </p>
        </div>
      </div>
    </div>
  );
}

export default WebsiteBuilder_template;
