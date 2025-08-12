import { EntraIdConfig } from '../types';
export declare function validateConfig(config: EntraIdConfig): void;
export declare function getDefaultConfig(): Partial<EntraIdConfig>;
export declare function mergeConfig(userConfig: EntraIdConfig): EntraIdConfig;
