import { useOpportunities } from "@/core/hooks/useOpportunities";
import {
  Header,
  LeadDetailPanel,
  LeadsList,
  OpportunitiesList,
  SearchAndFilters,
} from "@/presentations/components";
import { usePanel } from "@/core/hooks/usePanel";
import { useLeads } from "@/core/hooks/useLeads";

export const Home: React.FC = () => {
  const {
    leads,
    loading,
    error,
    filters,
    updateFilters,
    handleLeadSave,
    removeLead,
  } = useLeads();
  const { selectedLead, isPanelOpen, handlePanelClose, handleLeadSelect } =
    usePanel();
  const { opportunities, handleConvertToOpportunity, feedback } =
    useOpportunities({ removeLead, handlePanelClose });

  const isSuccess = feedback?.startsWith("Successfully");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        leadsCount={leads?.length || 0}
        opportunitiesCount={opportunities?.length || 0}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {feedback && (
          <div
            className={`mb-6 p-4 ${isSuccess ? "bg-green" : "bg-red"}-50 border border-green-200 rounded-lg`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 ${isSuccess ? "bg-green" : "bg-red"}-100 rounded-full flex items-center justify-center`}
              >
                <div
                  className={`w-2 h-2 ${isSuccess ? "bg-green" : "bg-red"}-600 rounded-full`}
                />
              </div>
              <p className="text-sm text-green-800">{feedback}</p>
            </div>
          </div>
        )}

        <SearchAndFilters
          filters={filters}
          onFiltersChange={updateFilters}
          totalCount={leads.length}
        />

        <div className="mb-8">
          <LeadsList
            leads={leads}
            loading={loading}
            error={error}
            onLeadSelect={handleLeadSelect}
          />
        </div>

        <LeadDetailPanel
          lead={selectedLead}
          isOpen={isPanelOpen}
          onClose={handlePanelClose}
          onSave={handleLeadSave}
          onConvertToOpportunity={handleConvertToOpportunity}
        />

        <OpportunitiesList opportunities={opportunities} />
      </main>
    </div>
  );
};
