interface DocumentLayoutProps {
  children: React.ReactNode;
}

const DocumentsLayout = ({children} : DocumentLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="w-full bg-red-800">Document Navbar</div>
      {children}
    </div>
  );
}
 
export default DocumentsLayout;