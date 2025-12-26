import { getDataSource } from '@/src/lib/db'
import { User, Role } from '@/src/entities/User'
import { Etudiant } from '@/src/entities/Etudiant'
import { Promotion } from '@/src/entities/Promotion'
import { generateTemporaryPassword, hashPassword } from '@/src/lib/password'
import { CreateEtudiantInput } from '@/src/schemas/etudiant.schema'

export async function createEtudiant(input: CreateEtudiantInput) {
  const db = await getDataSource()

  const userRepo = db.getRepository(User)
  const etudiantRepo = db.getRepository(Etudiant)
  const promotionRepo = db.getRepository(Promotion)

  // 1️⃣ Vérifier promotion
  const promotion = await promotionRepo.findOne({
    where: { id: input.promotionId },
  })

  if (!promotion) {
    throw new Error('PROMOTION_NOT_FOUND')
  }

  // 2️⃣ Vérifier email
  const exists = await userRepo.findOne({
    where: { email: input.email },
  })

  if (exists) {
    throw new Error('USER_ALREADY_EXISTS')
  }

  // 3️⃣ Mot de passe temporaire
  const tempPassword = generateTemporaryPassword()
  const hashedPassword = await hashPassword(tempPassword)

  // 4️⃣ Créer User
  const user = userRepo.create({
    nom: input.nom,
    prenom: input.prenom,
    email: input.email,
    password: hashedPassword,
    role: Role.ETUDIANT,
    motDePasseTemporaire: true,
  } as Partial<User>)

  await userRepo.save(user)

  // 5️⃣ Créer Etudiant
  const etudiant = etudiantRepo.create({
    user,
    promotion,
  } as Partial<Etudiant>)

  await etudiantRepo.save(etudiant)

  return {
    id: etudiant.id,
    user: {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      motDePasseTemporaire: true,
      temporaryPassword: tempPassword,
    },
    promotion: {
      id: promotion.id,
      code: promotion.code,
      libelle: promotion.libelle,
      annee: promotion.annee,
    },
  }
}
