import { DocumentView } from "./document-view";

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;
  return <DocumentView documentId={documentId} />;
};

export default DocumentIdPage;
