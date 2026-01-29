/**
 * Enum representing configuration types in the system
 */
export enum ConfigType {
    PROVIDER = 'Provider',
    NOTIFICATION = 'Notification',
    CHROME = 'Chrome',
    AI_ASSISTANT = 'AI_Assistant',
}

/**
 * Enum representing configuration keys grouped by type
 */
export enum ConfigKey {
    // Provider keys
    GEARMENT = 'Gearment',
    CUSTOMCAT = 'Customcat',
    
    // AI Assistant keys
    GEMINI = 'Gemini',
}

/**
 * Interface for Gearment configuration data
 */
export interface GearmentConfigData {
    api_key: string;
    api_secret: string;
}

/**
 * Interface for Gemini configuration data
 */
export interface GeminiConfigData {
    api_key: string;
}

/**
 * Interface for user configuration
 */
export interface UserConfiguration {
    id?: number;
    userId?: number;
    configType: ConfigType;
    configKey: ConfigKey;
    configData: GearmentConfigData | GeminiConfigData | any;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * DTO for creating user configuration
 */
export interface CreateUserConfigurationDto {
    configType: ConfigType;
    configKey: ConfigKey;
    configData: any;
    isActive?: boolean;
}

/**
 * DTO for updating user configuration
 */
export interface UpdateUserConfigurationDto {
    configType?: ConfigType;
    configKey?: ConfigKey;
    configData?: any;
    isActive?: boolean;
}
