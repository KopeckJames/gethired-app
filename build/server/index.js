import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json, redirect } from "@remix-run/node";
import { RemixServer, useRevalidator, useNavigate, NavLink, Link, useLoaderData, useSearchParams, Meta, Links, Outlet, ScrollRestoration, Scripts } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect, createContext, useCallback, useContext, useReducer, forwardRef, useRef } from "react";
import { HomeIcon, BriefcaseIcon, DocumentTextIcon, DocumentMagnifyingGlassIcon, ChatBubbleLeftRightIcon, MicrophoneIcon, StopIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";
import Anthropic from "@anthropic-ai/sdk";
import fetch$1 from "node-fetch";
import OpenAI from "openai";
import { createPortal } from "react-dom";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const variantStyles$6 = {
  success: {
    bg: "bg-green-500/10",
    border: "border-green-500",
    text: "text-green-400",
    icon: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) })
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500",
    text: "text-red-400",
    icon: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) })
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500",
    text: "text-yellow-400",
    icon: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) })
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500",
    text: "text-blue-400",
    icon: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) })
  }
};
function Alert({
  variant = "info",
  title,
  children,
  dismissible = false,
  autoClose = false,
  autoCloseDelay = 5e3,
  onClose,
  className = "",
  icon
}) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose == null ? void 0 : onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, isVisible, onClose]);
  if (!isVisible) return null;
  const styles = variantStyles$6[variant];
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "alert",
      className: `relative rounded-lg border ${styles.border} ${styles.bg} p-4 ${className}`,
      children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: styles.text, children: icon || styles.icon }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-3 flex-1", children: [
          title && /* @__PURE__ */ jsx("h3", { className: `text-sm font-medium ${styles.text}`, children: title }),
          /* @__PURE__ */ jsx("div", { className: `text-sm ${title ? "mt-2" : ""} ${styles.text}`, children })
        ] }),
        dismissible && /* @__PURE__ */ jsx("div", { className: "ml-auto pl-3", children: /* @__PURE__ */ jsx("div", { className: "-mx-1.5 -my-1.5", children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setIsVisible(false);
              onClose == null ? void 0 : onClose();
            },
            className: `inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.text} hover:${styles.bg}`,
            "aria-label": "Dismiss",
            children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Dismiss" }),
              /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
            ]
          }
        ) }) })
      ] })
    }
  );
}
const NotificationContext = createContext(null);
function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const addNotification = useCallback(
    (type, title, message) => {
      const id = crypto.randomUUID();
      const notification = {
        id,
        type,
        title,
        message
      };
      setNotifications((prev) => [...prev, notification]);
      setTimeout(() => {
        removeNotification(id);
      }, 5e3);
    },
    []
  );
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);
  return /* @__PURE__ */ jsxs(
    NotificationContext.Provider,
    {
      value: { notifications, addNotification, removeNotification },
      children: [
        children,
        /* @__PURE__ */ jsx("div", { className: "fixed bottom-4 right-4 z-50 flex flex-col gap-2", children: notifications.map((notification) => /* @__PURE__ */ jsx(
          Alert,
          {
            variant: notification.type,
            title: notification.title,
            onClose: () => removeNotification(notification.id),
            children: notification.message
          },
          notification.id
        )) })
      ]
    }
  );
}
function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
const initialState = {
  applications: [],
  filters: {
    status: [],
    search: ""
  },
  sort: {
    field: "dateApplied",
    direction: "desc"
  }
};
function applicationReducer(state, action2) {
  switch (action2.type) {
    case "ADD_APPLICATION":
      return {
        ...state,
        applications: [...state.applications, action2.payload]
      };
    case "UPDATE_APPLICATION":
      return {
        ...state,
        applications: state.applications.map(
          (app) => app.id === action2.payload.id ? action2.payload : app
        )
      };
    case "DELETE_APPLICATION":
      return {
        ...state,
        applications: state.applications.filter((app) => app.id !== action2.payload)
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: action2.payload
      };
    case "SET_SORT":
      return {
        ...state,
        sort: action2.payload
      };
    default:
      return state;
  }
}
const ApplicationContext = createContext(null);
function ApplicationProvider({ children }) {
  const [state, dispatch] = useReducer(applicationReducer, initialState);
  const getFilteredAndSortedApplications = () => {
    let filtered = state.applications;
    if (state.filters.status.length > 0) {
      filtered = filtered.filter(
        (app) => state.filters.status.includes(app.status)
      );
    }
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase();
      filtered = filtered.filter(
        (app) => {
          var _a, _b;
          return app.company.toLowerCase().includes(searchLower) || app.position.toLowerCase().includes(searchLower) || ((_a = app.description) == null ? void 0 : _a.toLowerCase().includes(searchLower)) || ((_b = app.location) == null ? void 0 : _b.toLowerCase().includes(searchLower));
        }
      );
    }
    if (state.filters.dateRange) {
      const { start, end } = state.filters.dateRange;
      filtered = filtered.filter((app) => {
        const appDate = new Date(app.dateApplied);
        return appDate >= new Date(start) && appDate <= new Date(end);
      });
    }
    const { field, direction } = state.sort;
    filtered.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (field === "dateApplied" || field === "createdAt" || field === "updatedAt") {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return direction === "asc" ? aDate - bDate : bDate - aDate;
      }
      return 0;
    });
    return filtered;
  };
  return /* @__PURE__ */ jsx(
    ApplicationContext.Provider,
    {
      value: { state, dispatch, getFilteredAndSortedApplications },
      children
    }
  );
}
function useApplicationContext() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      "useApplicationContext must be used within an ApplicationProvider"
    );
  }
  return context;
}
function deserializeUser(user) {
  return {
    ...user,
    createdAt: new Date(user.createdAt)
  };
}
function serializeUser(user) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString()
  };
}
const AuthContext = createContext(null);
function AuthProvider({ children, initialUser, initialAuthState }) {
  const [user, setUser] = useState(initialUser ? deserializeUser(initialUser) : null);
  const [isInitialized, setIsInitialized] = useState(true);
  useRevalidator();
  const navigate = useNavigate();
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include"
        });
        const data = await response.json();
        if (!response.ok) {
          setUser(null);
          document.cookie = "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          navigate("/?error=" + encodeURIComponent(data.error || "Authentication failed. Please sign in again."));
          return;
        }
        if (data.user) {
          setUser(deserializeUser(data.user));
        }
      } catch (error) {
        console.error("Error verifying auth:", error);
      }
    };
    if (initialAuthState) {
      verifyAuth();
    }
  }, [initialAuthState, navigate]);
  const value = {
    isAuthenticated: !!user,
    user,
    isInitialized
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
}
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
const navigation = [
  { name: "Home", to: "/", icon: HomeIcon },
  { name: "Applications", to: "/applications", icon: BriefcaseIcon },
  { name: "Documents", to: "/documents", icon: DocumentTextIcon },
  { name: "Resume Analysis", to: "/resume-analysis", icon: DocumentMagnifyingGlassIcon },
  { name: "AI Chat", to: "/chat", icon: ChatBubbleLeftRightIcon },
  { name: "Voice Notes", to: "/voice-notes", icon: MicrophoneIcon }
];
function Navigation() {
  return /* @__PURE__ */ jsx("nav", { className: "flex space-x-4 px-4 py-3 bg-white shadow-sm", children: navigation.map((item) => /* @__PURE__ */ jsxs(
    NavLink,
    {
      to: item.to,
      className: ({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
      children: [
        /* @__PURE__ */ jsx(item.icon, { className: "h-5 w-5 mr-2", "aria-hidden": "true" }),
        item.name
      ]
    },
    item.name
  )) });
}
const variantStyles$5 = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500",
  outline: "border border-slate-300 text-slate-700 hover:bg-slate-100 focus:ring-slate-500",
  ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-500"
};
const sizeStyles$5 = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3"
};
const loadingSpinner = /* @__PURE__ */ jsxs(
  "svg",
  {
    className: "animate-spin h-5 w-5",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    children: [
      /* @__PURE__ */ jsx(
        "circle",
        {
          className: "opacity-25",
          cx: "12",
          cy: "12",
          r: "10",
          stroke: "currentColor",
          strokeWidth: "4"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          className: "opacity-75",
          fill: "currentColor",
          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        }
      )
    ]
  }
);
function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = `${baseStyles} ${variantStyles$5[variant]} ${sizeStyles$5[size]} ${className}`;
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    isLoading && /* @__PURE__ */ jsx("span", { className: "mr-2", "aria-hidden": "true", children: loadingSpinner }),
    !isLoading && leftIcon && /* @__PURE__ */ jsx("span", { className: "mr-2", "aria-hidden": "true", children: leftIcon }),
    /* @__PURE__ */ jsx("span", { children }),
    !isLoading && rightIcon && /* @__PURE__ */ jsx("span", { className: "ml-2", "aria-hidden": "true", children: rightIcon })
  ] });
  if ("to" in props) {
    return /* @__PURE__ */ jsx(
      Link,
      {
        ...props,
        className: styles,
        "aria-disabled": isDisabled || isLoading,
        tabIndex: isDisabled || isLoading ? -1 : void 0,
        children: content
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...props,
      className: styles,
      disabled: isDisabled || isLoading,
      "aria-busy": isLoading,
      children: content
    }
  );
}
function LoginButton() {
  const { isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const baseUrl = window.ENV.APP_URL || window.location.origin;
      const redirectUri = `${baseUrl}/auth/callback`;
      const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      googleAuthUrl.searchParams.append("client_id", window.ENV.GOOGLE_CLIENT_ID);
      googleAuthUrl.searchParams.append("redirect_uri", redirectUri);
      googleAuthUrl.searchParams.append("response_type", "code");
      googleAuthUrl.searchParams.append("scope", "email profile");
      googleAuthUrl.searchParams.append("access_type", "offline");
      googleAuthUrl.searchParams.append("prompt", "consent");
      window.location.href = googleAuthUrl.toString();
    } catch (error) {
      console.error("Error logging in:", error);
      navigate("/?error=" + encodeURIComponent("Failed to sign in. Please try again."));
    }
  };
  const handleLogout = async () => {
    try {
      const response = await fetch("/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to sign out");
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      navigate("/?error=" + encodeURIComponent("Failed to sign out. Please try again."));
    }
  };
  if (!isInitialized) {
    return /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        disabled: true,
        className: "flex items-center gap-2",
        children: "Loading..."
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    Button,
    {
      onClick: isAuthenticated ? handleLogout : handleLogin,
      variant: "outline",
      className: "flex items-center gap-2",
      children: [
        !isAuthenticated && /* @__PURE__ */ jsxs("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              fill: "currentColor",
              d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              fill: "currentColor",
              d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              fill: "currentColor",
              d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              fill: "currentColor",
              d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            }
          )
        ] }),
        isAuthenticated ? "Sign Out" : "Sign in with Google"
      ]
    }
  );
}
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-full", children: [
    /* @__PURE__ */ jsxs("header", { className: "border-b border-slate-200 bg-white", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "text-xl font-bold text-slate-900", children: "GetHired!" }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(LoginButton, {}) })
      ] }) }),
      /* @__PURE__ */ jsx(Navigation, {})
    ] }),
    /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl py-6 sm:px-6 lg:px-8", children }) }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-slate-200 bg-white", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-slate-500", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " GetHired! All rights reserved."
    ] }) }) })
  ] });
}
function getPublicEnv() {
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    GOOGLE_CLIENT_ID: "232275253964-6t8o4dc1p4n6hp3ocev5llannel7qm5l.apps.googleusercontent.com",
    APP_URL: process.env.APP_URL
  };
}
const ENV = {
  MONGODB_URI: process.env.MONGODB_URI,
  GOOGLE_CLIENT_ID: "232275253964-6t8o4dc1p4n6hp3ocev5llannel7qm5l.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "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",
  JWT_SECRET: process.env.JWT_SECRET,
  APP_URL: process.env.APP_URL
};
const requiredServerEnvVars = [
  "MONGODB_URI",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "JWT_SECRET",
  "APP_URL"
];
for (const envVar of requiredServerEnvVars) {
  if (!ENV[envVar]) {
    throw new Error(`${envVar} is required`);
  }
}
const requiredClientEnvVars = [
  "MONGODB_URI",
  "GOOGLE_CLIENT_ID",
  "APP_URL"
];
function validatePublicEnv() {
  const env = getPublicEnv();
  for (const envVar of requiredClientEnvVars) {
    if (!env[envVar]) {
      throw new Error(`${envVar} is required`);
    }
  }
}
let db;
async function connect() {
  console.log("Attempting to connect to MongoDB...");
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    throw new Error("MONGODB_URI is required");
  }
  try {
    if (process.env.NODE_ENV === "production") {
      console.log("Connecting in production mode...");
      db = await MongoClient.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 6e4,
        connectTimeoutMS: 3e4
      });
      console.log("Successfully connected to MongoDB in production");
      return db;
    }
    if (!global.__db) {
      console.log("Creating new development connection...");
      global.__db = await MongoClient.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 6e4,
        connectTimeoutMS: 3e4
      });
      console.log("Successfully connected to MongoDB in development");
    } else {
      console.log("Using existing development connection");
    }
    db = global.__db;
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
async function getDb() {
  try {
    if (!db) {
      console.log("No existing connection, connecting to MongoDB...");
      await connect();
    }
    await db.db().command({ ping: 1 });
    console.log("MongoDB connection is valid");
    return db;
  } catch (error) {
    console.error("Error getting MongoDB connection:", error);
    console.log("Attempting to reconnect...");
    await connect();
    return db;
  }
}
async function closeDb() {
  try {
    if (db) {
      console.log("Closing MongoDB connection...");
      await db.close();
      db = void 0;
      console.log("MongoDB connection closed successfully");
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
}
process.on("beforeExit", async () => {
  await closeDb();
});
function mapUserToResponse(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    picture: user.picture,
    createdAt: user.createdAt
  };
}
async function authenticateWithGoogle(code) {
  console.log("Authenticating with Google...");
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code,
        client_id: "232275253964-6t8o4dc1p4n6hp3ocev5llannel7qm5l.apps.googleusercontent.com",
        client_secret: "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",
        redirect_uri: `${process.env.APP_URL}/auth/callback`,
        grant_type: "authorization_code"
      })
    });
    if (!tokenResponse.ok) {
      console.error("Failed to exchange code for tokens:", await tokenResponse.text());
      throw new Error("Failed to exchange code for tokens");
    }
    const { access_token } = await tokenResponse.json();
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    });
    if (!userResponse.ok) {
      console.error("Failed to get user info from Google:", await userResponse.text());
      throw new Error("Failed to get user info from Google");
    }
    const { email, name, picture } = await userResponse.json();
    const user = await findOrCreateUser(email, name, picture);
    const token = await createAuthToken(user);
    console.log("Google authentication successful for user:", user.id);
    return { user, token };
  } catch (error) {
    console.error("Error during Google authentication:", error);
    throw error;
  }
}
async function findOrCreateUser(email, name, picture) {
  console.log("Finding or creating user:", { email, name });
  try {
    const db2 = await getDb();
    const collection = db2.db().collection("users");
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      console.log("Found existing user:", existingUser._id.toString());
      return mapUserToResponse(existingUser);
    }
    const newUser = {
      email,
      name,
      picture,
      createdAt: /* @__PURE__ */ new Date()
    };
    const result = await collection.insertOne(newUser);
    console.log("Created new user:", result.insertedId.toString());
    return {
      id: result.insertedId.toString(),
      email,
      name,
      picture,
      createdAt: newUser.createdAt
    };
  } catch (error) {
    console.error("Error finding/creating user:", error);
    throw error;
  }
}
async function createAuthToken(user) {
  console.log("Creating auth token for user:", user.id);
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    throw new Error("JWT_SECRET is required");
  }
  try {
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("Auth token created successfully");
    return token;
  } catch (error) {
    console.error("Error creating auth token:", error);
    throw error;
  }
}
async function verifyToken(token) {
  console.log("Verifying auth token");
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    throw new Error("JWT_SECRET is required");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully for user:", decoded.userId);
    const db2 = await getDb();
    const user = await db2.db().collection("users").findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      console.log("No user found for decoded token");
      return null;
    }
    console.log("User found and verified:", user._id.toString());
    return mapUserToResponse(user);
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
const links = () => [
  {
    rel: "icon",
    href: "/favicon.ico",
    type: "image/x-icon"
  }
];
async function loader$4({ request }) {
  validatePublicEnv();
  const env = getPublicEnv();
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, value] = cookie.split("=");
      return [name, decodeURIComponent(value)];
    })
  );
  const token = cookies.auth_token;
  let user = null;
  let isAuthenticated = false;
  if (token) {
    try {
      const verifiedUser = await verifyToken(token);
      if (verifiedUser) {
        user = serializeUser(verifiedUser);
        isAuthenticated = true;
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  }
  return json({
    ENV: env,
    user,
    isAuthenticated
  });
}
function App() {
  const { ENV: ENV2, user, isAuthenticated } = useLoaderData();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  useEffect(() => {
    if (error) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [error]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.ENV = ENV2;
    }
  }, [ENV2]);
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Track and manage your job applications with GetHired!" }),
      /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#000000" }),
      /* @__PURE__ */ jsx("title", { children: "GetHired! - Job Application Tracker" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "h-full bg-white text-slate-900 antialiased", children: [
      /* @__PURE__ */ jsx(AuthProvider, { initialUser: user, initialAuthState: isAuthenticated, children: /* @__PURE__ */ jsx(NotificationProvider, { children: /* @__PURE__ */ jsx(ApplicationProvider, { children: /* @__PURE__ */ jsxs(Layout, { children: [
        error && /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4", children: /* @__PURE__ */ jsx(Alert, { variant: "error", onClose: () => {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("error");
          window.history.replaceState({}, "", newUrl.toString());
        }, children: decodeURIComponent(error) }) }),
        /* @__PURE__ */ jsx(Outlet, {})
      ] }) }) }) }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `window.ENV = ${JSON.stringify(ENV2)}`
          }
        }
      ),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function ErrorBoundary({ error }) {
  const errorMessage = (error == null ? void 0 : error.message) || "An unexpected error occurred";
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("title", { children: "Error - GetHired!" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "flex h-full flex-col items-center justify-center bg-white text-slate-900", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold", children: "Oops! Something went wrong" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-600", children: errorMessage }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "a",
          {
            href: "/",
            className: "text-blue-600 hover:text-blue-700",
            children: "Go back home →"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: App,
  links,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
function isValidObjectId$3(id) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    console.error("Invalid ObjectId:", id, error);
    return false;
  }
}
function mapDocumentToResponse(doc) {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    name: doc.name,
    type: doc.type,
    content: doc.content,
    uploadedAt: doc.uploadedAt
  };
}
async function getDocuments(userId) {
  console.log("Getting documents for user:", userId);
  if (!isValidObjectId$3(userId)) {
    console.error("Invalid user ID format:", userId);
    return [];
  }
  try {
    const db2 = await getDb();
    const documents = await db2.db().collection("documents").find({ userId: new ObjectId(userId) }).sort({ uploadedAt: -1 }).toArray();
    console.log(`Found ${documents.length} documents for user ${userId}`);
    return documents.map(mapDocumentToResponse);
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
}
async function getDocumentsByType(type, userId) {
  console.log("Getting documents by type:", type, "for user:", userId);
  if (!isValidObjectId$3(userId)) {
    console.error("Invalid user ID format:", userId);
    return [];
  }
  try {
    const db2 = await getDb();
    const documents = await db2.db().collection("documents").find({
      userId: new ObjectId(userId),
      type
    }).sort({ uploadedAt: -1 }).toArray();
    console.log(`Found ${documents.length} documents of type ${type} for user ${userId}`);
    return documents.map(mapDocumentToResponse);
  } catch (error) {
    console.error("Error getting documents by type:", error);
    throw error;
  }
}
async function createDocument(data) {
  console.log("Creating document:", { name: data.name, type: data.type, userId: data.userId });
  if (!isValidObjectId$3(data.userId)) {
    console.error("Invalid user ID format:", data.userId);
    throw new Error("Invalid user ID format");
  }
  try {
    const db2 = await getDb();
    const doc = {
      userId: new ObjectId(data.userId),
      name: data.name,
      type: data.type,
      content: data.content,
      uploadedAt: /* @__PURE__ */ new Date()
    };
    const result = await db2.db().collection("documents").insertOne(doc);
    console.log("Document created successfully with ID:", result.insertedId);
    return {
      id: result.insertedId.toString(),
      userId: data.userId,
      name: data.name,
      type: data.type,
      content: data.content,
      uploadedAt: doc.uploadedAt
    };
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}
async function getDocument(id, userId) {
  console.log("Getting document:", id, "for user:", userId);
  if (!isValidObjectId$3(id) || !isValidObjectId$3(userId)) {
    console.error("Invalid ID format:", { documentId: id, userId });
    return null;
  }
  try {
    const db2 = await getDb();
    const document2 = await db2.db().collection("documents").findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });
    if (!document2) {
      console.log("Document not found");
      return null;
    }
    console.log("Document found successfully");
    return mapDocumentToResponse(document2);
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is required");
}
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});
async function analyzeResumeWithClaude(resumeContent, jobDescription) {
  const prompt = `You are an expert ATS (Applicant Tracking System) and resume analyzer. Analyze the following resume for the given job description and return ONLY a JSON object matching the specified interface, with no additional text or explanation.

Resume:
${resumeContent}

Job Description:
${jobDescription}

Return a JSON object matching this TypeScript interface, with realistic scores and detailed analysis:

interface ResumeAnalysis {
  score: number; // 0-100
  criteriaScores: {
    keywordMatch: number; // 0-100
    formatting: number; // 0-100
    skillsAlignment: number; // 0-100
    experienceRelevance: number; // 0-100
  };
  analysis: {
    keywordsFound: string[]; // List of important keywords found in resume
    missingKeywords: string[]; // List of important keywords from job description missing in resume
    formattingIssues: string[]; // List of formatting issues found
    strengths: string[]; // List of resume's strengths
    weaknesses: string[]; // List of resume's weaknesses
  };
  recommendations: string[]; // List of specific improvements
  summary: string; // Brief overall assessment
}

Respond ONLY with the JSON object, no other text.`;
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 4e3,
    temperature: 0,
    system: "You are an expert ATS system and resume analyzer. You only respond with valid JSON matching the specified interface, with no additional text.",
    messages: [{ role: "user", content: prompt }]
  });
  const content = response.content[0].type === "text" ? response.content[0].text : "";
  try {
    const analysis = JSON.parse(content);
    return analysis;
  } catch (error) {
    console.error("Error parsing Claude response:", error);
    throw new Error("Failed to parse resume analysis");
  }
}
async function optimizeResumeWithClaude(resumeContent, jobDescription) {
  const prompt = `You are an expert resume writer and ATS optimization specialist. Optimize the following resume for the given job description and return ONLY a JSON object with the specified fields, with no additional text or explanation.

Resume:
${resumeContent}

Job Description:
${jobDescription}

Return a JSON object with these fields (no additional text):
{
  "optimizedContent": string, // The complete optimized resume text
  "expectedScore": number, // Expected ATS score (0-100)
  "changes": string[] // List of specific changes made
}

Respond ONLY with the JSON object, no other text.`;
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 4e3,
    temperature: 0,
    system: "You are an expert resume writer and ATS optimization specialist. You only respond with valid JSON matching the specified format, with no additional text.",
    messages: [{ role: "user", content: prompt }]
  });
  const content = response.content[0].type === "text" ? response.content[0].text : "";
  try {
    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error("Error parsing Claude response:", error);
    throw new Error("Failed to optimize resume");
  }
}
async function chatWithClaude(messages) {
  const systemPrompt = `You are a helpful career advisor and job search assistant. You provide professional advice about:
- Resume writing and optimization
- Job search strategies
- Interview preparation
- Career development
- Professional networking
- Skill development recommendations

Keep responses focused on career-related topics. Be professional, encouraging, and provide actionable advice.`;
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 4e3,
    temperature: 0.7,
    system: systemPrompt,
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content
    }))
  });
  return response.content[0].type === "text" ? response.content[0].text : "";
}
function isValidObjectId$2(id) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}
async function action$5({ request }) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, value] = cookie.split("=");
      return [name, decodeURIComponent(value)];
    })
  );
  const token = cookies.auth_token;
  if (!token) {
    return json(
      { error: "Please sign in to optimize your resume" },
      { status: 401 }
    );
  }
  try {
    const user = await verifyToken(token);
    if (!user) {
      return json(
        { error: "Your session has expired. Please sign in again." },
        { status: 401 }
      );
    }
    const { resumeId, jobDescriptionId } = await request.json();
    if (!resumeId || !jobDescriptionId) {
      return json(
        { error: "Please select both a resume and job description" },
        { status: 400 }
      );
    }
    if (!isValidObjectId$2(resumeId)) {
      return json(
        { error: "Invalid resume ID format. The document might have been deleted." },
        { status: 400 }
      );
    }
    if (!isValidObjectId$2(jobDescriptionId)) {
      return json(
        { error: "Invalid job description ID format. The document might have been deleted." },
        { status: 400 }
      );
    }
    const [resume, jobDescription] = await Promise.all([
      getDocument(resumeId, user.id),
      getDocument(jobDescriptionId, user.id)
    ]);
    if (!resume) {
      return json(
        { error: "Resume not found. It might have been deleted." },
        { status: 404 }
      );
    }
    if (!jobDescription) {
      return json(
        { error: "Job description not found. It might have been deleted." },
        { status: 404 }
      );
    }
    const optimization = await optimizeResumeWithClaude(resume.content, jobDescription.content);
    const optimizedDocument = await createDocument({
      name: `${resume.name} (Optimized)`,
      content: optimization.optimizedContent,
      type: "resume",
      userId: user.id
    });
    return json({
      optimization: {
        ...optimization,
        formattedDocumentId: optimizedDocument.id
      }
    });
  } catch (error) {
    console.error("Error optimizing resume:", error);
    return json(
      { error: error instanceof Error ? error.message : "Failed to optimize resume. Please try again." },
      { status: 500 }
    );
  }
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5
}, Symbol.toStringTag, { value: "Module" }));
function isValidObjectId$1(id) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}
async function formatWithAnthropic(content) {
  var _a, _b;
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key not configured");
  }
  const response = await fetch$1("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": ANTHROPIC_API_KEY
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: `Format this resume to be highly presentable and professional for employers. 
        Follow these guidelines:
        1. Use clear section headers (EXPERIENCE, EDUCATION, SKILLS, etc.)
        2. Add proper spacing between sections
        3. Use bullet points for achievements and responsibilities
        4. Make achievements quantifiable where possible
        5. Ensure consistent formatting throughout
        6. Use professional language
        7. Maintain chronological order in experience and education
        8. Right-align dates
        9. Use clear, concise language
        
        Here's the resume to format:

        ${content}`
      }]
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Anthropic API error:", errorText);
    throw new Error("Failed to format resume with Anthropic");
  }
  const data = await response.json();
  if (!((_b = (_a = data.content) == null ? void 0 : _a[0]) == null ? void 0 : _b.text)) {
    throw new Error("Invalid response from Anthropic");
  }
  return data.content[0].text;
}
function applyProfessionalFormatting(content) {
  let formatted = content.replace(/\n{3,}/g, "\n\n");
  formatted = formatted.replace(
    /^(EDUCATION|EXPERIENCE|SKILLS|PROJECTS|ACHIEVEMENTS|CERTIFICATIONS):/gmi,
    "\n\n$1:\n"
  );
  formatted = formatted.replace(/^[•\-]\s*/gm, "• ");
  formatted = formatted.replace(/^(• .+)$/gm, "    $1");
  formatted = formatted.replace(
    /^(.+?)(\d{4}\s*-\s*(?:\d{4}|present))$/gmi,
    (_, text, date) => `${text.padEnd(60)}${date}`
  );
  formatted = formatted.replace(/^\s+/, "");
  formatted = formatted.replace(/\n{3,}/g, "\n\n");
  return formatted.trim();
}
async function createFormattedDocument(originalDoc, formattedContent) {
  let formattedName = originalDoc.name.replace(/\.(\w+)$/, " (Formatted).$1");
  if (formattedName === originalDoc.name) {
    formattedName = `${originalDoc.name} (Formatted)`;
  }
  return await createDocument({
    name: formattedName,
    type: originalDoc.type,
    content: formattedContent,
    userId: originalDoc.userId
  });
}
async function action$4({ request }) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, value] = cookie.split("=");
      return [name, decodeURIComponent(value)];
    })
  );
  const token = cookies.auth_token;
  if (!token) {
    return json(
      { error: "Please sign in to format your resume" },
      { status: 401 }
    );
  }
  try {
    const user = await verifyToken(token);
    if (!user) {
      return json(
        { error: "Your session has expired. Please sign in again." },
        { status: 401 }
      );
    }
    const { resumeId } = await request.json();
    if (!resumeId) {
      return json(
        { error: "Please select a resume" },
        { status: 400 }
      );
    }
    if (!isValidObjectId$1(resumeId)) {
      return json(
        { error: "Invalid resume ID format. The document might have been deleted." },
        { status: 400 }
      );
    }
    const resume = await getDocument(resumeId, user.id);
    if (!resume) {
      return json(
        { error: "Resume not found. It might have been deleted." },
        { status: 404 }
      );
    }
    const anthropicFormatted = await formatWithAnthropic(resume.content);
    const formattedContent = applyProfessionalFormatting(anthropicFormatted);
    const formattedDoc = await createFormattedDocument(resume, formattedContent);
    return json({
      formatting: {
        formattedContent,
        formattedDocumentId: formattedDoc.id
      }
    });
  } catch (error) {
    console.error("Error formatting resume:", error);
    return json(
      { error: error instanceof Error ? error.message : "Failed to format resume. Please try again." },
      { status: 500 }
    );
  }
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
function isValidObjectId(id) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}
async function action$3({ request }) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, value] = cookie.split("=");
      return [name, decodeURIComponent(value)];
    })
  );
  const token = cookies.auth_token;
  if (!token) {
    return json(
      { error: "Please sign in to analyze documents" },
      { status: 401 }
    );
  }
  try {
    const user = await verifyToken(token);
    if (!user) {
      return json(
        { error: "Your session has expired. Please sign in again." },
        { status: 401 }
      );
    }
    const { resumeId, jobDescriptionId } = await request.json();
    if (!resumeId || !jobDescriptionId) {
      return json(
        { error: "Please select both a resume and job description" },
        { status: 400 }
      );
    }
    if (!isValidObjectId(resumeId)) {
      return json(
        { error: "Invalid resume ID format. The document might have been deleted." },
        { status: 400 }
      );
    }
    if (!isValidObjectId(jobDescriptionId)) {
      return json(
        { error: "Invalid job description ID format. The document might have been deleted." },
        { status: 400 }
      );
    }
    const [resume, jobDescription] = await Promise.all([
      getDocument(resumeId, user.id),
      getDocument(jobDescriptionId, user.id)
    ]);
    if (!resume) {
      return json(
        { error: "Resume not found. It might have been deleted." },
        { status: 404 }
      );
    }
    if (!jobDescription) {
      return json(
        { error: "Job description not found. It might have been deleted." },
        { status: 404 }
      );
    }
    const analysis = await analyzeResumeWithClaude(resume.content, jobDescription.content);
    return json({ analysis });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return json(
      { error: error instanceof Error ? error.message : "Failed to analyze resume. Please try again." },
      { status: 500 }
    );
  }
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
async function generateInterviewResponse(question, resumeContent, jobDescription) {
  var _a, _b;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert interviewee responding to questions based on the following resume and job description. 
          Provide concise, professional responses that highlight relevant experience and skills from the resume.
          
          Resume:
          ${resumeContent}
          
          Job Description:
          ${jobDescription}
          
          Respond as if you are the candidate described in the resume, interviewing for this position.`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    return ((_b = (_a = response.choices[0]) == null ? void 0 : _a.message) == null ? void 0 : _b.content) || "I apologize, but I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating interview response:", error);
    throw new Error("Failed to generate interview response");
  }
}
async function processAudioChunk(chunk) {
  try {
    const response = await openai.audio.transcriptions.create({
      file: new File([chunk], "chunk.wav", { type: "audio/wav" }),
      model: "whisper-1",
      language: "en",
      response_format: "text"
    });
    return response;
  } catch (error) {
    console.error("Error processing audio chunk:", error);
    throw new Error("Failed to process audio chunk");
  }
}
async function action$2({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const formData = await request.formData();
    const audioChunk = formData.get("audio");
    const resumeId = formData.get("resumeId");
    const jobDescriptionId = formData.get("jobDescriptionId");
    const mode2 = formData.get("mode");
    if (!audioChunk) {
      return json({ error: "No audio data provided" }, { status: 400 });
    }
    if (mode2 === "respond" && (!resumeId || !jobDescriptionId)) {
      return json(
        { error: "Resume ID and Job Description ID are required for interview responses" },
        { status: 400 }
      );
    }
    const arrayBuffer = await audioChunk.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const transcription = await processAudioChunk(buffer);
    if (mode2 === "transcribe") {
      return json({ transcription });
    }
    const cookieHeader = request.headers.get("Cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => {
        const [name, value] = cookie.split("=");
        return [name, decodeURIComponent(value)];
      })
    );
    const token = cookies.auth_token;
    if (!token) {
      return json({ error: "Not authenticated" }, { status: 401 });
    }
    const user = await verifyToken(token);
    if (!user) {
      return json({ error: "Invalid authentication" }, { status: 401 });
    }
    const [resume, jobDescription] = await Promise.all([
      getDocument(resumeId, user.id),
      getDocument(jobDescriptionId, user.id)
    ]);
    if (!resume || !jobDescription) {
      return json({ error: "Documents not found" }, { status: 404 });
    }
    const response = await generateInterviewResponse(
      transcription,
      resume.content,
      jobDescription.content
    );
    return json({
      transcription,
      response
    });
  } catch (error) {
    console.error("Error processing voice note:", error);
    return json(
      { error: error instanceof Error ? error.message : "Failed to process voice note" },
      { status: 500 }
    );
  }
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
const variantStyles$4 = {
  default: "bg-white",
  elevated: "bg-white shadow-lg hover:shadow-xl transition-shadow",
  bordered: "bg-white border border-slate-200"
};
function Card({
  variant = "default",
  className = "",
  cardTitle,
  description,
  footer,
  isInteractive = false,
  isSelected = false,
  onClick,
  children,
  ...props
}) {
  const baseStyles = "rounded-lg overflow-hidden";
  const interactiveStyles = isInteractive ? "cursor-pointer hover:bg-slate-50 transition-colors" : "";
  const selectedStyles = isSelected ? "ring-2 ring-blue-500 ring-offset-2" : "";
  const styles = `${baseStyles} ${variantStyles$4[variant]} ${interactiveStyles} ${selectedStyles} ${className}`;
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    (cardTitle || description) && /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      cardTitle && /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-slate-900", children: cardTitle }),
      description && /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm text-slate-600", children: description })
    ] }),
    children && /* @__PURE__ */ jsx("div", { className: `${cardTitle || description ? "" : "p-6"}`, children }),
    footer && /* @__PURE__ */ jsx("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-200", children: footer })
  ] });
  if (isInteractive) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick == null ? void 0 : onClick();
          }
        },
        className: styles,
        "aria-pressed": isSelected,
        ...props,
        children: content
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: styles, ...props, children: content });
}
const variantStyles$3 = {
  default: "bg-white border border-slate-300 focus:border-blue-500",
  filled: "bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500"
};
const sizeStyles$4 = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-4 py-3 text-lg"
};
const validationStyles$2 = {
  valid: "border-green-500 focus:border-green-500",
  invalid: "border-red-500 focus:border-red-500",
  none: ""
};
const Select = forwardRef(({
  label,
  helperText,
  errorText,
  variant = "default",
  size = "md",
  fullWidth = false,
  validation = "none",
  options,
  placeholder,
  containerClassName = "",
  selectClassName = "",
  labelClassName = "",
  helperTextClassName = "",
  errorTextClassName = "",
  id,
  disabled,
  required,
  value,
  defaultValue,
  onChange,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = validation === "invalid" || Boolean(errorText);
  const baseSelectStyles = `
    block rounded-md 
    text-slate-900
    appearance-none bg-no-repeat bg-right
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
    pr-10
  `;
  const widthStyles = fullWidth ? "w-full" : "";
  const selectStyles = `
    ${baseSelectStyles}
    ${variantStyles$3[variant]}
    ${sizeStyles$4[size]}
    ${validationStyles$2[validation]}
    ${widthStyles}
    ${selectClassName}
  `;
  const ariaProps = {
    "aria-invalid": hasError,
    "aria-describedby": hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : void 0
  };
  return /* @__PURE__ */ jsxs("div", { className: `${fullWidth ? "w-full" : ""} ${containerClassName}`, children: [
    label && /* @__PURE__ */ jsxs(
      "label",
      {
        htmlFor: selectId,
        className: `block text-sm font-medium text-slate-700 mb-1 ${labelClassName}`,
        children: [
          label,
          required && /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs(
        "select",
        {
          ...props,
          ...ariaProps,
          ref,
          id: selectId,
          disabled,
          required,
          value,
          defaultValue,
          onChange,
          className: selectStyles,
          children: [
            placeholder && /* @__PURE__ */ jsx("option", { value: "", disabled: true, className: "text-slate-500", children: placeholder }),
            options.map((option) => /* @__PURE__ */ jsx(
              "option",
              {
                value: option.value,
                disabled: option.disabled,
                className: option.disabled ? "text-slate-400" : "",
                children: option.label
              },
              option.value
            ))
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500", children: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "h-5 w-5",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              fillRule: "evenodd",
              d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
              clipRule: "evenodd"
            }
          )
        }
      ) })
    ] }),
    (helperText || errorText) && /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
      helperText && !hasError && /* @__PURE__ */ jsx(
        "p",
        {
          id: `${selectId}-helper`,
          className: `text-sm text-slate-600 ${helperTextClassName}`,
          children: helperText
        }
      ),
      errorText && /* @__PURE__ */ jsx(
        "p",
        {
          id: `${selectId}-error`,
          className: `text-sm text-red-500 ${errorTextClassName}`,
          role: "alert",
          children: errorText
        }
      )
    ] })
  ] });
});
Select.displayName = "Select";
const sizeStyles$3 = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl"
};
function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  initialFocus = true
}) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = "hidden";
      if (initialFocus && modalRef.current) {
        modalRef.current.focus();
      }
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        var _a;
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
        (_a = previousActiveElement.current) == null ? void 0 : _a.focus();
      };
    }
  }, [isOpen, onClose, initialFocus]);
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  };
  if (!isOpen) return null;
  const modalContent = /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 overflow-y-auto",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "modal-title",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: overlayRef,
            className: "fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn",
            onClick: handleOverlayClick,
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
          "div",
          {
            ref: modalRef,
            className: `${sizeStyles$3[size]} w-full relative bg-slate-800 rounded-lg shadow-xl animate-slideIn`,
            tabIndex: -1,
            role: "dialog",
            "aria-labelledby": "modal-title",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-700", children: [
                /* @__PURE__ */ jsx(
                  "h2",
                  {
                    id: "modal-title",
                    className: "text-lg font-medium text-white",
                    children: title
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "absolute top-4 right-4 text-slate-400 hover:text-slate-300 transition-colors",
                    onClick: onClose,
                    "aria-label": "Close modal",
                    children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "h-6 w-6",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "aria-hidden": "true",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M6 18L18 6M6 6l12 12"
                          }
                        )
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "px-6 py-4", children }),
              footer && /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-t border-slate-700 bg-slate-800/50", children: footer })
            ]
          }
        ) })
      ]
    }
  );
  return createPortal(
    modalContent,
    document.body
  );
}
function ResumeAnalysis({ resumes, jobDescriptions, onUpdate }) {
  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [error, setError] = useState(null);
  const handleAnalyze = async (resumeId) => {
    const idToAnalyze = resumeId || selectedResume;
    if (!idToAnalyze || !selectedJob) {
      setError("Please select both a resume and a job description");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch("/api/resume-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          resumeId: idToAnalyze,
          jobDescriptionId: selectedJob
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }
      setAnalysis(data.analysis);
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to analyze resume");
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleOptimize = async () => {
    if (!selectedResume || !selectedJob) {
      setError("Please select both a resume and a job description");
      return;
    }
    setIsOptimizing(true);
    setError(null);
    try {
      const optimizeResponse = await fetch("/api/resume-analysis/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          resumeId: selectedResume,
          jobDescriptionId: selectedJob
        })
      });
      const optimizeData = await optimizeResponse.json();
      if (!optimizeResponse.ok) {
        throw new Error(optimizeData.error || "Failed to optimize resume");
      }
      setOptimization(optimizeData.optimization);
      const newResumeId = optimizeData.optimization.formattedDocumentId;
      setSelectedResume(newResumeId);
      onUpdate == null ? void 0 : onUpdate();
      await handleAnalyze(newResumeId);
      setShowOptimizationModal(true);
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to optimize resume");
      setOptimization(null);
    } finally {
      setIsOptimizing(false);
    }
  };
  const handleExport = async (format) => {
    var _a;
    if (!selectedResume) {
      setError("Please select a resume");
      return;
    }
    setIsExporting(true);
    setError(null);
    try {
      const response = await fetch("/api/documents/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          documentId: selectedResume,
          format,
          score: analysis == null ? void 0 : analysis.score,
          analysis: analysis ? {
            keywordsFound: analysis.analysis.keywordsFound,
            missingKeywords: analysis.analysis.missingKeywords,
            recommendations: analysis.recommendations,
            summary: analysis.summary
          } : void 0
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to export resume");
      }
      const contentDisposition = response.headers.get("Content-Disposition");
      const fileName = ((_a = contentDisposition == null ? void 0 : contentDisposition.split("filename=")[1]) == null ? void 0 : _a.replace(/"/g, "")) || `resume.${format}`;
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to export resume");
    } finally {
      setIsExporting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { variant: "bordered", className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Resume Analysis" }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          Select,
          {
            label: "Select Resume",
            value: selectedResume,
            onChange: (e) => {
              setSelectedResume(e.target.value);
              setAnalysis(null);
              setError(null);
            },
            options: [
              { value: "", label: "Select a resume..." },
              ...resumes.map((resume) => ({
                value: resume.id,
                label: resume.name
              }))
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: "Select Job Description",
            value: selectedJob,
            onChange: (e) => {
              setSelectedJob(e.target.value);
              setAnalysis(null);
              setError(null);
            },
            options: [
              { value: "", label: "Select a job description..." },
              ...jobDescriptions.map((job) => ({
                value: job.id,
                label: job.name
              }))
            ]
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Alert, { variant: "error", onClose: () => setError(null), children: error }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => handleAnalyze(),
            isLoading: isAnalyzing,
            disabled: !selectedResume || !selectedJob || isAnalyzing,
            children: isAnalyzing ? "Analyzing..." : "Analyze Resume"
          }
        ),
        analysis && analysis.score < 90 && /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleOptimize,
            isLoading: isOptimizing,
            variant: "secondary",
            disabled: !selectedResume || !selectedJob || isOptimizing,
            children: isOptimizing ? "Optimizing..." : "Optimize Resume"
          }
        ),
        selectedResume && analysis && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => handleExport("txt"),
              isLoading: isExporting,
              variant: "secondary",
              disabled: !selectedResume || isExporting,
              children: "Export TXT"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => handleExport("pdf"),
              isLoading: isExporting,
              variant: "secondary",
              disabled: !selectedResume || isExporting,
              children: "Export PDF"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => handleExport("docx"),
              isLoading: isExporting,
              variant: "secondary",
              disabled: !selectedResume || isExporting,
              children: "Export DOCX"
            }
          )
        ] })
      ] })
    ] }),
    analysis && /* @__PURE__ */ jsx(Card, { variant: "bordered", className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Overall Score" }),
        /* @__PURE__ */ jsxs("div", { className: `text-3xl font-bold ${analysis.score >= 90 ? "text-green-600" : "text-blue-600"}`, children: [
          analysis.score,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Score Breakdown" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: Object.entries(analysis.criteriaScores).map(([key, score]) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "capitalize", children: key.replace(/([A-Z])/g, " $1").trim() }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            score,
            "%"
          ] })
        ] }, key)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Keywords Found" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1", children: analysis.analysis.keywordsFound.map((keyword, index) => /* @__PURE__ */ jsx("li", { className: "text-green-600", children: keyword }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Missing Keywords" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1", children: analysis.analysis.missingKeywords.map((keyword, index) => /* @__PURE__ */ jsx("li", { className: "text-red-600", children: keyword }, index)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Strengths" }),
        /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1", children: analysis.analysis.strengths.map((strength, index) => /* @__PURE__ */ jsx("li", { className: "text-green-600", children: strength }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Weaknesses" }),
        /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1", children: analysis.analysis.weaknesses.map((weakness, index) => /* @__PURE__ */ jsx("li", { className: "text-red-600", children: weakness }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Recommendations" }),
        /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-2", children: analysis.recommendations.map((rec, index) => /* @__PURE__ */ jsx("li", { children: rec }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Summary" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700", children: analysis.summary })
      ] })
    ] }) }),
    showOptimizationModal && optimization && /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: showOptimizationModal,
        onClose: () => setShowOptimizationModal(false),
        title: "Optimized Resume",
        children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Expected Score" }),
            /* @__PURE__ */ jsxs("span", { className: "text-2xl font-bold text-green-600", children: [
              optimization.expectedScore,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Changes Made" }),
            /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-2", children: optimization.changes.map((change, index) => /* @__PURE__ */ jsx("li", { children: change }, index)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Optimized Content" }),
            /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto", children: /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap font-mono text-sm", children: optimization.optimizedContent }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4 mt-6", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "secondary",
                onClick: () => setShowOptimizationModal(false),
                children: "Close"
              }
            ),
            /* @__PURE__ */ jsx(Button, { onClick: () => {
              setShowOptimizationModal(false);
              handleExport("docx");
            }, children: "Export DOCX" })
          ] })
        ] })
      }
    )
  ] });
}
function serializeDocument(doc) {
  return {
    ...doc,
    uploadedAt: doc.uploadedAt.toISOString()
  };
}
async function loader$3({ request }) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, value] = cookie.split("=");
      return [name, decodeURIComponent(value)];
    })
  );
  const token = cookies.auth_token;
  if (!token) {
    return json(
      {
        resumes: [],
        jobDescriptions: [],
        error: "Please sign in to use this feature"
      },
      { status: 401 }
    );
  }
  try {
    const user = await verifyToken(token);
    if (!user) {
      return json(
        {
          resumes: [],
          jobDescriptions: [],
          error: "Please sign in to use this feature"
        },
        { status: 401 }
      );
    }
    const [resumes, jobDescriptions] = await Promise.all([
      getDocumentsByType("resume", user.id),
      getDocumentsByType("job_description", user.id)
    ]);
    return json({
      resumes: resumes.map(serializeDocument),
      jobDescriptions: jobDescriptions.map(serializeDocument),
      error: null
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return json({
      resumes: [],
      jobDescriptions: [],
      error: "Failed to load documents"
    });
  }
}
function ResumeAnalysisPage() {
  const { resumes, jobDescriptions, error } = useLoaderData();
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-red-600 mb-4", children: "Error" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: error })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-6", children: "Resume Analysis" }),
    resumes.length === 0 || jobDescriptions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "No Documents Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "Please upload at least one resume and one job description to use this feature." }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/documents",
          className: "text-blue-600 hover:text-blue-700",
          children: "Go to Documents →"
        }
      )
    ] }) : /* @__PURE__ */ jsx(
      ResumeAnalysis,
      {
        resumes,
        jobDescriptions
      }
    )
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ResumeAnalysisPage,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return redirect("/?error=No authorization code provided");
  }
  try {
    const { token } = await authenticateWithGoogle(code);
    return redirect("/", {
      headers: {
        "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax`
      }
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return redirect(
      `/?error=${encodeURIComponent(
        "Failed to authenticate with Google. Please try again."
      )}`
    );
  }
}
function AuthCallback() {
  return null;
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AuthCallback,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const variantStyles$2 = {
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-700",
  default: "bg-slate-100 text-slate-700"
};
const dotStyles = {
  info: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
  default: "bg-slate-500"
};
const sizeStyles$2 = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base"
};
const dotSizeStyles = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5"
};
function Badge({
  variant = "default",
  size = "md",
  className = "",
  withDot = false,
  isAnimated = false,
  children,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-colors duration-200";
  const animationStyles = isAnimated ? "animate-pulse" : "";
  const styles = `${baseStyles} ${variantStyles$2[variant]} ${sizeStyles$2[size]} ${animationStyles} ${className}`;
  return /* @__PURE__ */ jsxs("span", { className: styles, ...props, children: [
    withDot && /* @__PURE__ */ jsx(
      "span",
      {
        className: `${dotSizeStyles[size]} rounded-full ${dotStyles[variant]} mr-1.5 transition-colors duration-200`,
        "aria-hidden": "true"
      }
    ),
    children
  ] });
}
const variantStyles$1 = {
  default: "bg-white border border-slate-300 focus:border-blue-500",
  filled: "bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500"
};
const sizeStyles$1 = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-4 py-3 text-lg"
};
const validationStyles$1 = {
  valid: "border-green-500 focus:border-green-500",
  invalid: "border-red-500 focus:border-red-500",
  none: ""
};
const iconSizeStyles = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6"
};
const Input = forwardRef(({
  label,
  helperText,
  errorText,
  variant = "default",
  size = "md",
  fullWidth = false,
  validation = "none",
  leftIcon,
  rightIcon,
  containerClassName = "",
  inputClassName = "",
  labelClassName = "",
  helperTextClassName = "",
  errorTextClassName = "",
  id,
  disabled,
  required,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = validation === "invalid" || Boolean(errorText);
  const baseInputStyles = `
    block rounded-md 
    text-slate-900
    placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `;
  const widthStyles = fullWidth ? "w-full" : "";
  const iconPaddingLeft = leftIcon ? "pl-10" : "";
  const iconPaddingRight = rightIcon ? "pr-10" : "";
  const inputStyles = `
    ${baseInputStyles}
    ${variantStyles$1[variant]}
    ${sizeStyles$1[size]}
    ${validationStyles$1[validation]}
    ${widthStyles}
    ${iconPaddingLeft}
    ${iconPaddingRight}
    ${inputClassName}
  `;
  const ariaProps = {
    "aria-invalid": hasError,
    "aria-describedby": hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : void 0
  };
  return /* @__PURE__ */ jsxs("div", { className: `${fullWidth ? "w-full" : ""} ${containerClassName}`, children: [
    label && /* @__PURE__ */ jsxs(
      "label",
      {
        htmlFor: inputId,
        className: `block text-sm font-medium text-slate-700 mb-1 ${labelClassName}`,
        children: [
          label,
          required && /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      leftIcon && /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500", children: /* @__PURE__ */ jsx("span", { className: iconSizeStyles[size], children: leftIcon }) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ...props,
          ...ariaProps,
          ref,
          id: inputId,
          disabled,
          required,
          className: inputStyles
        }
      ),
      rightIcon && /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500", children: /* @__PURE__ */ jsx("span", { className: iconSizeStyles[size], children: rightIcon }) })
    ] }),
    (helperText || errorText) && /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
      helperText && !hasError && /* @__PURE__ */ jsx(
        "p",
        {
          id: `${inputId}-helper`,
          className: `text-sm text-slate-600 ${helperTextClassName}`,
          children: helperText
        }
      ),
      errorText && /* @__PURE__ */ jsx(
        "p",
        {
          id: `${inputId}-error`,
          className: `text-sm text-red-500 ${errorTextClassName}`,
          role: "alert",
          children: errorText
        }
      )
    ] })
  ] });
});
Input.displayName = "Input";
const variantStyles = {
  default: "bg-white border border-slate-300 focus:border-blue-500",
  filled: "bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500"
};
const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-4 py-3 text-lg"
};
const validationStyles = {
  valid: "border-green-500 focus:border-green-500",
  invalid: "border-red-500 focus:border-red-500",
  none: ""
};
const Textarea = forwardRef(({
  label,
  helperText,
  errorText,
  variant = "default",
  size = "md",
  fullWidth = false,
  validation = "none",
  containerClassName = "",
  textareaClassName = "",
  labelClassName = "",
  helperTextClassName = "",
  errorTextClassName = "",
  id,
  disabled,
  required,
  autoResize = false,
  maxRows = 10,
  rows = 3,
  onChange,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = validation === "invalid" || Boolean(errorText);
  const baseTextareaStyles = `
    block rounded-md 
    text-slate-900
    placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
    resize-none
  `;
  const widthStyles = fullWidth ? "w-full" : "";
  const textareaStyles = `
    ${baseTextareaStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${validationStyles[validation]}
    ${widthStyles}
    ${textareaClassName}
  `;
  const ariaProps = {
    "aria-invalid": hasError,
    "aria-describedby": hasError ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : void 0
  };
  const handleChange = (e) => {
    if (autoResize) {
      e.target.style.height = "auto";
      const newHeight = Math.min(e.target.scrollHeight, maxRows * 24);
      e.target.style.height = `${newHeight}px`;
    }
    onChange == null ? void 0 : onChange(e);
  };
  return /* @__PURE__ */ jsxs("div", { className: `${fullWidth ? "w-full" : ""} ${containerClassName}`, children: [
    label && /* @__PURE__ */ jsxs(
      "label",
      {
        htmlFor: textareaId,
        className: `block text-sm font-medium text-slate-700 mb-1 ${labelClassName}`,
        children: [
          label,
          required && /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        ...props,
        ...ariaProps,
        ref,
        id: textareaId,
        disabled,
        required,
        rows,
        onChange: handleChange,
        className: textareaStyles
      }
    ),
    (helperText || errorText) && /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
      helperText && !hasError && /* @__PURE__ */ jsx(
        "p",
        {
          id: `${textareaId}-helper`,
          className: `text-sm text-slate-600 ${helperTextClassName}`,
          children: helperText
        }
      ),
      errorText && /* @__PURE__ */ jsx(
        "p",
        {
          id: `${textareaId}-error`,
          className: `text-sm text-red-500 ${errorTextClassName}`,
          role: "alert",
          children: errorText
        }
      )
    ] })
  ] });
});
Textarea.displayName = "Textarea";
function EmptyState({ title, description, action: action2 }) {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600 dark:text-slate-400", children: description }),
    action2 && /* @__PURE__ */ jsx("div", { className: "mt-6", children: action2 })
  ] }) });
}
const APPLICATION_STATUS = {
  Applied: "Applied",
  Interview: "Interview",
  Offer: "Offer",
  Rejected: "Rejected"
};
function formatDate(date, format = "short") {
  const dateObj = new Date(date);
  if (format === "short") {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function Applications() {
  const { dispatch, getFilteredAndSortedApplications } = useApplicationContext();
  const { addNotification } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const applications = getFilteredAndSortedApplications();
  const handleAddApplication = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newApplication = {
      id: crypto.randomUUID(),
      company: formData.get("company"),
      position: formData.get("position"),
      status: formData.get("status"),
      dateApplied: formData.get("dateApplied"),
      location: formData.get("location"),
      salary: formData.get("salary"),
      description: formData.get("description"),
      notes: formData.get("notes"),
      url: formData.get("url"),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    dispatch({ type: "ADD_APPLICATION", payload: newApplication });
    addNotification("success", "Success!", "Application added successfully");
    setIsModalOpen(false);
  };
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };
  const getBadgeVariant = (status) => {
    switch (status) {
      case APPLICATION_STATUS.Applied:
        return "default";
      case APPLICATION_STATUS.Interview:
        return "warning";
      case APPLICATION_STATUS.Offer:
        return "success";
      case APPLICATION_STATUS.Rejected:
        return "error";
      default:
        return "default";
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Applications" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Track and manage your job applications" })
      ] }),
      /* @__PURE__ */ jsx(Button, { onClick: () => setIsModalOpen(true), children: "Add Application" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Search",
          placeholder: "Search by company or position...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx(
        Select,
        {
          label: "Status",
          multiple: true,
          value: selectedStatus,
          onChange: handleStatusChange,
          options: Object.values(APPLICATION_STATUS).map((status) => ({
            label: status,
            value: status
          }))
        }
      )
    ] }),
    applications.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "No applications yet",
        description: "Start tracking your job applications by clicking the button below.",
        action: /* @__PURE__ */ jsx(Button, { onClick: () => setIsModalOpen(true), children: "Add Application" })
      }
    ) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: applications.map((application) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: application.company }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: application.position })
        ] }),
        /* @__PURE__ */ jsx(Badge, { variant: getBadgeVariant(application.status), children: application.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-600 dark:text-slate-400", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Applied: ",
          formatDate(application.dateApplied)
        ] }),
        application.location && /* @__PURE__ */ jsxs("p", { children: [
          "Location: ",
          application.location
        ] }),
        application.salary && /* @__PURE__ */ jsxs("p", { children: [
          "Salary: ",
          application.salary
        ] })
      ] }),
      application.description && /* @__PURE__ */ jsx("p", { className: "text-sm", children: application.description }),
      application.url && /* @__PURE__ */ jsx(
        "a",
        {
          href: application.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400",
          children: "View Job Posting →"
        }
      )
    ] }) }, application.id)) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        title: "Add Application",
        children: /* @__PURE__ */ jsxs("form", { onSubmit: handleAddApplication, className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Company",
              name: "company",
              required: true,
              placeholder: "Enter company name"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Position",
              name: "position",
              required: true,
              placeholder: "Enter job position"
            }
          ),
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Status",
              name: "status",
              required: true,
              options: Object.values(APPLICATION_STATUS).map((status) => ({
                label: status,
                value: status
              }))
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Date Applied",
              name: "dateApplied",
              type: "date",
              required: true,
              defaultValue: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Location",
              name: "location",
              placeholder: "Enter job location"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Salary",
              name: "salary",
              placeholder: "Enter salary range"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Job URL",
              name: "url",
              type: "url",
              placeholder: "Enter job posting URL"
            }
          ),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              label: "Description",
              name: "description",
              placeholder: "Enter job description"
            }
          ),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              label: "Notes",
              name: "notes",
              placeholder: "Enter any additional notes"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "secondary",
                onClick: () => setIsModalOpen(false),
                type: "button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(Button, { type: "submit", children: "Add Application" })
          ] })
        ] })
      }
    )
  ] });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Applications
}, Symbol.toStringTag, { value: "Module" }));
async function action$1({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      }
    }
  );
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
function AudioRecorder({ resumes, jobDescriptions }) {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [transcription, setTranscription] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasMediaSupport, setHasMediaSupport] = useState(true);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const processingTimeoutRef = useRef(null);
  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setHasMediaSupport(false);
      setError("Your browser doesn't support audio recording. Please use a modern browser like Chrome, Firefox, or Edge.");
      return;
    }
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      setHasMediaSupport(false);
      setError("Audio recording requires a secure connection (HTTPS). Please access this site over HTTPS.");
      return;
    }
  }, []);
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording]);
  const processAudioChunk2 = async (chunk) => {
    const formData = new FormData();
    formData.append("audio", chunk);
    formData.append("mode", "respond");
    formData.append("resumeId", selectedResume);
    formData.append("jobDescriptionId", selectedJob);
    try {
      const response2 = await fetch("/api/voice-notes", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      if (!response2.ok) {
        throw new Error("Failed to process audio");
      }
      const result = await response2.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setTranscription((prev) => prev + " " + result.transcription);
      if (result.response) {
        setResponse(result.response);
      }
    } catch (error2) {
      console.error("Error processing audio:", error2);
      setError(error2 instanceof Error ? error2.message : "Failed to process audio");
    }
  };
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error2) {
      if (error2 instanceof Error) {
        if (error2.name === "NotAllowedError" || error2.name === "PermissionDeniedError") {
          setError("Microphone access was denied. Please allow microphone access in your browser settings and try again.");
        } else if (error2.name === "NotFoundError" || error2.name === "DevicesNotFoundError") {
          setError("No microphone found. Please connect a microphone and try again.");
        } else {
          setError("Error accessing microphone: " + error2.message);
        }
      }
      return false;
    }
  };
  const startRecording = async () => {
    if (!selectedResume || !selectedJob) {
      setError("Please select both a resume and job description");
      return;
    }
    if (!hasMediaSupport) {
      return;
    }
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      return;
    }
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4"
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = async (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          await processAudioChunk2(e.data);
        }
      };
      mediaRecorder.start(3e3);
      setIsRecording(true);
      setTranscription("");
      setResponse("");
    } catch (error2) {
      console.error("Error accessing microphone:", error2);
      if (error2 instanceof Error) {
        if (error2.name === "NotAllowedError" || error2.name === "PermissionDeniedError") {
          setError("Microphone access was denied. Please allow microphone access in your browser settings and try again.");
        } else if (error2.name === "NotFoundError" || error2.name === "DevicesNotFoundError") {
          setError("No microphone found. Please connect a microphone and try again.");
        } else {
          setError("Error accessing microphone: " + error2.message);
        }
      } else {
        setError("Could not access microphone. Please check permissions.");
      }
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(Card, { variant: "bordered", className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Interview Practice" }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          Select,
          {
            label: "Select Resume",
            value: selectedResume,
            onChange: (e) => setSelectedResume(e.target.value),
            options: [
              { value: "", label: "Select a resume..." },
              ...resumes.map((resume) => ({
                value: resume.id,
                label: resume.name
              }))
            ],
            disabled: isRecording
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: "Select Job Description",
            value: selectedJob,
            onChange: (e) => setSelectedJob(e.target.value),
            options: [
              { value: "", label: "Select a job description..." },
              ...jobDescriptions.map((job) => ({
                value: job.id,
                label: job.name
              }))
            ],
            disabled: isRecording
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxs("div", { className: "text-red-600 text-sm bg-red-50 p-3 rounded-md", children: [
        error,
        error.includes("microphone access") && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsx("strong", { children: "How to fix:" }),
          /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside mt-1", children: [
            /* @__PURE__ */ jsx("li", { children: "Click the camera/microphone icon in your browser's address bar" }),
            /* @__PURE__ */ jsx("li", { children: 'Select "Allow" for microphone access' }),
            /* @__PURE__ */ jsx("li", { children: "Refresh the page and try again" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsx(
        Button,
        {
          onClick: isRecording ? stopRecording : startRecording,
          variant: isRecording ? "outline" : "primary",
          className: "flex items-center gap-2",
          disabled: !hasMediaSupport || !selectedResume || !selectedJob || isProcessing,
          children: isRecording ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(StopIcon, { className: "h-5 w-5" }),
            "Stop Recording"
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(MicrophoneIcon, { className: "h-5 w-5" }),
            "Start Recording"
          ] })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { variant: "bordered", className: "p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Question Transcription" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            value: transcription,
            onChange: () => {
            },
            placeholder: "Question transcription will appear here...",
            textareaClassName: "h-[200px]",
            readOnly: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Card, { variant: "bordered", className: "p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "AI Response" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            value: response,
            onChange: () => {
            },
            placeholder: "AI response will appear here...",
            textareaClassName: "h-[200px]",
            readOnly: true
          }
        )
      ] })
    ] })
  ] });
}
async function loader$1({ request }) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, value] = cookie.split("=");
      return [name, decodeURIComponent(value)];
    })
  );
  const token = cookies.auth_token;
  if (!token) {
    return json({
      error: "Please log in to use this feature",
      resumes: [],
      jobDescriptions: []
    });
  }
  try {
    const user = await verifyToken(token);
    if (!user) {
      return json({
        error: "Invalid authentication",
        resumes: [],
        jobDescriptions: []
      });
    }
    const resumeType = "resume";
    const jobDescriptionType = "job_description";
    const [resumes, jobDescriptions] = await Promise.all([
      getDocumentsByType(resumeType, user.id),
      getDocumentsByType(jobDescriptionType, user.id)
    ]);
    return json({
      error: null,
      resumes: resumes.map(serializeDocument),
      jobDescriptions: jobDescriptions.map(serializeDocument)
    });
  } catch (error) {
    console.error("Error loading documents:", error);
    return json({
      error: "Failed to load documents",
      resumes: [],
      jobDescriptions: []
    });
  }
}
function VoiceNotes() {
  const { error, resumes, jobDescriptions } = useLoaderData();
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-red-600 mb-4", children: "Error" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: error })
    ] }) });
  }
  if (resumes.length === 0 || jobDescriptions.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-4", children: "Interview Practice" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: resumes.length === 0 ? "Please upload a resume to use this feature." : "Please upload a job description to use this feature." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-2", children: "Interview Practice" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Practice your interview skills with AI-powered feedback. Select a resume and job description, then start speaking to receive real-time transcription and contextual responses." })
    ] }),
    /* @__PURE__ */ jsx(
      AudioRecorder,
      {
        resumes,
        jobDescriptions
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 text-sm text-gray-500", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-medium mb-2", children: "Tips:" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1", children: [
        /* @__PURE__ */ jsx("li", { children: "Speak clearly and at a normal pace" }),
        /* @__PURE__ */ jsx("li", { children: "Use a quiet environment for better transcription" }),
        /* @__PURE__ */ jsx("li", { children: "Wait for the AI response before asking your next question" }),
        /* @__PURE__ */ jsx("li", { children: "Try to ask specific, job-related questions" })
      ] })
    ] })
  ] });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: VoiceNotes,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function useAuthenticatedFetch() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/?error=Please%20log%20in%20to%20continue");
    }
  }, [user, navigate]);
  return async (input, init) => {
    try {
      if (!isAuthenticated) {
        navigate("/?error=Please%20log%20in%20to%20continue");
        throw new Error("Not authenticated");
      }
      const response = await fetch(input, {
        ...init,
        credentials: "include",
        headers: {
          ...init == null ? void 0 : init.headers,
          "Accept": "application/json"
        }
      });
      if (response.status === 401) {
        navigate("/?error=Session%20expired.%20Please%20log%20in%20again");
        throw new Error("Unauthorized");
      }
      return response;
    } catch (error) {
      if (error instanceof Error && error.message === "Not authenticated") {
        throw error;
      }
      console.error("Request failed:", error);
      throw new Error("Failed to make request");
    }
  };
}
async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, value] = cookie.split("=");
      return [name, decodeURIComponent(value)];
    })
  );
  const token = cookies.auth_token;
  if (!token) {
    return json(
      { documents: [], error: "Please sign in to view documents" },
      { status: 401 }
    );
  }
  try {
    const user = await verifyToken(token);
    if (!user) {
      return json(
        { documents: [], error: "Please sign in to view documents" },
        { status: 401 }
      );
    }
    const documents = await getDocuments(user.id);
    return json(
      {
        documents: documents.map(serializeDocument),
        error: null
      }
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    return json(
      { documents: [], error: "Failed to load documents" },
      { status: 500 }
    );
  }
}
function Documents() {
  const { documents, error: loaderError } = useLoaderData();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [docType, setDocType] = useState("resume");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const revalidator = useRevalidator();
  const authenticatedFetch = useAuthenticatedFetch();
  if (loaderError) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-red-600 mb-4", children: "Error" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: loaderError })
    ] }) });
  }
  const handleFileChange = (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", docType);
    try {
      const response = await authenticatedFetch("/api/documents/upload", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        const data2 = await response.json();
        throw new Error(data2.error || "Failed to upload document");
      }
      const data = await response.json();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFile(null);
      setShowUploadModal(false);
      revalidator.revalidate();
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await authenticatedFetch(`/api/documents/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const data2 = await response.json();
        throw new Error(data2.error || "Failed to delete document");
      }
      const data = await response.json();
      if (data.success) {
        revalidator.revalidate();
      } else {
        setError(data.error || "Failed to delete document");
      }
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to delete document");
    }
  };
  const renderDocumentContent = (content, type) => {
    try {
      const decodedContent = atob(content);
      if (type === "application/pdf") {
        return /* @__PURE__ */ jsx(
          "iframe",
          {
            src: `data:application/pdf;base64,${content}`,
            className: "w-full h-[60vh]",
            title: "PDF Document"
          }
        );
      } else {
        return /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap", children: decodedContent });
      }
    } catch {
      return /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap", children: content });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Documents" }),
      /* @__PURE__ */ jsx(Button, { onClick: () => setShowUploadModal(true), children: "Upload Document" })
    ] }),
    error && /* @__PURE__ */ jsx(Alert, { variant: "error", onClose: () => setError(null), children: error }),
    documents.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "No documents",
        description: "Upload your first document to get started",
        action: /* @__PURE__ */ jsx(Button, { onClick: () => setShowUploadModal(true), children: "Upload Document" })
      }
    ) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: documents.map((doc) => /* @__PURE__ */ jsx(
      Card,
      {
        variant: "bordered",
        className: "p-4",
        children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: doc.name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 capitalize", children: doc.type }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: new Date(doc.uploadedAt).toLocaleDateString() })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "secondary",
                onClick: () => setSelectedDoc(doc),
                children: "View"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                onClick: () => {
                  if (window.confirm("Are you sure you want to delete this document?")) {
                    handleDelete(doc.id);
                  }
                },
                children: "Delete"
              }
            )
          ] })
        ] })
      },
      doc.id
    )) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: showUploadModal,
        onClose: () => {
          setShowUploadModal(false);
          setSelectedFile(null);
          setError(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
        title: "Upload Document",
        children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Document Type",
              value: docType,
              onChange: (e) => setDocType(e.target.value),
              options: [
                { value: "resume", label: "Resume" },
                { value: "job_description", label: "Job Description" },
                { value: "cover_letter", label: "Cover Letter" },
                { value: "other", label: "Other" }
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              ref: fileInputRef,
              type: "file",
              accept: ".pdf,.doc,.docx,.txt",
              onChange: handleFileChange,
              disabled: isUploading
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Supported formats: PDF, DOC, DOCX, TXT" }),
          error && /* @__PURE__ */ jsx(Alert, { variant: "error", onClose: () => setError(null), children: error }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                onClick: () => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                },
                disabled: isUploading,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: handleUpload,
                disabled: !selectedFile || isUploading,
                children: isUploading ? "Uploading..." : "Upload"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: !!selectedDoc,
        onClose: () => {
          setSelectedDoc(null);
          setError(null);
        },
        title: (selectedDoc == null ? void 0 : selectedDoc.name) ?? "",
        children: /* @__PURE__ */ jsx("div", { className: "max-h-[60vh] overflow-y-auto", children: selectedDoc && renderDocumentContent(selectedDoc.content, selectedDoc.type) })
      }
    )
  ] });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Documents,
  loader
}, Symbol.toStringTag, { value: "Module" }));
async function action({ request }) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }
  try {
    const body = await request.json();
    console.log("Chat request body:", body);
    if (!body.messages || !Array.isArray(body.messages)) {
      console.error("Chat error: Invalid messages format", body);
      return json(
        { error: "Messages must be an array" },
        { status: 400 }
      );
    }
    const isValidMessage = (msg) => {
      return typeof msg === "object" && msg !== null && (msg.role === "user" || msg.role === "assistant") && typeof msg.content === "string";
    };
    if (!body.messages.every(isValidMessage)) {
      console.error("Chat error: Invalid message format in array", body.messages);
      return json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }
    console.log("Sending messages to Claude:", body.messages);
    const response = await chatWithClaude(body.messages);
    console.log("Claude response:", response);
    if (!response) {
      throw new Error("No response received from Claude");
    }
    return json({ response });
  } catch (error) {
    console.error("Error in chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process chat";
    const errorDetails = error instanceof Error ? error.stack : void 0;
    console.error("Error details:", errorDetails);
    return json(
      {
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
function Index() {
  return /* @__PURE__ */ jsxs("div", { className: "relative isolate", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80",
        "aria-hidden": "true",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-purple-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]",
            style: {
              clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "px-6 py-24 sm:px-6 sm:py-32 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-bold tracking-tight sm:text-6xl", children: [
        "Track Your Job Applications with",
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-blue-600", children: "GetHired!" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg leading-8 text-slate-600", children: "Streamline your job search process with our intuitive application tracking system. Stay organized, never miss a follow-up, and increase your chances of landing your dream job." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 flex items-center justify-center gap-x-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "/applications", children: /* @__PURE__ */ jsx(Button, { size: "lg", children: "Get Started" }) }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "#features",
            className: "text-sm font-semibold leading-6 text-slate-900",
            children: [
              "Learn more ",
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { id: "features", className: "py-24 sm:py-32", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold leading-7 text-blue-600", children: "Features" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight sm:text-4xl", children: "Everything you need to manage your job search" }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg leading-8 text-slate-600", children: "GetHired! provides all the tools you need to organize your job applications, track your progress, and stay on top of your job search journey." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none", children: /* @__PURE__ */ jsxs("dl", { className: "grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxs("dt", { className: "flex items-center gap-x-3 text-base font-semibold leading-7", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "h-5 w-5 flex-none text-blue-600",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  }
                )
              }
            ),
            "Application Tracking"
          ] }),
          /* @__PURE__ */ jsx("dd", { className: "mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600", children: /* @__PURE__ */ jsx("p", { className: "flex-auto", children: "Keep track of all your job applications in one place. Monitor status, important dates, and follow-ups with our intuitive interface." }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxs("dt", { className: "flex items-center gap-x-3 text-base font-semibold leading-7", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "h-5 w-5 flex-none text-blue-600",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  }
                )
              }
            ),
            "Analytics & Insights"
          ] }),
          /* @__PURE__ */ jsx("dd", { className: "mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600", children: /* @__PURE__ */ jsx("p", { className: "flex-auto", children: "Get valuable insights into your job search progress with detailed analytics and statistics to help you improve your strategy." }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxs("dt", { className: "flex items-center gap-x-3 text-base font-semibold leading-7", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "h-5 w-5 flex-none text-blue-600",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  }
                )
              }
            ),
            "Smart Reminders"
          ] }),
          /* @__PURE__ */ jsx("dd", { className: "mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600", children: /* @__PURE__ */ jsx("p", { className: "flex-auto", children: "Never miss an important deadline or follow-up with our smart reminder system that keeps you on track throughout your job search." }) })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-blue-600 to-purple-600",
              style: {
                clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
              }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight sm:text-4xl", children: "Ready to streamline your job search?" }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400", children: "Join thousands of job seekers who have already improved their job search process with GetHired!" }),
        /* @__PURE__ */ jsx("div", { className: "mt-10 flex items-center justify-center gap-x-6", children: /* @__PURE__ */ jsx(Link, { to: "/applications", children: /* @__PURE__ */ jsx(Button, { size: "lg", children: "Start Tracking Now" }) }) })
      ] })
    ] })
  ] });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
function ChatInterface() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hello! I'm your career advisor. I can help you with resume writing, job search strategies, interview preparation, and career development. What would you like assistance with?"
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    var _a;
    (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending chat request with messages:", [...messages, userMessage]);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });
      const data = await response.json();
      console.log("Chat response:", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }
      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.response) {
        throw new Error("No response received from assistant");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response }
      ]);
    } catch (error2) {
      console.error("Chat error:", error2);
      const errorMessage = error2 instanceof Error ? error2.message : "An unexpected error occurred";
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${errorMessage}. Please try again or refresh the page if the problem persists.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Card, { variant: "bordered", className: "h-[calc(100vh-12rem)]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-grow overflow-y-auto p-4 space-y-4", children: [
      messages.map((message, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex ${message.role === "user" ? "justify-end" : "justify-start"}`,
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `max-w-[80%] rounded-lg p-4 ${message.role === "user" ? "bg-blue-600 text-white" : message.content.startsWith("Error:") ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100" : "bg-gray-100 dark:bg-gray-800"}`,
              children: /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap", children: message.content })
            }
          )
        },
        index
      )),
      /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100", children: error }),
    /* @__PURE__ */ jsx("div", { className: "p-4 border-t dark:border-gray-700", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          value: input,
          onChange: (e) => setInput(e.target.value),
          placeholder: isLoading ? "Please wait..." : "Type your message...",
          inputClassName: "flex-grow",
          containerClassName: "flex-grow",
          fullWidth: true,
          disabled: isLoading,
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          disabled: isLoading,
          className: "min-w-[44px] h-[44px] p-2",
          children: /* @__PURE__ */ jsx(PaperAirplaneIcon, { className: "h-5 w-5" })
        }
      )
    ] }) })
  ] }) });
}
const meta = () => {
  return [
    { title: "AI Career Assistant - GetHired" },
    { name: "description", content: "Chat with our AI career assistant for resume and job search help" }
  ];
};
function Chat() {
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-6", children: "AI Career Assistant" }),
    /* @__PURE__ */ jsxs("p", { className: "text-gray-600 dark:text-gray-300 mb-6", children: [
      "Chat with our AI assistant for help with:",
      /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside mt-2 space-y-1", children: [
        /* @__PURE__ */ jsx("li", { children: "Resume writing and optimization" }),
        /* @__PURE__ */ jsx("li", { children: "Job search strategies" }),
        /* @__PURE__ */ jsx("li", { children: "Interview preparation" }),
        /* @__PURE__ */ jsx("li", { children: "Career development advice" }),
        /* @__PURE__ */ jsx("li", { children: "Professional networking tips" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ChatInterface, {})
  ] }) });
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Chat,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function ApiRoute() {
  return null;
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ApiRoute
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-D2x2jnhK.js", "imports": ["/assets/components-BTXmr68H.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-DOdbTdVj.js", "imports": ["/assets/components-BTXmr68H.js", "/assets/ApplicationContext-DY6RkFxv.js", "/assets/AuthContext-BrU48O4c.js", "/assets/MicrophoneIcon-Cx_OqR3y.js", "/assets/Button-BZG3s6SU.js", "/assets/Alert-DdMCfCTw.js"], "css": ["/assets/root-Xn1bqVEP.css"] }, "routes/api.resume-analysis.optimize": { "id": "routes/api.resume-analysis.optimize", "parentId": "routes/api.resume-analysis", "path": "optimize", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.resume-analysis.optimize-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.resume-analysis.format": { "id": "routes/api.resume-analysis.format", "parentId": "routes/api.resume-analysis", "path": "format", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.resume-analysis.format-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.resume-analysis": { "id": "routes/api.resume-analysis", "parentId": "routes/api", "path": "resume-analysis", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.resume-analysis-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.voice-notes": { "id": "routes/api.voice-notes", "parentId": "routes/api", "path": "voice-notes", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.voice-notes-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/resume-analysis": { "id": "routes/resume-analysis", "parentId": "root", "path": "resume-analysis", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/resume-analysis-CDEigplr.js", "imports": ["/assets/components-BTXmr68H.js", "/assets/Card-Cg6ocORJ.js", "/assets/Button-BZG3s6SU.js", "/assets/Select-RG5OTrzS.js", "/assets/Modal-Cd9pgKqa.js", "/assets/Alert-DdMCfCTw.js"], "css": [] }, "routes/auth.callback": { "id": "routes/auth.callback", "parentId": "root", "path": "auth/callback", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth.callback-DtCUJE-g.js", "imports": [], "css": [] }, "routes/applications": { "id": "routes/applications", "parentId": "root", "path": "applications", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/applications-c2pcrKaK.js", "imports": ["/assets/components-BTXmr68H.js", "/assets/ApplicationContext-DY6RkFxv.js", "/assets/Button-BZG3s6SU.js", "/assets/Card-Cg6ocORJ.js", "/assets/Modal-Cd9pgKqa.js", "/assets/Input-8y3g3GgE.js", "/assets/Select-RG5OTrzS.js", "/assets/Textarea-Bh5RDoem.js", "/assets/EmptyState-XxnvsSZc.js", "/assets/Alert-DdMCfCTw.js"], "css": [] }, "routes/auth.signout": { "id": "routes/auth.signout", "parentId": "root", "path": "auth/signout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth.signout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/voice-notes": { "id": "routes/voice-notes", "parentId": "root", "path": "voice-notes", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/voice-notes-DIW_yPb1.js", "imports": ["/assets/components-BTXmr68H.js", "/assets/Button-BZG3s6SU.js", "/assets/Card-Cg6ocORJ.js", "/assets/Select-RG5OTrzS.js", "/assets/Textarea-Bh5RDoem.js", "/assets/MicrophoneIcon-Cx_OqR3y.js"], "css": [] }, "routes/documents": { "id": "routes/documents", "parentId": "root", "path": "documents", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/documents-DVS2VPHJ.js", "imports": ["/assets/components-BTXmr68H.js", "/assets/Card-Cg6ocORJ.js", "/assets/Button-BZG3s6SU.js", "/assets/Input-8y3g3GgE.js", "/assets/Select-RG5OTrzS.js", "/assets/Modal-Cd9pgKqa.js", "/assets/Alert-DdMCfCTw.js", "/assets/EmptyState-XxnvsSZc.js", "/assets/AuthContext-BrU48O4c.js"], "css": [] }, "routes/api.chat": { "id": "routes/api.chat", "parentId": "routes/api", "path": "chat", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.chat-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-JUwUj2_e.js", "imports": ["/assets/components-BTXmr68H.js", "/assets/Button-BZG3s6SU.js"], "css": [] }, "routes/chat": { "id": "routes/chat", "parentId": "root", "path": "chat", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/chat-46frw54p.js", "imports": ["/assets/components-BTXmr68H.js", "/assets/Card-Cg6ocORJ.js", "/assets/Button-BZG3s6SU.js", "/assets/Input-8y3g3GgE.js"], "css": [] }, "routes/api": { "id": "routes/api", "parentId": "root", "path": "api", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api-CSxRPO1x.js", "imports": [], "css": [] } }, "url": "/assets/manifest-ae2b053b.js", "version": "ae2b053b" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/api.resume-analysis.optimize": {
    id: "routes/api.resume-analysis.optimize",
    parentId: "routes/api.resume-analysis",
    path: "optimize",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/api.resume-analysis.format": {
    id: "routes/api.resume-analysis.format",
    parentId: "routes/api.resume-analysis",
    path: "format",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/api.resume-analysis": {
    id: "routes/api.resume-analysis",
    parentId: "routes/api",
    path: "resume-analysis",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/api.voice-notes": {
    id: "routes/api.voice-notes",
    parentId: "routes/api",
    path: "voice-notes",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/resume-analysis": {
    id: "routes/resume-analysis",
    parentId: "root",
    path: "resume-analysis",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/auth.callback": {
    id: "routes/auth.callback",
    parentId: "root",
    path: "auth/callback",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/applications": {
    id: "routes/applications",
    parentId: "root",
    path: "applications",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/auth.signout": {
    id: "routes/auth.signout",
    parentId: "root",
    path: "auth/signout",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/voice-notes": {
    id: "routes/voice-notes",
    parentId: "root",
    path: "voice-notes",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/documents": {
    id: "routes/documents",
    parentId: "root",
    path: "documents",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/api.chat": {
    id: "routes/api.chat",
    parentId: "routes/api",
    path: "chat",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route12
  },
  "routes/chat": {
    id: "routes/chat",
    parentId: "root",
    path: "chat",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/api": {
    id: "routes/api",
    parentId: "root",
    path: "api",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
