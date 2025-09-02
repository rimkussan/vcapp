import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth';

// Server-side helper to get current user session
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as any;
}

// Server-side helper to check if user has any roles
export async function userHasRoles(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!(user?.roles && user.roles.length > 0);
}

// Server-side helper to check if user has specific role
export async function userHasRole(requiredRole: string): Promise<boolean> {
  const user = await getCurrentUser();
  return !!(user?.roles && user.roles.includes(requiredRole));
}

// Server-side helper to check if user has any of the specified roles
export async function userHasAnyRole(requiredRoles: string[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user?.roles || user.roles.length === 0) return false;
  return requiredRoles.some(role => user.roles.includes(role));
}

// Check if user is using personal account (no roles available)
export async function isPersonalAccount(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isPersonalAccount === true;
}