import { useState, useEffect, useCallback } from "react";
import { Lead, Opportunity } from "../types";
import {
  saveToStorage,
  loadFromStorage,
  STORAGE_KEYS,
} from "../utils/localStorage";

interface IUseOpportunities {
  removeLead: (leadId: string) => void;
  handlePanelClose: () => void;
}

export const useOpportunities = ({
  removeLead,
  handlePanelClose,
}: IUseOpportunities) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(
    loadFromStorage(STORAGE_KEYS.OPPORTUNITIES, []),
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, opportunities);
  }, [opportunities]);

  const createOpportunity = useCallback(
    async (
      leadName: string,
      leadCompany: string,
      leadId: string,
      amount?: number,
    ): Promise<Opportunity> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 5% failure rate
          if (Math.random() < 0.05) {
            reject(
              new Error("Failed to create opportunity. Please try again."),
            );

            return;
          }

          const newOpportunity: Opportunity = {
            id: `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `${leadName} - ${leadCompany} Opportunity`,
            stage: "Qualification",
            amount,
            accountName: leadCompany,
            createdAt: new Date(),
            leadId,
          };

          setOpportunities((prev) => [newOpportunity, ...prev]);

          resolve(newOpportunity);
        }, 600);
      });
    },
    [],
  );

  const handleConvertToOpportunity = async (lead: Lead, amount?: number) => {
    try {
      await createOpportunity(lead.name, lead.company, lead.id, amount);

      removeLead(lead.id);
      setFeedback(`Successfully converted ${lead.name} to an opportunity!`);
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback("Failed to create opportunity. Please try again.");
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      handlePanelClose();
    }
  };

  return {
    opportunities,
    createOpportunity,
    handleConvertToOpportunity,
    feedback,
  };
};
