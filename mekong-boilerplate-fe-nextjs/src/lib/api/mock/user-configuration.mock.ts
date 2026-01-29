'use client';

import {
  UserConfiguration,
  CreateUserConfigurationDto,
  UpdateUserConfigurationDto,
  ConfigType,
  ConfigKey,
} from '@/types/user-configuration';

// Mock data storage
// Mock data storage
const mockUserConfigurations: UserConfiguration[] = [
  {
    id: 1,
    userId: 1,
    configType: ConfigType.AI_ASSISTANT,
    configKey: ConfigKey.GEMINI,
    configData: {
      api_key: 'mock-gemini-api-key',
    },
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 2,
    userId: 1,
    configType: ConfigType.PROVIDER,
    configKey: ConfigKey.GEARMENT,
    configData: {
      api_key: 'mock-gearment-api-key',
      api_secret: 'mock-gearment-api-secret',
    },
    isActive: false,
    createdAt: new Date('2024-01-02T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-02T00:00:00Z').toISOString(),
  },
];

let nextId = 3;

/**
 * Simulate API delay
 */
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock: Get all user configurations
 */
export const getMockUserConfigurations = async (): Promise<UserConfiguration[]> => {
  await delay();
  return [...mockUserConfigurations];
};

/**
 * Mock: Create a new user configuration
 */
export const createMockUserConfiguration = async (
  data: CreateUserConfigurationDto
): Promise<UserConfiguration> => {
  await delay();

  const now = new Date().toISOString();
  const newConfig: UserConfiguration = {
    id: nextId++,
    userId: 1,
    configType: data.configType,
    configKey: data.configKey,
    configData: data.configData,
    isActive: data.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };

  mockUserConfigurations.push(newConfig);
  return newConfig;
};

/**
 * Mock: Update a user configuration
 */
export const updateMockUserConfiguration = async (
  id: number,
  data: UpdateUserConfigurationDto
): Promise<UserConfiguration> => {
  await delay();

  const configIndex = mockUserConfigurations.findIndex(c => c.id === id);
  if (configIndex === -1) {
    throw new Error(`Configuration with ID ${id} not found`);
  }

  const updatedConfig = {
    ...mockUserConfigurations[configIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (data.configData) {
    updatedConfig.configData = {
      ...mockUserConfigurations[configIndex].configData,
      ...data.configData,
    };
  }

  mockUserConfigurations[configIndex] = updatedConfig;
  return updatedConfig;
};

/**
 * Mock: Delete a user configuration
 */
export const deleteMockUserConfiguration = async (id: number): Promise<void> => {
  await delay();

  const index = mockUserConfigurations.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Configuration with ID ${id} not found`);
  }

  mockUserConfigurations.splice(index, 1);
};

/**
 * Mock: Toggle configuration active status
 */
export const toggleMockUserConfiguration = async (id: number): Promise<UserConfiguration> => {
  await delay();

  const config = mockUserConfigurations.find(c => c.id === id);
  if (!config) {
    throw new Error(`Configuration with ID ${id} not found`);
  }

  config.isActive = !config.isActive;
  config.updatedAt = new Date().toISOString();

  return config;
};
