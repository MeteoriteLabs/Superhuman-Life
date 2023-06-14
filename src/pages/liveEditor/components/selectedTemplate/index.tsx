function Index(): JSX.Element {
  const template = JSON.parse(localStorage.getItem('selectedTemplate') as string);

  return (
    <div
      style={{
        color: 'white',
        marginLeft: '115px',
        overflow: 'hidden',
        padding: '20px 20px 0 20px'
      }}>
      <div style={{ width: '100vw', height: '89vh' }}>
        <iframe
          src={`https://${template.domain}`}
          title="YouTube video player"
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
      </div>
    </div>
  );
}

export default Index;
