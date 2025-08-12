"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultClaimMappings = exports.ClaimsMapper = void 0;
class ClaimsMapper {
    constructor(claimMappings = [], roleMapping = { claimName: 'roles' }) {
        this.claimMappings = claimMappings;
        this.roleMapping = roleMapping;
    }
    mapUserFromTokens(idToken, userInfo) {
        let decodedToken;
        try {
            decodedToken = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
        }
        catch (error) {
            throw new Error('Invalid ID token format');
        }
        const combinedClaims = { ...decodedToken, ...userInfo };
        const baseUser = {
            id: combinedClaims.sub || combinedClaims.oid || '',
            email: combinedClaims.email || combinedClaims.preferred_username || '',
            name: combinedClaims.name || combinedClaims.given_name + ' ' + combinedClaims.family_name || '',
            preferredUsername: combinedClaims.preferred_username,
            tenantId: combinedClaims.tid,
            claims: combinedClaims,
            roles: []
        };
        const customClaims = {};
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
    extractRoles(claims) {
        const roles = [];
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
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }
    addClaimMapping(mapping) {
        this.claimMappings.push(mapping);
    }
    setRoleMapping(roleMapping) {
        this.roleMapping = roleMapping;
    }
}
exports.ClaimsMapper = ClaimsMapper;
exports.defaultClaimMappings = [
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
