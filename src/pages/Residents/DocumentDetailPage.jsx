import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const DocumentDetailPage = () => {
  const { id, docId } = useParams(); // residentId, documentId
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(
          `http://localhost/krfs-api/api/documents/get_one.php?document_id=${docId}`
        );
        const result = await response.json();
        if (result.success) {
          setDocument(result.document);
        }
      } catch (err) {
        console.error("Failed to load document:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [docId]);

  if (loading) return <div>{t("loading")}...</div>;
  if (!document) return <div>{t("document_not_found")}</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t("document_details")}</CardTitle>
            <Button variant="outline" onClick={() => navigate(-1)}>
              ← {t("back")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              <strong>{t("type")}</strong>: {document.type}
            </p>
            <p>
              <strong>{t("issue_date")}</strong>: {document.issue_date}
            </p>
            <p>
              <strong>{t("expiry_date")}</strong>:{" "}
              {document.expiry_date || t("none")}
            </p>
            <p>
              <strong>{t("status")}</strong>: {document.status}
            </p>
            <p>
              <strong>{t("file_path")}</strong>: {document.file_path}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentDetailPage;
