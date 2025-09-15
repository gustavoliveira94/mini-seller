import { render } from "@testing-library/react";
import { OpportunitiesList } from "../OpportunitiesList";
import type { Opportunity } from "@/core/types";

describe("OpportunitiesList", () => {
  it("renders empty state when there are no opportunities", () => {
    const { getByText } = render(<OpportunitiesList opportunities={[]} />);

    expect(getByText("Opportunities")).toBeInTheDocument();
    expect(getByText("No Opportunities Yet")).toBeInTheDocument();
    expect(getByText("Convert some leads to get started!")).toBeInTheDocument();
  });

  it("renders a list of opportunities and shows total value", () => {
    const opportunities: Opportunity[] = [
      {
        id: "opp-1",
        name: "Opportunity A",
        accountName: "Acme Corp",
        stage: "Prospecting",
        amount: 1500,
        createdAt: new Date("2024-01-15T10:00:00.000Z").toISOString(),
        leadId: "1",
      },
      {
        id: "opp-2",
        name: "Opportunity B",
        accountName: "Beta LLC",
        stage: "Negotiation",
        amount: 2500,
        createdAt: new Date("2024-02-20T12:00:00.000Z").toISOString(),
        leadId: "2",
      },
    ];

    const { getByText, getAllByText } = render(
      <OpportunitiesList opportunities={opportunities} />,
    );

    // Header + names
    expect(getAllByText("Opportunities")[0]).toBeInTheDocument();
    expect(getAllByText("Opportunity A")[0]).toBeInTheDocument();
    expect(getAllByText("Opportunity B")[0]).toBeInTheDocument();

    // Accounts
    expect(getAllByText("Acme Corp")[0]).toBeInTheDocument();
    expect(getAllByText("Beta LLC")[0]).toBeInTheDocument();

    // Stages
    expect(getAllByText("Prospecting").length).toBeGreaterThan(0);
    expect(getAllByText("Negotiation").length).toBeGreaterThan(0);

    // Total value
    const totalValue = opportunities.reduce(
      (sum, o) => sum + (o.amount || 0),
      0,
    );
    const expected = `$${totalValue.toLocaleString()}`;
    expect(getByText((content) => content.includes(expected))).toBeTruthy();

    expect(getAllByText(/2024/)[0]).toBeInTheDocument();
  });

  it("shows fallback text when opportunity amount is not specified", () => {
    const opportunities: Opportunity[] = [
      {
        id: "opp-no-amount",
        name: "Opportunity X",
        accountName: "Gamma Inc",
        stage: "Qualification",
        createdAt: new Date().toISOString(),
        leadId: "",
      },
    ];

    const { getAllByText } = render(
      <OpportunitiesList opportunities={opportunities} />,
    );

    expect(getAllByText("Opportunity X")[0]).toBeInTheDocument();
    expect(getAllByText("Gamma Inc")[0]).toBeInTheDocument();

    expect(getAllByText("Not specified")[0]).toBeInTheDocument();
    expect(getAllByText("Amount TBD")[0]).toBeInTheDocument();
  });
});
