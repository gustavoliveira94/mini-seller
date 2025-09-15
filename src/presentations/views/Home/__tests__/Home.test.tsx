import { fireEvent, render } from "@testing-library/react";
import { vi, Mock } from "vitest";

import { Home } from "@/presentations/views/Home/Home";
import { useLeads } from "@/core/hooks/useLeads";
import { usePanel } from "@/core/hooks/usePanel";
import { useOpportunities } from "@/core/hooks/useOpportunities";

vi.mock("@/core/hooks/useLeads");
vi.mock("@/core/hooks/usePanel");
vi.mock("@/core/hooks/useOpportunities");

describe("Home", () => {
  const mockLeads = [
    {
      id: "1",
      name: "Lead 1",
      email: "lead1@test.com",
      company: "Company 1",
      status: "new",
    },
    {
      id: "2",
      name: "Lead 2",
      email: "lead2@test.com",
      company: "Company 2",
      status: "contacted",
    },
  ];

  const mockOpportunities = [
    {
      id: "op1",
      name: "Opportunity 1",
      stage: "Prospecting",
      accountName: "Account 1",
      createdAt: new Date(),
      leadId: "1",
    },
  ];

  (useLeads as unknown as Mock).mockReturnValue({
    leads: mockLeads,
    loading: false,
    error: null,
    filters: {},
    updateFilters: vi.fn(),
    handleLeadSave: vi.fn(),
    removeLead: vi.fn(),
  });

  (usePanel as unknown as Mock).mockReturnValue({
    selectedLead: null,
    isPanelOpen: false,
    handlePanelClose: vi.fn(),
    handleLeadSelect: vi.fn(),
  });

  (useOpportunities as unknown as Mock).mockReturnValue({
    opportunities: mockOpportunities,
    handleConvertToOpportunity: vi.fn(),
    feedback: null,
  });

  it("renders Header, LeadsList, LeadDetailPanel, and OpportunitiesList", () => {
    const { getByText, queryByText, getAllByText } = render(<Home />);

    // Header
    expect(getByText("2 Leads")).toBeInTheDocument(); // leadsCount placeholder
    expect(getByText("1 Opportunity")).toBeInTheDocument(); // opportunitiesCount placeholder

    // LeadsList
    expect(getAllByText("Lead 1")[0]).toBeInTheDocument();
    expect(getAllByText("Lead 2")[0]).toBeInTheDocument();

    // LeadDetailPanel should not be rendered since isPanelOpen is false
    expect(queryByText("Lead Details")).not.toBeInTheDocument();

    // OpportunitiesList
    expect(getAllByText("Opportunity 1")[0]).toBeInTheDocument();
  });

  it("shows feedback message if provided", () => {
    (useOpportunities as unknown as Mock).mockReturnValueOnce({
      opportunities: mockOpportunities,
      handleConvertToOpportunity: vi.fn(),
      feedback: "Successfully converted Lead 1",
    });

    const { getByText } = render(<Home />);
    expect(getByText("Successfully converted Lead 1")).toBeInTheDocument();
  });

  it("calls handleLeadSelect when clicking on a lead", () => {
    const handleLeadSelect = vi.fn();
    (usePanel as unknown as Mock).mockReturnValue({
      selectedLead: null,
      isPanelOpen: false,
      handlePanelClose: vi.fn(),
      handleLeadSelect,
    });

    const { getByTestId } = render(<Home />);
    fireEvent.click(getByTestId("lead-row-1"));
    expect(handleLeadSelect).toHaveBeenCalledWith(mockLeads[0]);
  });

  it("renders LeadDetailPanel when isPanelOpen is true", () => {
    (usePanel as unknown as Mock).mockReturnValue({
      selectedLead: mockLeads[0],
      isPanelOpen: true,
      handlePanelClose: vi.fn(),
      handleLeadSelect: vi.fn(),
    });

    const { getByText, getByDisplayValue } = render(<Home />);
    expect(getByText("Lead Details")).toBeInTheDocument();
    expect(getByDisplayValue("Lead 1")).toBeInTheDocument();
  });
});
