// Role mappings for users
// This is useful for personal Microsoft accounts where app roles are not available
// For production, consider storing this in a database

export const roleMappings: Record<string, string[]> = {
  // Map email addresses to roles - only for explicit overrides if needed
  // Generally empty - relies on automatic token detection
};

// Function to get roles for a user
export function getRolesForUser(email: string | undefined | null): string[] {
  if (!email) return [];
  
  // Check if user has mapped roles
  const mappedRoles = roleMappings[email.toLowerCase()];
  if (mappedRoles) {
    return mappedRoles;
  }
  
  // For personal accounts, return empty array (will be handled in UI)
  return [];
}

// Function to check if this is likely a personal Microsoft account
// Only checks well-known Microsoft personal domains - no hardcoded emails
export function isPersonalAccount(email: string | undefined | null): boolean {
  if (!email) return false;
  
  // Check for known personal Microsoft domains only
  const personalDomains = ['live.com', 'outlook.com', 'hotmail.com', 'msn.com', 'passport.com'];
  const domain = email.toLowerCase().split('@')[1];
  return personalDomains.includes(domain);
}

// Helper to check if user has a specific role
export function userHasRole(email: string | undefined | null, role: string): boolean {
  const roles = getRolesForUser(email);
  return roles.includes(role);
}