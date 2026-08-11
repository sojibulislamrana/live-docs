interface DocumentLayoutProps {
  children: React.ReactNode;
}

const DocumentsLayout = ({ children }: DocumentLayoutProps) => {
  return <div className="flex flex-col gap-y-4">{children}</div>;
};

export default DocumentsLayout;
