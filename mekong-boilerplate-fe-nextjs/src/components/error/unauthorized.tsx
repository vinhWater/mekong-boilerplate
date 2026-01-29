import Link from 'next/link';

export function UnauthorizedError() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-8">
              You do not have permission to access this page. Please contact an administrator if you believe this is an error.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Go Home
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
