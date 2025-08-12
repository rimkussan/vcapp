import { EntraIdUser } from '../types';
export interface ClaimMapping {
    source: string;
    target: string;
    transform?: (value: any) => any;
}
export interface RoleMapping {
    claimName: string;
    rolePrefix?: string;
    staticRoles?: string[];
    roleMap?: Record<string, string>;
}
export declare class ClaimsMapper {
    private claimMappings;
    private roleMapping;
    constructor(claimMappings?: ClaimMapping[], roleMapping?: RoleMapping);
    mapUserFromTokens(idToken: string, userInfo?: any): EntraIdUser;
    private extractRoles;
    private getNestedValue;
    addClaimMapping(mapping: ClaimMapping): void;
    setRoleMapping(roleMapping: RoleMapping): void;
}
export declare const defaultClaimMappings: ClaimMapping[];
