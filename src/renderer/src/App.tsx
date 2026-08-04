function Home(): React.JSX.Element {
  return (
    <div style={{ backgroundColor: '#1a1a1a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', scrollbarWidth: 'none'  , scrollbarColor: 'transparent transparent' }}>
      <h1 style={{ color: '#fff' }}>Welcome to the Home Page</h1>
    </div>
  )
}

function App(): React.JSX.Element {
  return <Home />
}

export default App
