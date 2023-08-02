import { useContext, useEffect } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import Loader from 'components/Loader/Loader';

function Index(): JSX.Element {
    const { changemakerWebsiteState, setChangemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);

    const { currentSelectedRoute } = changemakerWebsiteState;
    useEffect(() => {
        window.addEventListener('message', function (event) {
            event.data.event_id === 'current-page'
                ? setChangemakerWebsiteState({
                      ...changemakerWebsiteState,
                      currentSelectedRoute: event.data.data.url
                  })
                : null;
        });
    }, []);

    return (
        <div
            style={{
                color: 'white',
                width: '90%',
                overflow: 'hidden',
                paddingTop: '10px',
                margin: 'auto'
            }}
        >
            <div style={{ width: '100%', height: '92vh' }}>
                {changemakerWebsiteState.loading ? (
                    <div
                        style={{
                            background: 'white',
                            width: '100%',
                            height: '142%',
                            borderRadius: '10px 10px 0 0',
                            transform: 'scale(.7)',
                            transformOrigin: 'top center'
                        }}
                    >
                        <Loader msg={'loading....'} />
                    </div>
                ) : (
                    <iframe
                        src={`https://${changemakerWebsiteState.subdomain}${currentSelectedRoute}`}
                        allowFullScreen={true}
                        style={{
                            background: 'white',
                            width: '100%',
                            height: '142%',
                            borderRadius: '10px 10px 0 0',
                            transform: 'scale(.7)',
                            transformOrigin: 'top center'
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default Index;
