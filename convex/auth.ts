import { UserIdentity } from "convex/server";
import { Doc } from "./_generated/dataModel";

// Clerk can encode the active organization ID in several JWT claim shapes
// depending on the JWT template version and whether the user has an active org.
type OrganizationClaims = {
  // Older Clerk templates
  organization_id?: unknown;
  org_id?: unknown;
  // Newer Clerk templates nest it under "o"
  o?: { id?: unknown } | unknown;
  // Clerk also sometimes adds org_slug and org_role alongside org_id
  org_slug?: unknown;
  org_role?: unknown;
};

export function getOrganizationId(identity: UserIdentity): string | undefined {
  const claims = identity as UserIdentity & OrganizationClaims;

  // Try each known claim location in priority order.
  const candidates: unknown[] = [
    claims.org_id,
    claims.organization_id,
    // Nested "o.id" shape used in newer Clerk JWT templates
    claims.o && typeof claims.o === "object" && !Array.isArray(claims.o)
      ? (claims.o as Record<string, unknown>).id
      : undefined,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return undefined;
}

export function canAccessDocument(
  identity: UserIdentity,
  document: Doc<"document">,
) {
  // Owner always has access.
  if (document.ownerId === identity.subject) {
    return true;
  }

  const organizationId = getOrganizationId(identity);

  // Org member has access when the document belongs to the same org.
  return Boolean(
    document.organizationId &&
      organizationId &&
      document.organizationId === organizationId,
  );
}
