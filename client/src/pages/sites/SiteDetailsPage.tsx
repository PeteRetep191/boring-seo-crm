import React from "react";
import { useParams, useNavigate } from "react-router-dom";
// Providers
import { DetailsSiteFormProvider } from "@/features/site/contexts";
// Forms
import { DetailsSiteForm } from "@/features/site/forms";

// ==============================
// SiteDetailsPage
// ==============================
const SiteDetailsPage: React.FC = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();

  // ------------------------------------
  // Handlers
  // ------------------------------------
  const handleSubmit = async () => {
    try {
      navigate(`/sites`);
    } catch (error) {
      console.error(error);
    }
  };

  // ------------------------------------
  // Render
  // ------------------------------------
  return (
    <DetailsSiteFormProvider>
      <DetailsSiteForm siteId={siteId} onSubmit={handleSubmit} />
    </DetailsSiteFormProvider>
  );
};

export default SiteDetailsPage;
