"use client";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

import { SocketContext } from "@/contexts/socketio";
import { Users, Users2, Hash, Settings, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

import { useChatScroll } from "./hooks/use-chat-scroll";
import { useTyping } from "./hooks/use-typing";
import { useSounds } from "./hooks/use-sounds";
import { ChatMessageList } from "./components/chat-message-list";
import { ChatInput } from "./components/chat-input";
import { UserList } from "./components/user-list";
import { EditProfileModal } from "./components/edit-profile-modal";
import { THEME } from "./constants";
import { getAvatarUrl } from "@/lib/avatar";

const OnlineUsers = () => {
  const { socket, users: _users, msgs } = useContext(SocketContext);
  const users = Array.from(_users.values());
  const [showUserList, setShowUserList] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Name gate state
  const [hasJoined, setHasJoined] = useState(() => typeof window !== 'undefined' && !!localStorage.getItem("username"));
  const [joinName, setJoinName] = useState("");

  const currentUser = users.find(u => u.socketId === socket?.id);
  const { playSendSound, playReceiveSound } = useSounds();
  const prevMsgsLength = useRef(msgs.length);

  // Auto-restore name on mount if previously set
  useEffect(() => {
    const savedName = localStorage.getItem("username");
    const savedAvatar = localStorage.getItem("avatar");
    const savedColor = localStorage.getItem("color");
    if (savedName && socket) {
      socket.emit("update-user", {
        username: savedName,
        avatar: savedAvatar || "1",
        color: savedColor || undefined,
      });
    }
  }, [socket]);

  useEffect(() => {
    if (msgs.length > prevMsgsLength.current) {
      const isSmallBatch = msgs.length - prevMsgsLength.current <= 2;
      const lastMsg = msgs[msgs.length - 1];
      let isRecent = true;
      if (lastMsg?.createdAt) {
        const msgTime = new Date(lastMsg.createdAt).getTime();
        const now = Date.now();
        // If message is older than 10 seconds, assume it's history
        if (now - msgTime > 10000) isRecent = false;
      }

      if (isSmallBatch && isRecent && lastMsg) {
        if (lastMsg.username === currentUser?.name) {
          playSendSound();
        } else {
          playReceiveSound();
        }
      }
    }
    prevMsgsLength.current = msgs.length;
  }, [msgs, playSendSound, playReceiveSound, currentUser]);

  // Use custom hooks
  const {
    chatContainer,
    showScrollButton,
    unreads,
    scrollToBottom,
    isAtBottomRef
  } = useChatScroll(
    isOpen,
    msgs.length,
    currentUser?.id,
    msgs[msgs.length - 1]?.sessionId
  );

  const {
    typingUsers,
    handleTyping,
    getTypingText
  } = useTyping(
    socket,
    currentUser,
    scrollToBottom,
    isAtBottomRef.current
  );

  const sendMessage = (msg: string) => {
    socket?.emit("msg-send", {
      content: msg,
    });
  };

  const updateProfile = ({ name, avatar, color }: { name: string; avatar: string, color?: string }) => {
    socket?.emit("update-user", {
      username: name,
      avatar,
      color
    });
    localStorage.setItem("username", name);
    localStorage.setItem("avatar", avatar);
    if (color) localStorage.setItem("color", color);
  };

  const handleJoin = () => {
    const trimmed = joinName.trim();
    if (!trimmed) return;
    localStorage.setItem("username", trimmed);
    socket?.emit("update-user", {
      username: trimmed,
      avatar: localStorage.getItem("avatar") || "1",
      color: localStorage.getItem("color") || undefined,
    });
    setHasJoined(true);
  };

  const isSingleUser = users.length <= 1;

  return (
    <>
      <Popover
        open={isOpen}
        onOpenChange={(newOpen) => {
          if (!newOpen && isEditingProfile) return;
          setIsOpen(newOpen);
          if (!newOpen) setShowUserList(false)
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "mr-4 h-11 w-12 shadow-lg transition-all duration-300 z-50 p-0",
              "bg-background/20 hover:bg-background/80 backdrop-blur-sm border-2 border-white/30 rounded-lg",
              !isOpen && unreads > 0 && "animate-pulse border-green-500/50"
            )}
          >
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: [0.1, 2], opacity: [1, 0] }}
                  transition={{
                    duration: .4,
                    delay: 0,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className={cn("absolute -inset-1 rounded-full", unreads > 0 ? "bg-green-500/40" : "bg-transparent")}
                />
                <Users2 className="w-6 h-6" />
              </div>

              <span className={cn(
                "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                unreads > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
              )}>
                {unreads > 0 ? unreads : users.length}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-80 min-h-[400px] sm:w-96 p-0 border-none shadow-2xl overflow-hidden rounded-xl mr-4 mb-4 flex flex-col",
            THEME.bg.primary,
            THEME.text.primary
          )}
          side="top"
        >
          {/* Header */}
          <div className={cn("h-12 flex items-center justify-between px-4 shadow-sm border-b shrink-0", THEME.bg.secondary, THEME.border.primary)}>
            <div className={cn("flex items-center gap-2 font-semibold", THEME.text.header)}>
              <Hash className={cn("w-5 h-5", THEME.text.secondary)} />
              <span>general</span>
            </div>
            <div className="flex items-center gap-2">
              {currentUser && hasJoined && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 w-9 p-0 gap-2 transition-colors rounded-full",
                    THEME.bg.hover,
                    THEME.text.secondary,
                    "hover:text-[#060607] dark:hover:text-white"
                  )}
                  onClick={() => setIsEditingProfile(true)}
                  title="Edit Profile"
                >
                  <div className="relative w-8 h-8">
                    <img
                      src={getAvatarUrl(currentUser.avatar)}
                      className="w-full h-full rounded-full ring-1 ring-black/10 dark:ring-white/10"
                      style={{ backgroundColor: currentUser.color || '#60a5fa' }}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#5865f2] rounded-full border-2 border-[var(--bg-primary)]">
                      <Settings className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </Button>
              )}

              <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10 mx-0.5" />

              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "transition-colors gap-2",
                  THEME.bg.hover,
                  `hover:${THEME.text.header.replace("text-", "text-")} `,
                  "hover:text-[#060607] dark:hover:text-white",
                  showUserList && cn(THEME.text.header, THEME.bg.active)
                )}
                onClick={() => setShowUserList(!showUserList)}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>
                    {users.length}
                  </span>
                </div>
                <Users className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className={cn("relative flex flex-col flex-1", THEME.bg.primary)}>
            {/* NAME GATE - show before chat */}
            {!hasJoined ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", THEME.bg.welcome)}>
                  <LogIn className={cn("w-8 h-8", THEME.text.header)} />
                </div>
                <div>
                  <h3 className={cn("text-lg font-bold", THEME.text.header)}>Join #general</h3>
                  <p className={cn("text-xs mt-1 max-w-[220px]", THEME.text.secondary)}>
                    Enter your name to start chatting
                  </p>
                </div>
                <div className="w-full max-w-[240px] space-y-3">
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                    placeholder="Your name..."
                    maxLength={20}
                    autoFocus
                    className={cn(
                      "w-full px-4 py-2.5 rounded-lg border text-sm font-medium text-center outline-none transition-all",
                      THEME.bg.tertiary,
                      THEME.text.primary,
                      THEME.text.placeholder,
                      THEME.border.primary,
                      "focus:ring-2 focus:ring-[#5865f2]/40 focus:border-[#5865f2]/40"
                    )}
                  />
                  <button
                    onClick={handleJoin}
                    disabled={!joinName.trim()}
                    className={cn(
                      "w-full py-2.5 rounded-lg text-sm font-semibold transition-all",
                      joinName.trim()
                        ? "bg-[#5865f2] hover:bg-[#4752c4] text-white cursor-pointer shadow-md shadow-[#5865f2]/20"
                        : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed"
                    )}
                  >
                    Join Chat
                  </button>
                </div>
                <p className={cn("text-[10px]", THEME.text.secondary)}>
                  {users.length} {users.length === 1 ? "person" : "people"} online right now
                </p>
              </div>
            ) : (
              <>
                <ChatMessageList
                  msgs={msgs}
                  users={users}
                  currentUser={currentUser}
                  chatContainerRef={chatContainer}
                  showScrollButton={showScrollButton}
                  unreads={unreads}
                  scrollToBottom={scrollToBottom}
                  isSingleUser={isSingleUser}
                  typingUsers={typingUsers}
                  getTypingText={getTypingText}
                />

                <ChatInput
                  onSendMessage={sendMessage}
                  onTyping={handleTyping}
                  placeholder="Message #general"
                />
              </>
            )}

            <UserList
              users={users}
              socket={socket}
              updateProfile={updateProfile}
              showUserList={showUserList}
              onClose={() => setShowUserList(false)}
              onEditProfile={() => setIsEditingProfile(true)}
            />
          </div>

        </PopoverContent>
      </Popover>

      {currentUser && (
        <EditProfileModal
          user={currentUser}
          isOpen={isEditingProfile}
          onClose={() => setIsEditingProfile(false)}
          updateProfile={updateProfile}
        />
      )}
    </>
  );
};

export default OnlineUsers;

