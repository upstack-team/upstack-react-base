import { UserRole } from '../types/roles'


export function requireRole(role: UserRole, userRole?: UserRole) {
if (userRole !== role) {
throw new Error('FORBIDDEN')
}
}