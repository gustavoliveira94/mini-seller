import { render, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

import { LeadsList } from "../LeadsList";
import type { Lead } from "@/core/types";

describe("LeadsList", () => {
  const mockLeads: Lead[] = [
    {
      id: "1",
      name: "Lead 1",
      email: "lead1@test.com",
      company: "Company 1",
      status: "new",
      score: 72,
      source: "Website",
    } as Lead,
    {
      id: "2",
      name: "Lead 2",
      email: "lead2@test.com",
      company: "Company 2",
      status: "contacted",
      score: 55,
      source: "Referral",
    } as Lead,
  ];

  it("renders loading state", () => {
    const { getByText } = render(
      <LeadsList
        leads={[]}
        loading={true}
        error={null}
        onLeadSelect={vi.fn()}
      />,
    );

    expect(getByText("Loading leads...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    const { getByText } = render(
      <LeadsList
        leads={[]}
        loading={false}
        error={"Failed to fetch"}
        onLeadSelect={vi.fn()}
      />,
    );

    expect(getByText("Error Loading Leads")).toBeInTheDocument();
    expect(getByText("Failed to fetch")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    const { getByText } = render(
      <LeadsList
        leads={[]}
        loading={false}
        error={null}
        onLeadSelect={vi.fn()}
      />,
    );

    expect(getByText("No Leads Found")).toBeInTheDocument();
    expect(
      getByText("Try adjusting your search or filter criteria."),
    ).toBeInTheDocument();
  });

  it("renders leads list (desktop + mobile duplicated in DOM) and shows lead details", () => {
    const { getAllByText, getAllByText: getAll } = render(
      <LeadsList
        leads={mockLeads}
        loading={false}
        error={null}
        onLeadSelect={vi.fn()}
      />,
    );

    const lead1NameElements = getAllByText("Lead 1");
    expect(lead1NameElements.length).toBeGreaterThanOrEqual(1);
    expect(lead1NameElements[0]).toBeInTheDocument();

    // Company and email should appear
    const companyElems = getAll("Company 1");
    expect(companyElems[0]).toBeInTheDocument();

    const emailElems = getAll("lead1@test.com");
    expect(emailElems[0]).toBeInTheDocument();

    // Score and status are rendered
    const scoreElems = getAll("72");
    expect(scoreElems[0]).toBeInTheDocument();
    const statusElems = getAll("new");
    expect(statusElems[0]).toBeInTheDocument();
  });

  it("calls onLeadSelect when clicking a lead (uses first occurrence)", () => {
    const handleLeadSelect = vi.fn();
    const { getAllByText } = render(
      <LeadsList
        leads={mockLeads}
        loading={false}
        error={null}
        onLeadSelect={handleLeadSelect}
      />,
    );

    const lead1Text = getAllByText("Lead 1")[0];

    fireEvent.click(lead1Text);

    expect(handleLeadSelect).toHaveBeenCalledTimes(1);
    expect(handleLeadSelect).toHaveBeenCalledWith(mockLeads[0]);
  });
});
