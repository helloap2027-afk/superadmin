"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Sparkles, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning" | "brand";

export type ToastPosition = 
  | "top-right" 
  | "top-center" 
  | "top-left" 
  | "bottom-right" 
  | "bottom-center" 
  | "bottom-left";

export interface ToastColorConfig {
  bg: string;
  border: string;
  text: string;
  iconColor: string;
  progressBar: string;
}

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number; // In ms, default 4000
  position?: ToastPosition;
  customColors?: Partial<ToastColorConfig>;
  actionUrl?: string;
  onClick?: () => void;
}

export interface ToastItem extends ToastOptions {
  id: string;
  createdAt: number;
}

// -------------------------------------------------------------
// GLOBAL TOAST SETTINGS (Configurable globally across the app)
// -------------------------------------------------------------
export const GLOBAL_TOAST_CONFIG = {
  // Global default position (can be 'top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left')
  defaultPosition: "top-right" as ToastPosition,
  
  // Global default duration in milliseconds
  defaultDuration: 4000,
  
  // Global theme color definitions
  colors: {
    success: {
      bg: "bg-[#0F172A]/95 text-white backdrop-blur-md",
      border: "border-emerald-500/80 shadow-emerald-500/20",
      text: "text-white",
      iconColor: "text-emerald-400",
      progressBar: "bg-emerald-500",
    },
    error: {
      bg: "bg-[#0F172A]/95 text-white backdrop-blur-md",
      border: "border-rose-500/80 shadow-rose-500/20",
      text: "text-white",
      iconColor: "text-rose-400",
      progressBar: "bg-rose-500",
    },
    info: {
      bg: "bg-[#0F172A]/95 text-white backdrop-blur-md",
      border: "border-[#0076D7]/80 shadow-blue-500/20",
      text: "text-white",
      iconColor: "text-[#0076D7]",
      progressBar: "bg-[#0076D7]",
    },
    warning: {
      bg: "bg-[#0F172A]/95 text-white backdrop-blur-md",
      border: "border-[#FF6B35]/80 shadow-orange-500/20",
      text: "text-white",
      iconColor: "text-[#FF6B35]",
      progressBar: "bg-[#FF6B35]",
    },
    brand: {
      bg: "bg-[#0B1220]/95 text-white backdrop-blur-md",
      border: "border-gradient-to-r border-blue-400/80 shadow-blue-500/25",
      text: "text-white",
      iconColor: "text-amber-400",
      progressBar: "bg-gradient-to-r from-[#FF6B35] to-[#0076D7]",
    },
  } as Record<ToastType, ToastColorConfig>,
};

// Cross-page storage key
const TOAST_STORAGE_KEY = "hello_pending_toast";

