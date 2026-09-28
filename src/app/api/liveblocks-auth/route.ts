import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { getDisplayName } from "@/lib/user-display";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: Request) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = await getToken({ template: "convex" });
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Authenticate the Convex client with the user's JWT so that
  // getById runs the same canAccessDocument check Convex always applies.
  convex.setAuth(token);

  const { room } = await req.json();

  let document;
  try {
    document = await convex.query(api.document.getById, {
      id: room as Id<"document">,
    });
  } catch {
    // Invalid document ID format etc.
    return new Response("Unauthorized", { status: 401 });
  }

  // getById already enforces owner OR same-org access — if it returns null
  // the user simply doesn't have permission (no need to re-check here).
  if (!document) {
    return new Response("Unauthorized", { status: 401 });
  }

  // User is authorised — create a Liveblocks session with their real identity.
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: getDisplayName({
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        primaryEmailAddress: user.primaryEmailAddress,
      }),
      avatar: user.imageUrl,
    },
  });

  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
