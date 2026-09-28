import { auth, clerkClient } from "@clerk/nextjs/server";
import { getDisplayName } from "@/lib/user-display";

export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { text } = (await req.json()) as { text?: string };
  const clerk = await clerkClient();

  const orgId =
    (sessionClaims as { org_id?: string } | null)?.org_id ?? undefined;

  let candidates: { id: string; name: string }[] = [];

  if (orgId) {
    // Fetch all members of the current organization.
    const memberships = await clerk.organizations.getOrganizationMembershipList(
      { organizationId: orgId },
    );
    candidates = memberships.data.map((m) => ({
      id: m.publicUserData?.userId ?? "",
      name: getDisplayName({
        fullName:
          m.publicUserData?.firstName && m.publicUserData?.lastName
            ? `${m.publicUserData.firstName} ${m.publicUserData.lastName}`
            : null,
        firstName: m.publicUserData?.firstName ?? null,
        lastName: m.publicUserData?.lastName ?? null,
        username: m.publicUserData?.identifier ?? null,
      }),
    }));
  } else {
    // Personal mode — only the current user can be mentioned.
    const user = await clerk.users.getUser(userId);
    candidates = [{ id: userId, name: getDisplayName(user) }];
  }

  // Filter by the typed text, if any.
  const lowerText = text?.toLowerCase().trim() ?? "";
  const filtered = lowerText
    ? candidates.filter((c) => c.name.toLowerCase().includes(lowerText))
    : candidates;

  return Response.json(filtered);
}
