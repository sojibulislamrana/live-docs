export function getDisplayName(user: {
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  primaryEmailAddress?: { emailAddress?: string | null } | null;
}) {
  const fullName = user.fullName?.trim();
  if (fullName) return fullName;

  const combined = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (combined) return combined;

  if (user.username?.trim()) return user.username.trim();

  const email = user.primaryEmailAddress?.emailAddress?.trim();
  if (email) return email.split("@")[0];

  return "Anonymous";
}
