import { IsEnum, IsNotEmpty, IsObject, IsBoolean, IsOptional } from 'class-validator';
import { ConfigType } from '../enums/config-type.enum';
import { ConfigKey } from '../enums/config-key.enum';

export class CreateUserConfigurationDto {
    @IsEnum(ConfigType)
    @IsNotEmpty()
    configType: ConfigType;

    @IsEnum(ConfigKey)
    @IsNotEmpty()
    configKey: ConfigKey;

    @IsObject()
    @IsNotEmpty()
    configData: any;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
