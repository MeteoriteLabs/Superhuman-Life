import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from '../../../../context/changemakerWebsite-context';
import Loader from '../../../../components/Loader/Loader';

function Index(): JSX.Element {
  const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

  return (
    <div
      style={{
        color: 'white',
        marginLeft: '115px',
        overflow: 'hidden',
        padding: '20px 20px 0 20px'
      }}>
      <div style={{ width: '100vw', height: '89vh' }}>
        {changemakerWebsiteState.loading ? (
          <div
            style={{
              background: 'white',
              width: '100%',
              height: '140%',
              borderRadius: '10px 10px 0 0',
              transform: 'scale(.7)',
              transformOrigin: 'top center'
            }}>
            <Loader msg={'loading....'} />
          </div>
        ) : (
          <iframe
            src={`https://${changemakerWebsiteState.subdomain}`}
            allowFullScreen={true}
            style={{
              background: 'white',
              width: '100%',
              height: '140%',
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
