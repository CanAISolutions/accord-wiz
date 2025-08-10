import { useParams } from "react-router-dom";
import { loadAgreement } from "@/lib/finalize";

const Preview = () => {
  const params = useParams();
  const id = params.id as string;
  const a = loadAgreement(id);
  if (!a) return <div className="p-6">Agreement not found.</div>;
  return (
    <object data={a.pdfDataUrl} type="application/pdf" width="100%" height="100%" style={{ minHeight: 600 }}>
      <a href={a.pdfDataUrl}>Download PDF</a>
    </object>
  );
};

export default Preview;


