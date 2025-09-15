import React from "react";
import { DollarSign, Calendar, Building, TrendingUp } from "lucide-react";
import { Opportunity } from "@/core/types";
import { stageColors } from "./utils/stageColors";

interface OpportunitiesListProps {
  opportunities: Opportunity[];
}

export const OpportunitiesList: React.FC<OpportunitiesListProps> = ({
  opportunities,
}) => {
  if (opportunities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Opportunities</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Opportunities Yet
            </h3>
            <p className="text-gray-600">Convert some leads to get started!</p>
          </div>
        </div>
      </div>
    );
  }

  const totalValue = opportunities
    .filter((opp) => opp?.amount)
    .reduce((sum, opp) => sum + (opp?.amount || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Opportunities</h2>
          <div className="text-sm text-gray-600">
            Total Value:{" "}
            <span className="font-medium text-green-600">
              ${totalValue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opportunity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opportunities.map((opportunity) => (
              <tr
                key={opportunity.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {opportunity.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {opportunity.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1">
                    <Building className="h-3 w-3 text-gray-400" />
                    {opportunity.accountName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stageColors[
                        opportunity.stage as keyof typeof stageColors
                      ] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {opportunity.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1">
                    {opportunity.amount ? (
                      <>
                        <DollarSign className="h-3 w-3 text-green-500" />
                        {opportunity.amount.toLocaleString()}
                      </>
                    ) : (
                      <span className="text-gray-400">Not specified</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    {new Date(opportunity.createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {opportunity.name}
                </h3>
                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Building className="h-3 w-3" />
                  {opportunity.accountName}
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stageColors[opportunity.stage as keyof typeof stageColors] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {opportunity.stage}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-3 w-3" />
                {new Date(opportunity.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                {opportunity.amount ? (
                  <>
                    <DollarSign className="h-3 w-3 text-green-500" />
                    <span className="text-gray-900 font-medium">
                      ${opportunity.amount.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">Amount TBD</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
