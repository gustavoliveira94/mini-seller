import { useState, useEffect, useCallback } from "react";
import { Lead, FilterState } from "../types";
import {
  saveToStorage,
  loadFromStorage,
  STORAGE_KEYS,
} from "../utils/localStorage";
import leadsData from "../data/leads.json";

const defaultFilters: FilterState = {
  search: "",
  status: "all",
  sortBy: "score",
  sortOrder: "desc",
};

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState<FilterState>(
    loadFromStorage(STORAGE_KEYS.FILTER_STATE, defaultFilters),
  );
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLeads(leadsData as Lead[]);
      setError(null);
    } catch {
      setError("Failed to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLead = useCallback(() => {
    let result = [...leads];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower),
      );
    }

    if (filters.status !== "all") {
      result = result.filter((lead) => lead.status === filters.status);
    }

    result.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "company":
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        default:
          aValue = a.score;
          bValue = b.score;
      }

      if (filters.sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredLeads(result);
  }, [leads, filters]);

  useEffect(() => {
    filteredLead();
  }, [leads, filters, filteredLead]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FILTER_STATE, filters);
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const updateLead = useCallback(
    async (leadId: string, updates: Partial<Lead>): Promise<Lead> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            reject(new Error("Failed to update lead. Please try again."));
            return;
          }

          setLeads((prev) =>
            prev.map((lead) =>
              lead.id === leadId ? { ...lead, ...updates } : lead,
            ),
          );

          const updatedLead = leads.find((lead) => lead.id === leadId);
          if (updatedLead) {
            resolve({ ...updatedLead, ...updates });
          } else {
            reject(new Error("Lead not found"));
          }
        }, 500);
      });
    },
    [leads],
  );

  const removeLead = useCallback((leadId: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
  }, []);

  const handleLeadSave = async (leadId: string, updates: Partial<Lead>) => {
    const originalLead = selectedLead;

    if (selectedLead) {
      setSelectedLead({ ...selectedLead, ...updates });
    }

    try {
      const updatedLead = await updateLead(leadId, updates);
      setSelectedLead(updatedLead);
      return updatedLead;
    } catch (error) {
      if (originalLead) {
        setSelectedLead(originalLead);
      }

      throw error;
    }
  };

  return {
    leads: filteredLeads,
    filters,
    loading,
    error,
    updateFilters,
    updateLead,
    removeLead,
    handleLeadSave,
  };
};
