import leadsData from "../data/leads.json";
import { Lead } from "../types";

const getLeads = (): Promise<Lead[]> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(leadsData as Lead[]), 800),
  );
};

export const leadsService = {
  getLeads,
};
