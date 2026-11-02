"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Compass, MapPin, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning" | "location";
export type ToastPosition = "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";

export interface ToastOptions {
  id?: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number; // ms, default 3500
  position?: ToastPosition;
  customColor?: {
    bg?: string;
    border?: string;
    text?: string;
    iconColor?: string;
  };
}

interface ToastContextType {
  showToast: (options: ToastOptions | string) => void;
  hideToast: (id: string) => void;
  globalPosition: ToastPosition;
  setGlobalPosition: (pos: ToastPosition) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Standalone global trigger so any non-hook callback can dispatch toasts
let globalToastEmitter: ((opts: ToastOptions) => void) | null = null;

export function showGlobalToast(options: ToastOptions | string) {
  if (globalToastEmitter) {
    if (typeof options === "string") {
      globalToastEmitter({ message: options });
    } else {
      globalToastEmitter(options);
    }
  } else {
    // Fallback if provider not mounted yet
    if (typeof options === "string") {
      console.log("[Toast]:", options);
    } else {
      console.log(`[Toast ${options.type || "info"}]:`, options.title, options.message);
    }
  }
}

export function ToastProvider({
  children,
  defaultPosition = "top-right",
}: {
  children: ReactNode;
  defaultPosition?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);
  const [globalPosition, setGlobalPosition] = useState<ToastPosition>(defaultPosition);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptions | string) => {
      const opts: ToastOptions =
        typeof options === "string" ? { message: options, type: "info" } : { ...options };
      const id = opts.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const duration = opts.duration ?? 3500;

      const newToast: ToastOptions = {
        ...opts,
        id,
        position: opts.position || globalPosition,
      };

      setToasts((prev) => [...prev.filter((t) => t.id !== id), newToast]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [globalPosition, hideToast]
  );

  // Bind global emitter
  React.useEffect(() => {
    globalToastEmitter = (opts: ToastOptions) => showToast(opts);
    return () => {
      globalToastEmitter = null;
    };
  }, [showToast]);

  // Group toasts by position
  const getPositionClasses = (pos: ToastPosition) => {
    switch (pos) {
      case "top-left":
        return "top-5 left-5 items-start";
      case "top-center":
        return "top-5 left-1/2 -translate-x-1/2 items-center";
      case "top-right":
      default:
        return "top-5 right-5 items-end";
      case "bottom-left":
        return "bottom-5 left-5 items-start";
      case "bottom-center":
        return "bottom-5 left-1/2 -translate-x-1/2 items-center";
      case "bottom-right":
        return "bottom-5 right-5 items-end";
    }
  };

  const getVariantStyles = (type: ToastType = "info") => {
    switch (type) {
      case "success":
        return {
          bg: "bg-slate-900/95 backdrop-blur-md",
          border: "border-emerald-500/50",
          text: "text-white",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          accent: "bg-emerald-500",
        };
      case "error":
        return {
          bg: "bg-slate-900/95 backdrop-blur-md",
          border: "border-rose-500/50",
          text: "text-white",
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          accent: "bg-rose-500",
        };
      case "warning":
        return {
          bg: "bg-slate-900/95 backdrop-blur-md",
          border: "border-amber-500/50",
          text: "text-white",
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          accent: "bg-amber-500",
        };
      case "location":
        return {
          bg: "bg-[#0B1220]/95 backdrop-blur-md",
          border: "border-[#0076D7]/60",
          text: "text-white",
          icon: <Compass className="w-5 h-5 text-[#0076D7] animate-pulse shrink-0" />,
          accent: "bg-[#0076D7]",
        };
      case "info":
      default:
        return {
          bg: "bg-slate-900/95 backdrop-blur-md",
          border: "border-blue-500/50",
          text: "text-white",
          icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
          accent: "bg-blue-500",
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, globalPosition, setGlobalPosition }}>
      {children}

      {/* Render Active Toasts in Fixed Portals */}
      <aside aria-live="polite" aria-label="Notifications" className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {(["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] as ToastPosition[]).map(
          (pos) => {
            const positionToasts = toasts.filter((t) => (t.position || globalPosition) === pos);
            if (positionToasts.length === 0) return null;

            return (
              <div
                key={pos}
                className={`absolute flex flex-col gap-2.5 p-4 pointer-events-none w-full max-w-sm sm:max-w-md ${getPositionClasses(
                  pos
                )}`}
              >
                {positionToasts.map((t) => {
                  const variant = getVariantStyles(t.type);
                  const isCustom = !!t.customColor;
                  const bgClass = isCustom && t.customColor?.bg ? t.customColor.bg : variant.bg;
                  const borderClass = isCustom && t.customColor?.border ? t.customColor.border : variant.border;
                  const textClass = isCustom && t.customColor?.text ? t.customColor.text : variant.text;

                  return (
                    <div
                      key={t.id}
                      role="status"
                      className={`pointer-events-auto w-full rounded-2xl shadow-2xl border px-4 py-3 flex items-start gap-3 transition-all duration-300 ease-out transform translate-y-0 opacity-100 ${bgClass} ${borderClass} ${textClass}`}
                    >
                      {/* Left Icon */}
                      <div className="pt-0.5">{variant.icon}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-1">
                        {t.title && (
                          <h4 className="text-xs font-black tracking-tight text-white mb-0.5 flex items-center gap-1.5">
                            <span>{t.title}</span>
                            {t.type === "location" && (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded-full border border-emerald-500/40">
                                GPS Active
                              </span>
                            )}
                          </h4>
                        )}
                        <p className="text-xs text-slate-300 leading-snug break-words">{t.message}</p>
                      </div>

                      {/* Dismiss Close Button */}
                      <button
                        onClick={() => t.id && hideToast(t.id)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          }
        )}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback to global emitter
    return {
      showToast: showGlobalToast,
      hideToast: () => {},
      globalPosition: "top-right" as ToastPosition,
      setGlobalPosition: () => {},
    };
  }
  return context;
}
