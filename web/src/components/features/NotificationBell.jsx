import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, X, Clock, AlertCircle } from "lucide-react";
import { notificationApi } from "../../api";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();

    // Polling setiap 45 detik agar selalu update secara realtime
    const interval = setInterval(fetchNotifications, 45000);

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getMyNotifications({ limit: 15 });
      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      setNotifications(data);
    } catch (err) {
      console.warn("Failed fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = (notif) => {
    setOpen(false);
    if (!notif.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
      );
      notificationApi.markAsRead(notif.id).catch(() => {});
    }
  };

  const toggleDropdown = () => {
    setOpen(!open);
    if (!open && unreadCount > 0) {
      // Optimistically mark all read when opening panel if there are unreads
      handleMarkAllRead();
      fetchNotifications();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "SYSTEM":
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case "PAYMENT":
        return <Check className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-brand-indigo" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-slate-600 flex items-center justify-center cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border border-white rounded-full animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl border border-border shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden font-sans">
          <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/50">
            <h3 className="font-bold text-dark-900 text-sm">Notifikasi</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-muted hover:text-dark-900 p-1 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-muted">
                Memuat...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted flex flex-col items-center justify-center">
                <Bell className="w-6 h-6 text-slate-300 mb-2" />
                <p>Belum ada notifikasi baru.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Link
                  key={notif.id}
                  to={notif.url_referensi || "#"}
                  onClick={() => setOpen(false)}
                  onClick={() => handleItemClick(notif)}
                  className={`block p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 ${
                    !notif.is_read ? "bg-brand-indigo/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 bg-white shadow-xs border border-slate-100 w-8 h-8 rounded-full flex items-center justify-center">
                      {getIcon(notif.tipe)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-xs text-dark-900 ${!notif.is_read ? "font-bold" : "font-semibold"}`}
                        >
                          {notif.judul}
                        </h4>
                        <span className="text-[9px] text-muted flex items-center gap-1 shrink-0 whitespace-nowrap">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDistanceToNow(new Date(notif.created_at), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {notif.pesan}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
