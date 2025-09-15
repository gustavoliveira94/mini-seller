import { render, fireEvent } from "@testing-library/react";
import { vi, Mock } from "vitest";
import { LeadDetailPanel } from "../LeadDetailPanel";
import type { Lead } from "@/core/types";

// mock the hook used by the component
vi.mock("@/core/hooks/useLeadDetailPanel", () => ({
  useLeadDetailPanel: vi.fn(),
}));

import { useLeadDetailPanel } from "@/core/hooks/useLeadDetailPanel";

describe("LeadDetailPanel UI behavior", () => {
  const sampleLead: Lead = {
    id: "lead-1",
    name: "Lead 1",
    email: "lead1@test.com",
    company: "Company 1",
    status: "new",
    source: "Website",
    score: 85,
  } as Lead;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {},
      opportunityAmount: "",
      setOpportunityAmount: vi.fn(),
      errors: {},
      saving: false,
      converting: false,
      saveError: null,
      hasUnsavedChanges: false,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert: vi.fn(),
    });

    const { queryByText } = render(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    expect(queryByText("Lead Details")).toBeNull();
  });

  it("renders header, id and initial field values when open", () => {
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {
        name: "Lead 1",
        email: "lead1@test.com",
        company: "Company 1",
        status: "new",
      },
      opportunityAmount: "",
      setOpportunityAmount: vi.fn(),
      errors: {},
      saving: false,
      converting: false,
      saveError: null,
      hasUnsavedChanges: false,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert: vi.fn(),
    });

    const { getAllByText, getAllByDisplayValue } = render(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    expect(getAllByText("Lead Details")[0]).toBeInTheDocument();
    expect(getAllByText(`ID: ${sampleLead.id}`)[0]).toBeInTheDocument();

    // inputs show values (use getAllByDisplayValue and take first)
    const nameInputs = getAllByDisplayValue("Lead 1");
    expect(nameInputs[0]).toBeInTheDocument();

    const emailInputs = getAllByDisplayValue("lead1@test.com");
    expect(emailInputs[0]).toBeInTheDocument();

    const companyInputs = getAllByDisplayValue("Company 1");
    expect(companyInputs[0]).toBeInTheDocument();
  });

  it("shows field validation errors coming from hook (name)", () => {
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: { name: "", email: "", company: "", status: "new" },
      opportunityAmount: "",
      setOpportunityAmount: vi.fn(),
      errors: { name: "Name is required" },
      saving: false,
      converting: false,
      saveError: null,
      hasUnsavedChanges: true,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert: vi.fn(),
    });

    const { getAllByTestId } = render(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    const nameError = getAllByTestId("name-error")[0];
    expect(nameError).toBeInTheDocument();
    expect(nameError.textContent).toContain("Name is required");
  });

  it("disables Save button when hasUnsavedChanges is false and enables when true", () => {
    // first: no unsaved changes -> button disabled
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {
        name: "Lead 1",
        email: "lead1@test.com",
        company: "Company 1",
        status: "new",
      },
      opportunityAmount: "",
      setOpportunityAmount: vi.fn(),
      errors: {},
      saving: false,
      converting: false,
      saveError: null,
      hasUnsavedChanges: false,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert: vi.fn(),
    });

    const { getAllByText, rerender } = render(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    const saveTextDisabled = getAllByText("Save Changes")[0];
    const saveBtnDisabled = saveTextDisabled.closest("button");
    expect(saveBtnDisabled).toBeTruthy();
    expect(saveBtnDisabled).toBeDisabled();

    // now: unsaved changes -> button enabled
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {
        name: "Lead 1",
        email: "lead1@test.com",
        company: "Company 1",
        status: "new",
      },
      opportunityAmount: "",
      setOpportunityAmount: vi.fn(),
      errors: {},
      saving: false,
      converting: false,
      saveError: null,
      hasUnsavedChanges: true,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert: vi.fn(),
    });

    // rerender to apply new hook state
    rerender(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    const saveTextEnabled = getAllByText("Save Changes")[0];
    const saveBtnEnabled = saveTextEnabled.closest("button");
    expect(saveBtnEnabled).toBeTruthy();
    expect(saveBtnEnabled).not.toBeDisabled();
  });

  it("calls handleSave when Save Changes is clicked", () => {
    const handleSave = vi.fn();
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {
        name: "Lead 1",
        email: "lead1@test.com",
        company: "Company 1",
        status: "new",
      },
      opportunityAmount: "",
      setOpportunityAmount: vi.fn(),
      errors: {},
      saving: false,
      converting: false,
      saveError: null,
      hasUnsavedChanges: true,
      handleInputChange: vi.fn(),
      handleSave,
      handleConvert: vi.fn(),
    });

    const { getAllByText } = render(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    const saveText = getAllByText("Save Changes")[0];
    const saveBtn = saveText.closest("button") as HTMLElement;
    fireEvent.click(saveBtn);
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it("shows 'Saving...' when saving is true", () => {
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {
        name: "Lead 1",
        email: "lead1@test.com",
        company: "Company 1",
        status: "new",
      },
      opportunityAmount: "",
      setOpportunityAmount: vi.fn(),
      errors: {},
      saving: true,
      converting: false,
      saveError: null,
      hasUnsavedChanges: true,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert: vi.fn(),
    });

    const { getAllByText } = render(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    const savingText = getAllByText("Saving...")[0];
    expect(savingText).toBeInTheDocument();
  });

  it("shows 'Converting...' and disables convert button when converting is true", () => {
    const handleConvert = vi.fn();
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {
        name: "Lead 1",
        email: "lead1@test.com",
        company: "Company 1",
        status: "new",
      },
      opportunityAmount: "1000",
      setOpportunityAmount: vi.fn(),
      errors: {},
      saving: false,
      converting: true,
      saveError: null,
      hasUnsavedChanges: false,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert,
    });

    const { getAllByText } = render(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    const convertingText = getAllByText("Converting...")[0];
    expect(convertingText).toBeInTheDocument();

    // convert button is the one that contains "Converting..." text; ensure it's disabled via attribute
    const convertingBtn = convertingText.closest("button");
    expect(convertingBtn).toBeTruthy();
    expect(convertingBtn).toBeDisabled();
  });

  it("calls handleConvert when Convert button is clicked and passes amount through hook", async () => {
    const handleConvert = vi.fn();
    const setAmount = vi.fn();
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {
        name: "Lead 1",
        email: "lead1@test.com",
        company: "Company 1",
        status: "new",
      },
      opportunityAmount: "2500",
      setOpportunityAmount: setAmount,
      errors: {},
      saving: false,
      converting: false,
      saveError: null,
      hasUnsavedChanges: false,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert,
    });

    const { getAllByText } = render(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    const convertBtn = getAllByText("Convert to Opportunity")[0];
    convertBtn.onclick = handleConvert;
    fireEvent.click(convertBtn);

    expect(handleConvert).toHaveBeenCalledTimes(1);
  });

  it("renders saveError message when provided by hook", () => {
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {
        name: "Lead 1",
        email: "lead1@test.com",
        company: "Company 1",
        status: "new",
      },
      opportunityAmount: "",
      setOpportunityAmount: vi.fn(),
      errors: {},
      saving: false,
      converting: false,
      saveError: "Network failed",
      hasUnsavedChanges: false,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert: vi.fn(),
    });

    const { getAllByText } = render(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    const errText = getAllByText("Network failed")[0];
    expect(errText).toBeInTheDocument();
  });

  it("shows 'Cancel' label when hasUnsavedChanges true, otherwise 'Close' and calls onClose", () => {
    const onClose = vi.fn();

    // hasUnsavedChanges = true -> shows "Cancel"
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {
        name: "Lead 1",
        email: "lead1@test.com",
        company: "Company 1",
        status: "new",
      },
      opportunityAmount: "",
      setOpportunityAmount: vi.fn(),
      errors: {},
      saving: false,
      converting: false,
      saveError: null,
      hasUnsavedChanges: true,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert: vi.fn(),
    });

    const { getAllByText, rerender } = render(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={onClose}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    const cancelText = getAllByText("Cancel")[0];
    const cancelBtn = cancelText.closest("button") as HTMLElement;
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    // hasUnsavedChanges = false -> shows "Close"
    (useLeadDetailPanel as unknown as Mock).mockReturnValue({
      formData: {
        name: "Lead 1",
        email: "lead1@test.com",
        company: "Company 1",
        status: "new",
      },
      opportunityAmount: "",
      setOpportunityAmount: vi.fn(),
      errors: {},
      saving: false,
      converting: false,
      saveError: null,
      hasUnsavedChanges: false,
      handleInputChange: vi.fn(),
      handleSave: vi.fn(),
      handleConvert: vi.fn(),
    });

    rerender(
      <LeadDetailPanel
        lead={sampleLead}
        isOpen={true}
        onClose={onClose}
        onSave={vi.fn()}
        onConvertToOpportunity={vi.fn()}
      />,
    );

    const closeText = getAllByText("Close")[0];
    const closeBtn = closeText.closest("button") as HTMLElement;
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
