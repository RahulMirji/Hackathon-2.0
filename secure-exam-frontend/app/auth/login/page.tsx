import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#F5F5F5] dark:bg-[#101922]">
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col md:flex-row max-w-6xl w-full flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden m-4">
          {/* Left side - Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8">
            <LoginForm />
          </div>

          {/* Right side - Image */}
          <div
            className="hidden md:flex w-1/2 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA6S6Jnwnj3QCA2WEFlkG423D6UHnT4hYjAO7Ltp0bul-RJGsRzKmGW0him7-Gar46Onnr7HfdbCSHkLuenGdmMlDoSkPo-nkItGgFYZICWkw6Nf0jqO8dyzab3OykpnyS_WnoCPz77LRYt9YVoMaUdCDi6ga0kodVpgE0ZnPJ6XqCrdTq0QSx4rH6_lu6hQN1MmiwRMWO7zyBgwROekOQl8B5AvrZxY03hCnIVrrbUOtAHMorUYIHqkfUhgRf-8aqivw8Y3ITH2Ltu')",
            }}
            aria-label="A focused young male student sitting at a desk with a laptop, concentrating on an exam."
          />
        </div>
      </div>
    </div>
  );
}
