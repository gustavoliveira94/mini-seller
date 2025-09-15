import { Target, Users } from "lucide-react";

interface HeaderProps {
  leadsCount: number;
  opportunitiesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  leadsCount,
  opportunitiesCount,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Mini Seller Console
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{leadsCount} Leads</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>
                {opportunitiesCount > 1
                  ? `${opportunitiesCount} Opportunities`
                  : `${opportunitiesCount} Opportunity`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
