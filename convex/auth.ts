import { UserIdentity } from "convex/server";
import { Doc } from "./_generated/dataModel";

type OrganizationClaims = {
  organization_id?: unknown;
  org_id?: unknown;
  o?: { id?: unknown };
};

export function getOrganizationId(identity: UserIdentity): string | undefined {
  const claims = identity as UserIdentity & OrganizationClaims;
  const nestedOrgId =
    claims.o && typeof claims.o === "object" ? claims.o.id : undefined;
  const value = claims.organization_id ?? claims.org_id ?? nestedOrgId;

  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function canAccessDocument(
  identity: UserIdentity,
  document: Doc<"document">,
) {
  if (document.ownerId === identity.subject) {
    return true;
  }

  const organizationId = getOrganizationId(identity);

  return Boolean(
    document.organizationId &&
      organizationId &&
      document.organizationId === organizationId,
  );
}
