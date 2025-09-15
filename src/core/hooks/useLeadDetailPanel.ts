import { useState, useEffect, useCallback } from "react";
import { Lead } from "@/core/types";
import { validateLead } from "@/core/utils/validation";

export const useLeadDetailPanel = ({
  lead,
  onConvertToOpportunity,
  onSave,
}: {
  lead: Lead | null;
  onSave: (leadId: string, updates: Partial<Lead>) => Promise<Lead>;
  onConvertToOpportunity: (lead: Lead, amount?: number) => Promise<unknown>;
}) => {
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [opportunityAmount, setOpportunityAmount] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        company: lead.company,
        status: lead.status,
      });
      setOpportunityAmount("");
      setErrors({});
      setSaveError(null);
      setHasUnsavedChanges(false);
    }
  }, [lead]);

  const handleInputChange = useCallback(
    (field: keyof Lead, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
      setSaveError(null);
    },
    [errors],
  );

  const handleSave = useCallback(async () => {
    if (!lead || !formData.name || !formData.email || !formData.company) return;

    const validation = validateLead({
      name: formData.name,
      email: formData.email,
      company: formData.company,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      await onSave(lead.id, {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        status: formData.status,
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to save lead",
      );
    } finally {
      setSaving(false);
    }
  }, [lead, formData, onSave]);

  const handleConvert = useCallback(async () => {
    if (!lead) return;
    setConverting(true);

    try {
      const amount = opportunityAmount
        ? parseFloat(opportunityAmount)
        : undefined;
      await onConvertToOpportunity(lead, amount);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to convert lead",
      );
    } finally {
      setConverting(false);
    }
  }, [lead, opportunityAmount, onConvertToOpportunity]);

  return {
    formData,
    opportunityAmount,
    setOpportunityAmount,
    errors,
    saving,
    converting,
    saveError,
    hasUnsavedChanges,
    handleInputChange,
    handleSave,
    handleConvert,
  };
};
