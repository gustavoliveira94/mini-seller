import { render } from "@testing-library/react";

import { Header } from "../Header";

describe("Header", () => {
  it("renders the console title", () => {
    const { getAllByText } = render(
      <Header leadsCount={0} opportunitiesCount={0} />,
    );
    const titleElems = getAllByText("Mini Seller Console");
    expect(titleElems[0]).toBeInTheDocument();
  });

  it("displays the leads count correctly", () => {
    const { getAllByText } = render(
      <Header leadsCount={5} opportunitiesCount={0} />,
    );
    const leadsElems = getAllByText("5 Leads");
    expect(leadsElems[0]).toBeInTheDocument();
  });

  it("shows 'Opportunity' in singular when count = 1", () => {
    const { getAllByText } = render(
      <Header leadsCount={0} opportunitiesCount={1} />,
    );
    const oppElems = getAllByText("1 Opportunity");
    expect(oppElems[0]).toBeInTheDocument();
  });

  it("shows 'Opportunities' in plural when count > 1", () => {
    const { getAllByText } = render(
      <Header leadsCount={0} opportunitiesCount={3} />,
    );
    const oppElems = getAllByText("3 Opportunities");
    expect(oppElems[0]).toBeInTheDocument();
  });
});
