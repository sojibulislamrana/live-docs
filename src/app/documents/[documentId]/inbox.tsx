"use client";

import { BellIcon, CheckCheckIcon } from "lucide-react";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
  useMarkAllInboxNotificationsAsRead,
  useMarkInboxNotificationAsRead,
} from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ─── Public wrapper — safe to render outside a Liveblocks room ───────────────

export const Inbox = () => (
  <ClientSideSuspense fallback={<InboxSkeleton />}>
    <InboxMenu />
  </ClientSideSuspense>
);

// ─── Skeleton shown while loading ────────────────────────────────────────────

const InboxSkeleton = () => (
  <Button variant="ghost" size="icon" className="relative" disabled>
    <BellIcon className="size-5 text-neutral-500" />
  </Button>
);

// ─── Main menu ───────────────────────────────────────────────────────────────

const InboxMenu = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { count: unreadCount } = useUnreadInboxNotificationsCount();
  const markAllAsRead = useMarkAllInboxNotificationsAsRead();
  const markAsRead = useMarkInboxNotificationAsRead();

  const hasUnread = unreadCount > 0;

  return (
    <DropdownMenu>
      {/* ── Bell trigger ── */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-neutral-100"
          aria-label={`Notifications${hasUnread ? ` (${unreadCount} unread)` : ""}`}
        >
          <BellIcon className="size-5 text-neutral-600" />

          {/* Unread badge */}
          {hasUnread && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-blue-500 text-[10px] font-semibold text-white flex items-center justify-center px-1 leading-none shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      {/* ── Dropdown panel ── */}
      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 rounded-xl shadow-xl border border-neutral-200 bg-white overflow-hidden"
        // Prevent the dropdown from stealing focus from the editor
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-800">
            Notifications
          </h3>

          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1.5"
              onClick={() => markAllAsRead()}
            >
              <CheckCheckIcon className="size-3.5" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notification list */}
        {inboxNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center">
            <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <BellIcon className="size-5 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-600">
              You&apos;re all caught up
            </p>
            <p className="text-xs text-neutral-400">
              New comments and mentions will appear here.
            </p>
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto">
            <InboxNotificationList>
              {inboxNotifications.map((notification) => (
                <InboxNotification
                  key={notification.id}
                  inboxNotification={notification}
                  // Mark as read when clicked
                  onClick={() => {
                    if (!notification.readAt) {
                      markAsRead(notification.id);
                    }
                  }}
                  className={[
                    "px-4 py-3 cursor-pointer transition-colors hover:bg-neutral-50 border-b border-neutral-100 last:border-0",
                    !notification.readAt
                      ? "bg-blue-50/60 hover:bg-blue-50"
                      : "",
                  ].join(" ")}
                  href={`/documents/${notification.roomId}`}
                />
              ))}
            </InboxNotificationList>
          </div>
        )}

        {/* Footer — only shown when there are notifications */}
        {inboxNotifications.length > 0 && (
          <>
            <Separator />
            <div className="px-4 py-2.5 text-center">
              <p className="text-xs text-neutral-400">
                Showing last {inboxNotifications.length} notification
                {inboxNotifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
