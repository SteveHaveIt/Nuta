import React, { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import { toast } from 'react-toastify';

interface SettingsForm {
  siteName: string;
  siteDescription: string;
  loyaltyPointsPerKES: number;
  loyaltyKESPerPoint: number;
  affiliateCommissionRate: number;
  isMaintenanceMode: boolean;
}

const AdminSettings: React.FC = () => {
  const [formData, setFormData] = useState<SettingsForm>({
    siteName: '',
    siteDescription: '',
    loyaltyPointsPerKES: 0,
    loyaltyKESPerPoint: 0,
    affiliateCommissionRate: 0,
    isMaintenanceMode: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const settingsQuery = trpc.settings.get.useQuery(undefined, {
    onSuccess: (data) => {
      if (data) {
        setFormData({
          siteName: data.siteName || '',
          siteDescription: data.siteDescription || '',
          loyaltyPointsPerKES: data.loyaltyPointsPerKES || 0,
          loyaltyKESPerPoint: data.loyaltyKESPerPoint || 0,
          affiliateCommissionRate: data.affiliateCommissionRate || 0,
          isMaintenanceMode: data.isMaintenanceMode || false,
        });
      }
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(`Failed to load settings: ${error.message}`);
      setIsLoading(false);
    }
  });

  const updateSettingsMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success('Settings updated successfully!');
      settingsQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update settings: ${error.message}`);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-2">Admin Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Settings */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
              <input
                type="text"
                name="siteName"
                id="siteName"
                value={formData.siteName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">Site Description</label>
              <textarea
                name="siteDescription"
                id="siteDescription"
                value={formData.siteDescription}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Loyalty Program Settings */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Loyalty Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="loyaltyPointsPerKES" className="block text-sm font-medium text-gray-700">Points Earned per KES</label>
              <input
                type="number"
                name="loyaltyPointsPerKES"
                id="loyaltyPointsPerKES"
                value={formData.loyaltyPointsPerKES}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">e.g., 0.018 (for 9 points per KES 500)</p>
            </div>
            <div>
              <label htmlFor="loyaltyKESPerPoint" className="block text-sm font-medium text-gray-700">KES Value per Point</label>
              <input
                type="number"
                name="loyaltyKESPerPoint"
                id="loyaltyKESPerPoint"
                value={formData.loyaltyKESPerPoint}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">e.g., 3 (for KES 3 redemption value)</p>
            </div>
          </div>
        </div>

        {/* Affiliate Program Settings */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Affiliate Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="affiliateCommissionRate" className="block text-sm font-medium text-gray-700">Commission Rate (%)</label>
              <input
                type="number"
                name="affiliateCommissionRate"
                id="affiliateCommissionRate"
                value={formData.affiliateCommissionRate}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">e.g., 5 (for 5% commission)</p>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="pb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">System</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isMaintenanceMode"
              id="isMaintenanceMode"
              checked={formData.isMaintenanceMode}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isMaintenanceMode" className="ml-3 block text-sm font-medium text-gray-700">
              Enable Maintenance Mode
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">When enabled, the site will show a maintenance page to non-admin users.</p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateSettingsMutation.isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {updateSettingsMutation.isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
