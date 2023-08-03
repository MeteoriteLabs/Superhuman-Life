import { useContext } from 'react';
import Toggle from 'react-toggle';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { Link } from 'react-router-dom';

function WebsiteBuilder_template(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    return (
        <div className="my-5 bg-dark" style={{ borderRadius: '15px' }}>
            <hr />
            <div
                className="mb-2 mt-5 d-flex justify-content-between align-items-baseline"
                style={{ paddingInline: '20px' }}
            >
                <h4
                    style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: '#fff',
                        boxShadow:
                            'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                    }}
                >
                    My Website
                </h4>
                <div className="d-flex" style={{ gap: 20, color: '#fff' }}>
                    <p>Draft</p>
                    <Toggle icons={false} />
                    <p>Publish</p>
                </div>
            </div>
            <div
                style={{
                    width: '80%',
                    position: 'relative',
                    paddingBlock: '60px',
                    margin: 'auto',
                    borderRadius: '20px',
                    overflow: 'hidden'
                }}
            >
                {changemakerWebsiteState.thumbnail ? (
                    <div
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: 540
                        }}
                    >
                        <img
                            src={changemakerWebsiteState.thumbnail}
                            alt="template"
                            width={1400}
                            height={900}
                            style={{ objectFit: 'cover', width: '100%', height: 540 }}
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
                    borderRadius: '0 0 15px 15px',
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