interface ToastContextValue {
  toasts: ToastItem[];
  position: ToastPosition;
  setPosition: (pos: ToastPosition) => void;
  showToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearAll: () => void;
  setColorTheme: (type: ToastType, colors: Partial<ToastColorConfig>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Global function dispatcher for imperative calls outside React tree
type ToastDispatcher = (options: ToastOptions) => string;
let globalToastDispatcher: ToastDispatcher | null = null;
let globalPositionSetter: ((pos: ToastPosition) => void) | null = null;
let globalThemeSetter: ((type: ToastType, colors: Partial<ToastColorConfig>) => void) | null = null;

export function ToastProvider({
  children,
  defaultPosition = GLOBAL_TOAST_CONFIG.defaultPosition,
}: {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [position, setPositionState] = useState<ToastPosition>(defaultPosition);
  const [colorThemes, setColorThemes] = useState(GLOBAL_TOAST_CONFIG.colors);

  const setPosition = useCallback((newPos: ToastPosition) => {
    setPositionState(newPos);
    GLOBAL_TOAST_CONFIG.defaultPosition = newPos;
  }, []);

  const setColorTheme = useCallback((type: ToastType, custom: Partial<ToastColorConfig>) => {
    setColorThemes((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...custom },
    }));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptions): string => {
      const id = options.id || `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = {
        id,
        type: options.type || "info",
        title: options.title,
        message: options.message,
        duration: options.duration ?? GLOBAL_TOAST_CONFIG.defaultDuration,
        position: options.position || position,
        customColors: options.customColors,
        createdAt: Date.now(),
      };

      // Deduplicate: If an identical toast (same title and message, or same id) already exists, skip adding it
      setToasts((prev) => {
        const isDuplicate = prev.some(
          (t) => (t.id === id) || (t.title === newToast.title && t.message === newToast.message)
        );
        if (isDuplicate) {
          return prev;
        }
        return [newToast, ...prev].slice(0, 5);
      });

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, newToast.duration);
      }

      return id;
    },
    [position, dismissToast]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Hook global dispatchers
  useEffect(() => {
    globalToastDispatcher = showToast;
    globalPositionSetter = setPosition;
    globalThemeSetter = setColorTheme;
    return () => {
      globalToastDispatcher = null;
      globalPositionSetter = null;
      globalThemeSetter = null;
    };
  }, [showToast, setPosition, setColorTheme]);

  // Check for queued cross-page toasts on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(TOAST_STORAGE_KEY);
        if (stored) {
          sessionStorage.removeItem(TOAST_STORAGE_KEY);
          const parsed: ToastOptions = JSON.parse(stored);
          setTimeout(() => {
            showToast(parsed);
          }, 400);
        }
      } catch {
        // Silent catch for invalid JSON
      }
    }
  }, [showToast]);

  // Position container classes mapping
  const getPositionClasses = (pos: ToastPosition) => {
    switch (pos) {
      case "top-center":
        return "top-5 left-1/2 -translate-x-1/2 items-center";
      case "top-left":
        return "top-5 left-5 items-start";
      case "bottom-right":
        return "bottom-5 right-5 items-end";
      case "bottom-center":
        return "bottom-5 left-1/2 -translate-x-1/2 items-center";
      case "bottom-left":
        return "bottom-5 left-5 items-start";
      case "top-right":
      default:
        return "top-5 right-5 items-end";
    }
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        position,
        setPosition,
        showToast,
        dismissToast,
        clearAll,
        setColorTheme,
      }}
    >
      {children}

      {/* FIXED GLOBAL TOAST PORTAL */}
      <div
        className={`fixed z-[99999] pointer-events-none flex flex-col gap-2.5 max-w-[92vw] sm:max-w-md w-full transition-all duration-300 ${getPositionClasses(
          position
        )}`}
        aria-live="polite"
      >
        {toasts.map((item) => {
          const type = item.type || "info";
          const theme = colorThemes[type] || colorThemes.info;
          const bgClass = item.customColors?.bg || theme.bg;
          const borderClass = item.customColors?.border || theme.border;
          const textClass = item.customColors?.text || theme.text;
          const iconColorClass = item.customColors?.iconColor || theme.iconColor;
          const progressClass = item.customColors?.progressBar || theme.progressBar;

          const getIcon = () => {
            switch (type) {
              case "success":
                return <CheckCircle2 className={`w-5 h-5 shrink-0 ${iconColorClass}`} />;
              case "error":
                return <AlertCircle className={`w-5 h-5 shrink-0 ${iconColorClass}`} />;
              case "warning":
                return <AlertTriangle className={`w-5 h-5 shrink-0 ${iconColorClass}`} />;
              case "brand":
                return <Sparkles className={`w-5 h-5 shrink-0 ${iconColorClass}`} />;
              case "info":
              default:
                return <Info className={`w-5 h-5 shrink-0 ${iconColorClass}`} />;
            }
          };

          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                  dismissToast(item.id);
                } else if (item.actionUrl && typeof window !== "undefined") {
                  window.location.href = item.actionUrl;
                  dismissToast(item.id);
                }
              }}
              className={`pointer-events-auto w-full rounded-2xl border p-3.5 shadow-2xl flex items-start gap-3 relative overflow-hidden transition-all duration-300 transform translate-y-0 opacity-100 hover:scale-[1.02] ${
                item.onClick || item.actionUrl ? "cursor-pointer" : ""
              } ${bgClass} ${borderClass}`}
              role="alert"
            >
              {/* Status Icon */}
              <div className="pt-0.5">{getIcon()}</div>

              {/* Message Content */}
              <div className="flex-1 pr-4">
                {item.title && (
                  <h5 className={`text-xs font-black tracking-tight leading-tight mb-0.5 ${textClass}`}>
                    {item.title}
                  </h5>
                )}
                <p className={`text-xs font-medium leading-relaxed opacity-95 ${textClass}`}>
                  {item.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => dismissToast(item.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Auto-Dismiss Shrinking Progress Bar */}
              {item.duration && item.duration > 0 && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 opacity-80 ${progressClass}`}
                  style={{
                    animation: `toast-progress ${item.duration}ms linear forwards`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// -------------------------------------------------------------
// CONTEXT HOOK
// -------------------------------------------------------------
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// -------------------------------------------------------------
// IMPERATIVE TOAST API (Can be imported and called anywhere!)
// -------------------------------------------------------------
export const toast = {
  success: (message: string, options?: Omit<ToastOptions, "message" | "type">) => {
    if (globalToastDispatcher) {
      return globalToastDispatcher({ ...options, message, type: "success" });
    }
    return "";
  },
  error: (message: string, options?: Omit<ToastOptions, "message" | "type">) => {
    if (globalToastDispatcher) {
      return globalToastDispatcher({ ...options, message, type: "error" });
    }
    return "";
  },
  info: (message: string, options?: Omit<ToastOptions, "message" | "type">) => {
    if (globalToastDispatcher) {
      return globalToastDispatcher({ ...options, message, type: "info" });
    }
    return "";
  },
  warning: (message: string, options?: Omit<ToastOptions, "message" | "type">) => {
    if (globalToastDispatcher) {
      return globalToastDispatcher({ ...options, message, type: "warning" });
    }
    return "";
  },
  brand: (message: string, options?: Omit<ToastOptions, "message" | "type">) => {
    if (globalToastDispatcher) {
      return globalToastDispatcher({ ...options, message, type: "brand" });
    }
    return "";
  },
  show: (options: ToastOptions) => {
    if (globalToastDispatcher) {
      return globalToastDispatcher(options);
    }
    return "";
  },
  
  // Set Global Position at runtime: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
  setPosition: (position: ToastPosition) => {
    if (globalPositionSetter) {
      globalPositionSetter(position);
    } else {
      GLOBAL_TOAST_CONFIG.defaultPosition = position;
    }
  },

  // Set Global Color Scheme for any type ('success' | 'error' | 'info' | 'warning' | 'brand')
  setColorTheme: (type: ToastType, colors: Partial<ToastColorConfig>) => {
    if (globalThemeSetter) {
      globalThemeSetter(type, colors);
    } else {
      GLOBAL_TOAST_CONFIG.colors[type] = {
        ...GLOBAL_TOAST_CONFIG.colors[type],
        ...colors,
      };
    }
  },

  // Queue toast to appear after cross-page router navigation (e.g. from /login or /verify-otp to /)
  queueCrossPage: (options: ToastOptions) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(TOAST_STORAGE_KEY, JSON.stringify(options));
    }
  },
};

