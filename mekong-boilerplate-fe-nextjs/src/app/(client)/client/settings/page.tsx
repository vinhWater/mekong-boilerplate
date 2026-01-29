'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, Bell, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  useUserConfigurations,
  useCreateUserConfiguration,
  useUpdateUserConfiguration,
  useToggleUserConfiguration,
} from '@/lib/hooks';
import { UserConfiguration, GearmentConfigData, GeminiConfigData } from '@/types/user-configuration';

function SettingsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('general');
  const { data: session } = useSession();

  // Only fetch configurations for MANAGER role
  const {
    data: configurations,
    isLoading: isLoadingConfigs,
  } = useUserConfigurations();

  const createConfiguration = useCreateUserConfiguration();
  const updateConfiguration = useUpdateUserConfiguration();
  const toggleConfiguration = useToggleUserConfiguration();

  // Local state for editing configurations
  const [editingConfigs, setEditingConfigs] = useState<Record<number | string, any>>({});

  // Initialize editing state when configurations load
  useEffect(() => {
    if (configurations) {
      const initialState: Record<number | string, any> = {};
      configurations.forEach((config, index) => {
        const key = config.id ?? `temp-${index}`;
        initialState[key] = {
          ...config,
          configData: config.configData || {},
        };
      });
      setEditingConfigs(initialState);
    }
  }, [configurations]);

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Handle field change
  const handleConfigDataChange = (
    configKey: number | string,
    field: string,
    value: string,
  ) => {
    setEditingConfigs((prev) => ({
      ...prev,
      [configKey]: {
        ...prev[configKey],
        configData: {
          ...prev[configKey].configData,
          [field]: value,
        },
      },
    }));
  };

  // Handle save configuration
  const handleSaveConfiguration = async (configKey: number | string) => {
    const config = editingConfigs[configKey];

    if (!config) return;

    try {
      if (config.id) {
        // Update existing configuration
        await updateConfiguration.mutateAsync({
          id: config.id,
          configData: config.configData,
          isActive: config.isActive,
        });
      } else {
        // Create new configuration
        await createConfiguration.mutateAsync({
          configType: config.configType,
          configKey: config.configKey,
          configData: config.configData,
          isActive: config.isActive,
        });
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (config: UserConfiguration) => {
    if (config.id) {
      try {
        await toggleConfiguration.mutateAsync(config.id);
      } catch (error) {
        console.error('Failed to toggle configuration:', error);
      }
    } else {
      // For unsaved configs, just update local state
      const key = Object.keys(editingConfigs).find(
        k => editingConfigs[k] === config
      );
      if (key) {
        setEditingConfigs(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            isActive: !prev[key].isActive,
          },
        }));
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Configuration Management - Only for MANAGER role */}
          {session?.user?.role === 'manager' && (
            <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
              <CardHeader>
                <CardTitle>Configurations</CardTitle>
                <CardDescription>
                  Manage your provider and integration configurations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingConfigs ? (
                  <p className="text-muted-foreground">Loading configurations...</p>
                ) : (
                  <div className="space-y-6">
                    {configurations?.map((config, index) => {
                      const configKey = config.id ?? `temp-${index}`;
                      const editingConfig = editingConfigs[configKey];

                      if (!editingConfig) return null;

                      return (
                        <div
                          key={configKey}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <h3 className="font-medium">
                                  {config.configKey}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {config.configType}
                                </p>
                              </div>
                              <Badge variant={config.isActive ? 'default' : 'secondary'}>
                                {config.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`active-${configKey}`} className="text-sm">
                                Active
                              </Label>
                              <Switch
                                id={`active-${configKey}`}
                                checked={editingConfig.isActive}
                                onCheckedChange={() => handleToggleActive(config)}
                                disabled={toggleConfiguration.isPending}
                              />
                            </div>
                          </div>

                          {/* Parse and display config data fields */}
                          {config.configKey === 'Gearment' && (
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`api-key-${configKey}`}>
                                  API Key
                                </Label>
                                <Input
                                  id={`api-key-${configKey}`}
                                  type="text"
                                  value={(editingConfig.configData as GearmentConfigData)?.api_key || ''}
                                  onChange={(e) =>
                                    handleConfigDataChange(
                                      configKey,
                                      'api_key',
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter API Key"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`api-secret-${configKey}`}>
                                  API Secret
                                </Label>
                                <Input
                                  id={`api-secret-${configKey}`}
                                  type="password"
                                  value={(editingConfig.configData as GearmentConfigData)?.api_secret || ''}
                                  onChange={(e) =>
                                    handleConfigDataChange(
                                      configKey,
                                      'api_secret',
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter API Secret"
                                />
                              </div>
                            </div>
                          )}

                          {config.configKey === 'Gemini' && (
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`gemini-api-key-${configKey}`}>
                                  API Key
                                </Label>
                                <Input
                                  id={`gemini-api-key-${configKey}`}
                                  type="text"
                                  value={(editingConfig.configData as GeminiConfigData)?.api_key || ''}
                                  onChange={(e) =>
                                    handleConfigDataChange(
                                      configKey,
                                      'api_key',
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter Gemini API Key"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end">
                            <Button
                              onClick={() => handleSaveConfiguration(configKey)}
                              disabled={
                                createConfiguration.isPending ||
                                updateConfiguration.isPending
                              }
                            >
                              <Save className="mr-2 h-4 w-4" />
                              {createConfiguration.isPending ||
                                updateConfiguration.isPending
                                ? 'Saving...'
                                : 'Save Configuration'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Other General Settings 
          <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your general application preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">General settings will be implemented here.</p>
            </CardContent>
          </Card>*/}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your profile information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Profile settings will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card style={{ backgroundColor: 'var(--seller-card-bg)', borderColor: 'var(--seller-card-border)' }}>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
