import TestCrypto from '../features/crypto/TestCrypto';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Crypto Portfolio Tracker
          </h1>
          <p className="text-gray-600 mt-2">
            Track your cryptocurrency investments in real-time
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <TestCrypto />
      </main>
    </div>
  );
}

export default App;
