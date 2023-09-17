import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { ThreeDots } from 'react-bootstrap-icons';

function WebsiteBuilder_settings(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    return (
        <>
            <div
                className="my-2 mr-2"
                style={{ width: '100%', gap: '30px', flexDirection: 'column', display: 'flex' }}
            >
                <div
                    style={{
                        width: '100%',
                        padding: 20,
                        borderRadius: 10,
                        boxShadow:
                            'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                    }}
                    className="bg-dark"
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <h4
                            className="mb-2"
                            style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}
                        >
                            Community Website
                        </h4>
                        <ThreeDots color="#fff" fill="#fff" fontSize={22} />
                    </div>
                    <div
                        style={{
                            color: '#fff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px 0px'
                        }}
                    >
                        {changemakerWebsiteState.subdomain
                            ? changemakerWebsiteState.subdomain
                            : 'Not Selected'}
                    </div>
                </div>
                <div
                    style={{
                        width: '100%',

                        padding: 20,
                        borderRadius: 10,
                        boxShadow:
                            'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                    }}
                    className="bg-dark"
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <h4
                            className="mb-2"
                            style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}
                        >
                            Personal Website
                        </h4>
                        <ThreeDots color="#fff" fill="#fff" fontSize={22} />
                    </div>
                    <div
                        style={{
                            color: '#fff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px 0px'
                        }}
                        className="bg-dark"
                    >
                        {changemakerWebsiteState.domain
                            ? changemakerWebsiteState.domain
                            : 'Not Selected'}
                    </div>
                </div>
            </div>
        </>
    );
}

export default WebsiteBuilder_settings;
