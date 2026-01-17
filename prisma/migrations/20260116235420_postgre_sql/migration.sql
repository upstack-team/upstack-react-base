-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EspacePedagogique" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "matiere" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "formateurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EspacePedagogique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscription" (
    "id" TEXT NOT NULL,
    "espacePedagogiqueId" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Travail" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dateLimite" TIMESTAMP(3) NOT NULL,
    "espacePedagogiqueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Travail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignation" (
    "id" TEXT NOT NULL,
    "travailId" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "note" DOUBLE PRECISION,
    "soumisLe" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inscription_espacePedagogiqueId_etudiantId_key" ON "Inscription"("espacePedagogiqueId", "etudiantId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignation_travailId_etudiantId_key" ON "Assignation"("travailId", "etudiantId");

-- AddForeignKey
ALTER TABLE "EspacePedagogique" ADD CONSTRAINT "EspacePedagogique_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspacePedagogique" ADD CONSTRAINT "EspacePedagogique_formateurId_fkey" FOREIGN KEY ("formateurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_espacePedagogiqueId_fkey" FOREIGN KEY ("espacePedagogiqueId") REFERENCES "EspacePedagogique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Travail" ADD CONSTRAINT "Travail_espacePedagogiqueId_fkey" FOREIGN KEY ("espacePedagogiqueId") REFERENCES "EspacePedagogique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignation" ADD CONSTRAINT "Assignation_travailId_fkey" FOREIGN KEY ("travailId") REFERENCES "Travail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignation" ADD CONSTRAINT "Assignation_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
