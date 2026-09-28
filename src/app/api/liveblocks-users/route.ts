import { auth, clerkClient } from "@clerk/nextjs/server";
import { getDisplayName } from "@/lib/user-display";
import { colorForUser } from "@/lib/user-color";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { userIds } = (await req.json()) as { userIds?: string[] };
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return Response.json([]);
  }

  const client = await clerkClient();
  const users = await Promise.all(
    userIds.map(async (id) => {
      try {
        const user = await client.users.getUser(id);
        return {
          name:   getDisplayName(user),
          avatar: user.imageUrl,
          color:  colorForUser(id),
        };
      } catch {
        return {
          name:   "Anonymous",
          avatar: "",
          color:  colorForUser(id),
        };
      }
    }),
  );

  return Response.json(users);
}
