export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
      <div className="grid grid-cols-2 min-h-screen">
        <div className="relative flex flex-col justify-center items-center  bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb] text-white p-12 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl top-10 left-10"></div>
          <div className="absolute w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl bottom-10 right-10"></div>

          <div className="relative z-10 max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome to <span className="text-blue-200">FinPay</span>
            </h1>
            <img src="pic.jpg" />
            <p className="text-blue-100 text-lg">
              Manage your balance, transfer funds,
              and experience seamless digital payments.
            </p>

            <div className="mt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <p className="text-sm text-blue-100">
                  Secure • Fast • Reliable
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-gray-50">
          {children}
        </div>
      </div>
    );
  }