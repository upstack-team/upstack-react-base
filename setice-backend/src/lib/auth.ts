import { AppDataSource } from '@/src/lib/data-source'
import { User } from '@/src/entities/User'

export async function requireAuth(req: Request) {
  const userId = req.headers.get('x-user-id')

  if (!userId) {
    throw new Error('UNAUTHORIZED')
  }

  const userRepo = AppDataSource.getRepository(User)

  const user = await userRepo.findOne({
    where: { id: userId },
  })

  if (!user) {
    throw new Error('UNAUTHORIZED')
  }

  return user
}
