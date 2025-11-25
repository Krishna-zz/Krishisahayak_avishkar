

function Navbar() {
  return (
    <div className="w-full bg-green-700 text-white py-4 px-8 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold">KrishiSahayak</h1>
      <div className="flex gap-6">
        <a href="/" className="hover:text-yellow-300">Home</a>
        <a href="/dashboard" className="hover:text-yellow-300">Dashboard</a>
      </div>
    </div>
  );
}

export default Navbar