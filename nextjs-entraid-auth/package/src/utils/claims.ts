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

export class ClaimsMapper {
  private claimMappings: ClaimMapping[];
  private roleMapping: RoleMapping;

  constructor(
    claimMappings: ClaimMapping[] = [],
    roleMapping: RoleMapping = { claimName: 'roles' }
  ) {
    this.claimMappings = claimMappings;
    this.roleMapping = roleMapping;
  }

  mapUserFromTokens(idToken: string, userInfo?: any): EntraIdUser {
    let decodedToken: any;
    
    try {
      decodedToken = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
    } catch (error) {
      throw new Error('Invalid ID token format');
    }

    const combinedClaims = { ...decodedToken, ...userInfo };

    const baseUser: EntraIdUser = {
      id: combinedClaims.sub || combinedClaims.oid || '',
      email: combinedClaims.email || combinedClaims.preferred_username || '',
      name: combinedClaims.name || combinedClaims.given_name + ' ' + combinedClaims.family_name || '',
      preferredUsername: combinedClaims.preferred_username,
      tenantId: combinedClaims.tid,
      claims: combinedClaims,
      roles: []
    };

    const customClaims: Record<string, any> = {};
    for (const mapping of this.claimMappings) {
      let value = this.getNestedValue(combinedClaims, mapping.source);
      
      if (value !== undefined) {
        if (mapping.transform) {
          value = mapping.transform(value);
        }
        customClaims[mapping.target] = value;
      }
    }

    baseUser.claims = { ...baseUser.claims, ...customClaims };

    baseUser.roles = this.extractRoles(combinedClaims);

    return baseUser;
  }

  private extractRoles(claims: any): string[] {
    const roles: string[] = [];

    if (this.roleMapping.staticRoles) {
      roles.push(...this.roleMapping.staticRoles);
    }

    const roleClaim = this.getNestedValue(claims, this.roleMapping.claimName);
    
    if (roleClaim) {
      const roleValues = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
      
      for (const roleValue of roleValues) {
        let mappedRole = roleValue;
        
        if (this.roleMapping.roleMap && this.roleMapping.roleMap[roleValue]) {
          mappedRole = this.roleMapping.roleMap[roleValue];
        }
        
        if (this.roleMapping.rolePrefix) {
          mappedRole = `${this.roleMapping.rolePrefix}${mappedRole}`;
        }
        
        roles.push(mappedRole);
      }
    }

    const appRoles = this.getNestedValue(claims, 'app_roles');
    if (appRoles && Array.isArray(appRoles)) {
      roles.push(...appRoles);
    }

    const groups = this.getNestedValue(claims, 'groups');
    if (groups && Array.isArray(groups)) {
      roles.push(...groups.map(group => `group:${group}`));
    }

    return [...new Set(roles)];
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  addClaimMapping(mapping: ClaimMapping): void {
    this.claimMappings.push(mapping);
  }

  setRoleMapping(roleMapping: RoleMapping): void {
    this.roleMapping = roleMapping;
  }
}

export const defaultClaimMappings: ClaimMapping[] = [
  {
    source: 'given_name',
    target: 'firstName'
  },
  {
    source: 'family_name',
    target: 'lastName'
  },
  {
    source: 'upn',
    target: 'userPrincipalName'
  },
  {
    source: 'unique_name',
    target: 'uniqueName'
  },
  {
    source: 'jobTitle',
    target: 'jobTitle'
  },
  {
    source: 'department',
    target: 'department'
  }
];