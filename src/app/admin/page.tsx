"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  LogOut,
  Activity,
  RefreshCw,
  UserX,
  Skull,
} from "lucide-react";
import { getAvatarUrl } from "@/lib/avatar";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "";

type OnlineUser = {
  socketId: string;
  name: string;
  avatar: string;
  color: string;
  flag: string;
  location: string;
  createdAt: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState<{
    totalMessages: number;
    onlineUsers: number;
    uptime: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [kickingId, setKickingId] = useState<string | null>(null);

  const getStoredPw = () => sessionStorage.getItem("admin-pw");

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setStatsLoading(true);
    try {
      const res = await fetch(`${WS_URL}/admin/stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: getStoredPw() }),
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // silent fail
    } finally {
      setStatsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOnlineUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    setUsersLoading(true);
    try {
      const res = await fetch(`${WS_URL}/admin/online-users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: getStoredPw() }),
      });
      if (res.ok) {
        const data = await res.json();
        setOnlineUsers(data.users || []);
      }
    } catch {
      // silent fail
    } finally {
      setUsersLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchOnlineUsers();
    }
  }, [isAuthenticated, fetchStats, fetchOnlineUsers]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchStats();
      fetchOnlineUsers();
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchStats, fetchOnlineUsers]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${WS_URL}/admin/stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        sessionStorage.setItem("admin-pw", password);
        setIsAuthenticated(true);
        const data = await res.json();
        setStats(data);
      } else {
        setError("Invalid password. Access denied.");
      }
    } catch {
      setError("Server unreachable. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${WS_URL}/admin/clear-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: getStoredPw() }),
      });

      if (res.ok) {
        setSuccess("Chat history cleared successfully!");
        fetchStats();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError("Failed to clear chat. Invalid credentials.");
      }
    } catch {
      setError("Server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleKickUser = async (socketId: string, userName: string) => {
    setKickingId(socketId);
    setSuccess("");
    setError("");

    try {
      const res = await fetch(`${WS_URL}/admin/kick-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: getStoredPw(), socketId }),
      });

      if (res.ok) {
        setSuccess(`${userName} has been kicked!`);
        // Refresh the user list
        setTimeout(() => {
          fetchOnlineUsers();
          fetchStats();
        }, 500);
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to kick user.");
      }
    } catch {
      setError("Server unreachable.");
    } finally {
      setKickingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin-pw");
    setIsAuthenticated(false);
    setPassword("");
    setStats(null);
    setOnlineUsers([]);
  };

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/60 rounded-2xl shadow-2xl shadow-black/40 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 mb-4">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Admin Panel
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                Enter your password to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-12 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 transition-all text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 text-xs">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-medium rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:shadow-none"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                {loading ? "Verifying..." : "Authenticate"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-zinc-600 text-xs mt-4">
            Authorized personnel only
          </p>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 md:p-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-zinc-500">Server Management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Global Alerts */}
        {success && (
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-green-400 text-sm">{success}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-zinc-500">Messages</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {statsLoading ? "..." : stats?.totalMessages ?? "—"}
            </p>
          </div>

          <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-xs text-zinc-500">Online</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {statsLoading ? "..." : stats?.onlineUsers ?? "—"}
            </p>
          </div>

          <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-zinc-500">Uptime</span>
            </div>
            <p className="text-lg font-bold text-white">
              {statsLoading
                ? "..."
                : stats
                ? formatUptime(stats.uptime)
                : "—"}
            </p>
          </div>
        </div>

        {/* Refresh */}
        <button
          onClick={() => { fetchStats(); fetchOnlineUsers(); }}
          disabled={statsLoading || usersLoading}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <RefreshCw
            className={`w-3 h-3 ${statsLoading || usersLoading ? "animate-spin" : ""}`}
          />
          Refresh (auto every 10s)
        </button>

        {/* Online Users - Kick Section */}
        <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800/60 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <UserX className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Online Users
              </h2>
              <p className="text-xs text-zinc-500">
                Kick any user from the site. They will be disconnected immediately.
              </p>
            </div>
          </div>

          {usersLoading && onlineUsers.length === 0 ? (
            <div className="text-center py-6">
              <RefreshCw className="w-5 h-5 text-zinc-500 animate-spin mx-auto mb-2" />
              <p className="text-xs text-zinc-500">Loading users...</p>
            </div>
          ) : onlineUsers.length === 0 ? (
            <div className="text-center py-6">
              <Users className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">No users online</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {onlineUsers.map((user) => (
                <div
                  key={user.socketId}
                  className="flex items-center justify-between bg-zinc-800/40 border border-zinc-700/30 rounded-lg px-4 py-3 group hover:border-zinc-600/50 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt={user.name}
                        className="w-9 h-9 rounded-full"
                        style={{ backgroundColor: user.color }}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-800" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-medium truncate"
                          style={{ color: user.color }}
                        >
                          {user.name}
                        </span>
                        <span className="text-sm">{user.flag}</span>
                      </div>
                      <p className="text-[10px] text-zinc-600 font-mono truncate">
                        {user.socketId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleKickUser(user.socketId, user.name)}
                    disabled={kickingId === user.socketId}
                    className="flex-shrink-0 ml-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50 transition-all cursor-pointer"
                    title={`Kick ${user.name}`}
                  >
                    {kickingId === user.socketId ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Skull className="w-3 h-3" />
                    )}
                    Kick
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear Chat Section */}
        <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800/60 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Clear Chat History
              </h2>
              <p className="text-xs text-zinc-500">
                Delete all messages from #general. This cannot be undone.
              </p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600/90 to-red-700/90 hover:from-red-500 hover:to-red-600 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-medium rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 border border-red-500/20 shadow-lg shadow-red-500/10 disabled:shadow-none disabled:border-zinc-700"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {loading ? "Clearing..." : "Clear All Messages"}
          </button>
        </div>

        {/* Server Info */}
        <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-400 font-medium">
              Server Info
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Backend URL</span>
              <span className="text-zinc-300 font-mono">{WS_URL || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Status</span>
              <span className="text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
