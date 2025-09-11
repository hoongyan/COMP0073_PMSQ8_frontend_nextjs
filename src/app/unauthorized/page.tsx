export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
      <h1 className="text-5xl font-bold text-black mb-4 font-sans">
        Unauthorized Access
      </h1>
      <p className="text-gray-700 text-lg max-w-2xl">
        You don’t have permission to access this page. Please sign in with the
        appropriate account or contact your administrator for assistance.
      </p>
    </div>
  );
}
