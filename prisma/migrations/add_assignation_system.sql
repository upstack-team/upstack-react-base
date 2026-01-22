-- Migration pour ajouter le système d'assignation de travaux
-- À exécuter après avoir modifié le schema.prisma

-- Création des enums
CREATE TYPE "TravailType" AS ENUM ('INDIVIDUEL', 'COLLECTIF');
CREATE TYPE "TravailStatut" AS ENUM ('NON_ASSIGNE', 'ASSIGNE', 'TERMINE');
CREATE TYPE "AssignationStatut" AS ENUM ('ASSIGNE', 'LIVRE', 'EVALUE');

-- Création de la table travaux
CREATE TABLE "travaux" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "type" "TravailType" NOT NULL DEFAULT 'INDIVIDUEL',
    "date_limite" TIMESTAMP(3) NOT NULL,
    "bareme" INTEGER NOT NULL DEFAULT 20,
    "statut" "TravailStatut" NOT NULL DEFAULT 'NON_ASSIGNE',
    "espace_pedagogique_id" TEXT NOT NULL,
    "formateur_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travaux_pkey" PRIMARY KEY ("id")
);

-- Création de la table assignations
CREATE TABLE "assignations" (
    "id" TEXT NOT NULL,
    "travail_id" TEXT NOT NULL,
    "etudiant_id" TEXT NOT NULL,
    "statut" "AssignationStatut" NOT NULL DEFAULT 'ASSIGNE',
    "date_assignation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_livraison" TIMESTAMP(3),
    "note" DOUBLE PRECISION,

    CONSTRAINT "assignations_pkey" PRIMARY KEY ("id")
);

-- Création de la table inscriptions (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS "inscriptions" (
    "etudiant_id" TEXT NOT NULL,
    "espace_pedagogique_id" TEXT NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("etudiant_id","espace_pedagogique_id")
);

-- Ajout des contraintes uniques
CREATE UNIQUE INDEX "assignations_travail_id_etudiant_id_key" ON "assignations"("travail_id", "etudiant_id");

-- Ajout des clés étrangères
ALTER TABLE "travaux" ADD CONSTRAINT "travaux_espace_pedagogique_id_fkey" FOREIGN KEY ("espace_pedagogique_id") REFERENCES "espaces_pedagogiques"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "travaux" ADD CONSTRAINT "travaux_formateur_id_fkey" FOREIGN KEY ("formateur_id") REFERENCES "formateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "assignations" ADD CONSTRAINT "assignations_travail_id_fkey" FOREIGN KEY ("travail_id") REFERENCES "travaux"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "assignations" ADD CONSTRAINT "assignations_etudiant_id_fkey" FOREIGN KEY ("etudiant_id") REFERENCES "etudiants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_etudiant_id_fkey" FOREIGN KEY ("etudiant_id") REFERENCES "etudiants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_espace_pedagogique_id_fkey" FOREIGN KEY ("espace_pedagogique_id") REFERENCES "espaces_pedagogiques"("id") ON DELETE CASCADE ON UPDATE CASCADE;