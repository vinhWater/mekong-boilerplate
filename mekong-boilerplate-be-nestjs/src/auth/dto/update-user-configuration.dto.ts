import { PartialType } from '@nestjs/mapped-types';
import { CreateUserConfigurationDto } from './create-user-configuration.dto';

export class UpdateUserConfigurationDto extends PartialType(CreateUserConfigurationDto) { }
