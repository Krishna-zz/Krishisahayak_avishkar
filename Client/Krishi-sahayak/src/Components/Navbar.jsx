import { Link } from "react-router-dom"

function Navbar() {
  return (
    <div className="w-full bg-green-700 text-white py-4 px-8 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold">KrishiSahayak</h1>
      <div className="flex gap-6">
       <Link to="/" className="hover:text-yellow-300">Home</Link>
      <Link to="/dashboard" className="hover:text-yellow-300">Dashboard</Link>
      </div>
    </div>
  );
}

export default Navbar