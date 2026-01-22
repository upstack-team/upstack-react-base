# Copilot Instructions - User Story 6.1 (Assignation de Travaux)

## 🎯 Project Overview

**SETICE Assignation** is a Next.js 14 application (TypeScript) for managing work assignments in an educational platform. This specific implementation focuses on **User Story 6.1**: assigning individual work items to students with comprehensive business rule validation.

### Tech Stack
- **Frontend**: React 18 + Next.js 14 with App Router
- **Backend**: Next.js API Routes + NextAuth authentication
- **Database**: SQLite via Prisma ORM (v5)
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS 4.1

---

## 🏗️ Architecture & Data Flow

### Layered Architecture Pattern
```
UI Layer (React/TSX)
    ↓ HTTP requests
API Layer (/app/api/v1/*)
    ↓ Service calls
Service Layer (/src/services)
    ↓ Database queries
Data Layer (Prisma/SQLite)
```

### Critical Data Models (in `prisma/schema.prisma`)
- **User**: Base entity with email, nom, prenom, role (FORMATEUR|ETUDIANT|ADMIN)
- **Formateur**: Teacher, manages EspacePedagogique and Travail
- **Etudiant**: Student, has Assignation records and Inscription in learning spaces
- **EspacePedagogique**: Learning space managed by Formateur
- **Travail**: Work item with type (INDIVIDUEL|COLLECTIF) and statut (OUVERT|FERME|ARCHIVÉ)
- **Assignation**: Links Etudiant to Travail with statut (ASSIGNE|LIVRE|EVALUE)

### Key Business Rules (implemented in `AssignationService`)
1. **Work type**: Only INDIVIDUEL (individual) work can be assigned; COLLECTIF (group) work cannot
2. **Ownership**: Formateur must be responsible for the Travail (formateurId match)
3. **Enrollment**: Etudiant must be inscribed in the EspacePedagogique where the work is assigned
4. **No duplicates**: Cannot assign same work twice to same student (409 Conflict)
5. **Work status**: Cannot assign FERME or ARCHIVÉ work

---

## 📁 Key Files & Responsibilities

### Frontend
- **`app/dashboard/formateur/assignations/page.tsx`**: Assignment UI, handles form submission, displays work/student lists

### API Routes
- **`app/api/v1/assignations/route.ts`**: POST (create assignment), GET (retrieve assignments with role-based filtering)
- **`app/api/v1/travaux/route.ts`**: GET work items
- **`app/api/v1/etudiants/route.ts`**: GET students

### Business Logic
- **`src/services/assignation.service.ts`**: Core validation logic; called by API routes
  - `assignerTravail()`: Main method executing all 5 business rules in sequence
  - Returns `AssignerTravailResult` with success flag, data, or error details
- **`src/schemas/assignation.schema.ts`**: Zod schemas for request validation
- **`src/types/assignation.types.ts`**: TypeScript type definitions for complex entities

### Database
- **`lib/prisma.ts`**: Prisma client singleton
- **`prisma/schema.prisma`**: Main schema definition
- **`prisma/migrations/add_assignation_system.sql`**: SQL migration for assignation table

---

## 🔧 Developer Workflows

### Common Commands
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build           # Build for production
npm run lint            # ESLint check
npx prisma db push     # Sync schema to database
npx prisma migrate dev --name <name>  # Create migration
npx prisma studio     # Open Prisma visual DB editor
npm run seed           # Seed test data (uses tsx scripts/seed-test-data.ts)
```

### Testing API Endpoints
Use `test-assignations.http` file in VS Code REST Client extension:
```http
POST /api/v1/assignations
Content-Type: application/json

{
  "travailId": "uuid-here",
  "etudiantId": "uuid-here"
}
```

---

## 🎨 Project-Specific Patterns

### Service Layer Pattern
All business logic goes in `src/services/*.service.ts`, not in API routes. Services return consistent Result objects:
```typescript
interface OperationResult {
  success: boolean
  data?: T
  error?: string
  statusCode?: number
}
```

### Zod Validation
Always validate request payloads using Zod schemas before passing to services:
```typescript
const validation = mySchema.safeParse(body)
if (!validation.success) {
  return NextResponse.json({ error: 'Invalid', details: validation.error.errors }, { status: 400 })
}
```

### Prisma Relations & Includes
Use `.include()` to eagerly load related records, especially for returning complete entities:
```typescript
const assignation = await prisma.assignation.findUnique({
  where: { id },
  include: { travail: { include: { espacePedagogique: true } }, etudiant: { include: { user: true } } }
})
```

### Error Status Codes
- **400**: Invalid input, business rule violation (non-INDIVIDUEL, already assigned, etc.)
- **401**: Unauthenticated
- **403**: Authorized user but forbidden action (wrong formateur)
- **404**: Resource not found
- **409**: Conflict (duplicate assignment)

---

## 🔐 Authentication & Authorization

- **Auth provider**: NextAuth (configured in `lib/auth.ts`)
- **User roles**: Extracted from `session.user.role`
- **Formateur access**: Can only assign work from their own pedagogical spaces
- **Etudiant access**: Can only view their own assignments
- **No client-side auth checks**: Always validate on backend (in service layer)

---

## 📦 Dependencies to Know

- **@prisma/client**: ORM client (auto-generated from schema)
- **zod**: Runtime validation (replaces runtime checks)
- **next-auth**: Session & authentication
- **tailwindcss**: Utility CSS framework
- **tsx**: TypeScript executor for seed scripts

---

## ⚠️ Common Pitfalls

1. **Schema changes**: After editing `prisma/schema.prisma`, run `npx prisma db push` or create a migration
2. **Missing includes**: Queries without `.include()` return null for relations—verify with `.include()` when needed
3. **API validation**: Always use Zod schemas; don't assume frontend validation
4. **Error handling**: Return explicit HTTP status codes (not just 200 + error in body)
5. **Service layer**: Put business logic in services, not routes; routes should be thin adapters

---

## 📚 Reference Files

- **Architecture overview**: `ARCHITECTURE-US6.1.md`
- **Implementation guide**: `README-IMPLEMENTATION-US6.1.md`
- **Testing guide**: `GUIDE-TESTS.md`
- **Setup instructions**: `START-HERE.md`
- **Project structure**: `STRUCTURE-PROJET-US6.1.md`
