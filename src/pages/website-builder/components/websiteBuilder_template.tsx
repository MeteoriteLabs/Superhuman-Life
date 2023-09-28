import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { Link } from 'react-router-dom';

function WebsiteBuilder_template(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    return (
        <div>
            <div
                style={{
                    position: 'relative',
                    margin: 'auto',
                    borderRadius: '20px 20px 0 0',
                    overflow: 'hidden'
                }}
            >
                {changemakerWebsiteState.thumbnail ? (
                    <div
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '257px'
                        }}
                    >
                        <img
                            src={changemakerWebsiteState.thumbnail}
                            alt="template"
                            width={1400}
                            height={900}
                            style={{ objectFit: 'cover', width: '100%' }}
                        />
                    </div>
                ) : (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                            width: '100%',
                            height: 540,
                            border: '1px solid #ccc',
                            margin: '100px auto'
                        }}
                    >
                        <p className="text-center" style={{ fontSize: '100px' }}>
                            🌆
                        </p>
                    </div>
                )}
            </div>
            <div
                className="d-flex"
                style={{
                    borderRadius: '0 0 10px 10px',
                    width: '100%',
                    overflow: 'hidden',
                    textAlign: 'center'
                }}
            >
                <a
                    href={`https://${changemakerWebsiteState.templateUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        width: '100%',
                        color: '#fff',
                        background: '#C26B04',
                        padding: '20px',
                        fontWeight: 600
                    }}
                >
                    <div>Preview</div>
                </a>

                <Link
                    to="/website/templates/liveEditor"
                    style={{
                        width: '100%',
                        color: '#fff',
                        background: '#0A6EBA',
                        padding: '20px',
                        textAlign: 'center',
                        fontWeight: 600
                    }}
                >
                    <div>Live Editor</div>
                </Link>
            </div>
        </div>
    );
}

export default WebsiteBuilder_template;
