"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { getDisplayName } from "@/lib/user-display";

export async function getUsers() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return [];

  const clerk = await clerkClient();
  const orgId =
    (sessionClaims as { org_id?: string } | null)?.org_id ?? undefined;

  if (orgId) {
    // Organization context — return every member of the active org.
    const memberships =
      await clerk.organizations.getOrganizationMembershipList({
        organizationId: orgId,
      });

    return memberships.data
      .filter((m) => m.publicUserData?.userId)
      .map((m) => ({
        id: m.publicUserData!.userId!,
        name: getDisplayName({
          fullName:
            m.publicUserData?.firstName && m.publicUserData?.lastName
              ? `${m.publicUserData.firstName} ${m.publicUserData.lastName}`
              : null,
          firstName: m.publicUserData?.firstName ?? null,
          lastName: m.publicUserData?.lastName ?? null,
          username: m.publicUserData?.identifier ?? null,
        }),
        avatar: m.publicUserData?.imageUrl ?? "",
      }));
  }

  // Personal mode — only the signed-in user.
  const user = await clerk.users.getUser(userId);
  return [
    {
      id: userId,
      name: getDisplayName(user),
      avatar: user.imageUrl,
    },
  ];
}
