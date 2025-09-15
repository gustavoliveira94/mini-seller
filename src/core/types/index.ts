export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: "new" | "contacted" | "qualified" | "disqualified";
}

export interface Opportunity {
  id: string;
  name: string;
  stage: string;
  amount?: number;
  accountName: string;
  createdAt: string;
  leadId: string;
}

export interface FilterState {
  search: string;
  status: string;
  sortBy: "score" | "name" | "company";
  sortOrder: "asc" | "desc";
}
