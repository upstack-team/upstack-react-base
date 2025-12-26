import bcrypt from 'bcrypt'


export function generateTemporaryPassword(): string {
return Math.random().toString(36).slice(-10)
}


export async function hashPassword(password: string): Promise<string> {
return bcrypt.hash(password, 10)
}