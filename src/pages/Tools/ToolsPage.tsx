import React, { useState } from 'react';
import { DCACalculator } from '../../features/tools/DCACalculator';
import { PortfolioImport } from '../../features/tools/PortfolioImport';

export const ToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dca' | 'import'>('dca');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Trading Tools</h1>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('dca')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'dca'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 DCA Calculator
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'import'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📤 Import Transactions
        </button>
      </div>

      <div>
        {activeTab === 'dca' && <DCACalculator />}
        {activeTab === 'import' && <PortfolioImport />}
      </div>
    </div>
  );
};
