function Index(): JSX.Element {
  return (
    <div style={{ color: 'white', marginLeft: '400px', marginTop: 30 }}>
      <iframe
        src="http://localhost:8000"
        title="YouTube video player"
        style={{ background: 'white', width: '65vw', height: '86vh', borderRadius: '10px' }}
      />
    </div>
  );
}

export default Index;
