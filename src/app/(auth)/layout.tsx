interface AuthLayoutProps {
  children: React.ReactNode;
};

const AuthLayout = ({children} : AuthLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <nav className="w-full bg-green-900">Auth Layout Navbar</nav>
      {children}
    </div>
  );
}
 
export default AuthLayout;
