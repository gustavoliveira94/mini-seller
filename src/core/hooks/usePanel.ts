import { useState } from "react";
import { Lead } from "../types";

export const usePanel = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedLead(null), 300);
  };

  return {
    handleLeadSelect,
    handlePanelClose,
    selectedLead,
    isPanelOpen,
  };
};
