import { getDataSource } from '@/src/lib/db'
import { User, Role } from '@/src/entities/User'
import { Formateur } from '@/src/entities/Formateur'
import { generateTemporaryPassword, hashPassword } from '@/src/lib/password'

export interface CreateFormateurInput {
  nom: string
  prenom: string
  email: string
}

export async function createFormateur(input: CreateFormateurInput) {
  const db = await getDataSource()

  const userRepo = db.getRepository(User)
  const formateurRepo = db.getRepository(Formateur)

  // 1️⃣ Vérifier si l’email existe déjà
  const existingUser = await userRepo.findOne({
    where: { email: input.email },
  })

  if (existingUser) {
    throw new Error('USER_ALREADY_EXISTS')
  }

  // 2️⃣ Générer mot de passe temporaire
  const tempPassword = generateTemporaryPassword()
  const hashedPassword = await hashPassword(tempPassword)

  // 3️⃣ Créer le User
  const user = userRepo.create({
    nom: input.nom,
    prenom: input.prenom,
    email: input.email,
    password: hashedPassword,
    role: Role.FORMATEUR,
    motDePasseTemporaire: true,
  } as Partial<User>)

  await userRepo.save(user)

  // 4️⃣ Créer le Formateur lié au User
  const formateur = formateurRepo.create({
    user,
  } as Partial<Formateur>)

  await formateurRepo.save(formateur)

  // 5️⃣ Retour utile (sans password)
  return {
    id: formateur.id,
    user: {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      motDePasseTemporaire: true,
      temporaryPassword: tempPassword, // à afficher UNE SEULE FOIS
    },
  }
}