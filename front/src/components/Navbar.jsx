import ArticleIcon from "@mui/icons-material/Article";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ChatIcon from "@mui/icons-material/Chat";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import authAxios from "@/utils/authAxios";

const NAVBAR_EXPANDED_WIDTH = 248;
const NAVBAR_COLLAPSED_WIDTH = 72;
const NAVBAR_COLLAPSED_STORAGE_KEY = "edudict-navbar-collapsed";
const NAVBAR_COLLAPSED_CHANGE_EVENT = "edudict-navbar-collapsed-change";
const CHATS_CHANGE_EVENT = "edudict-chats-change";

const mainNavItems = [
  {
    href: "/",
    icon: HomeIcon,
    label: "Início",
    type: "public",
  },
];

const predictionNavItems = [
  {
    href: "/predicoes",
    icon: AutoGraphIcon,
    label: "Predições",
    type: "public",
  },
];

const documentationNavItems = [
  {
    href: "/docs/wiki",
    icon: ArticleIcon,
    label: "Wiki",
    type: "public",
  },
  {
    href: "/docs/api",
    icon: ArticleIcon,
    label: "API",
    type: "public",
  },
];

const accountNavItems = [
  {
    href: "/perfil",
    icon: PersonIcon,
    label: "Perfil",
    type: "private",
    usesAvatar: true,
  },
  {
    href: "/login",
    icon: LoginIcon,
    label: "Login",
    type: "guest",
  },
  {
    href: "/usuarios/novo",
    icon: PersonAddIcon,
    label: "Criar conta",
    type: "guest",
  },
  {
    href: "/logout",
    icon: LogoutIcon,
    label: "Sair",
    type: "private",
  },
];

const getInitialCollapsedState = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(NAVBAR_COLLAPSED_STORAGE_KEY) === "true";
};

const subscribeCollapsedState = (onStoreChange) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(NAVBAR_COLLAPSED_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(NAVBAR_COLLAPSED_CHANGE_EVENT, onStoreChange);
  };
};

const getVisibleItems = (items, estaAutenticado) => {
  return items.filter((item) => {
    if (item.type === "guest") {
      return !estaAutenticado;
    }

    if (item.type === "private") {
      return estaAutenticado;
    }

    return true;
  });
};

function NavbarItem({ collapsed, item, mobile, onNavigate, usuario }) {
  const router = useRouter();
  const Icon = item.icon;
  const isActive =
    router.pathname === item.href ||
    (item.href !== "/" && router.pathname.startsWith(item.href));
  const icon = item.usesAvatar ? (
    <Avatar
      alt={usuario?.nome || "Perfil"}
      src={usuario?.imagem || usuario?.avatar || ""}
      sx={{ height: 32, width: 32 }}
    >
      {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : <PersonIcon />}
    </Avatar>
  ) : (
    <Icon fontSize="small" />
  );

  return (
    <Tooltip
      disableHoverListener={!collapsed || mobile}
      placement="right"
      title={item.label}
    >
      <ListItemButton
        LinkComponent={Link}
        href={item.href}
        onClick={onNavigate}
        selected={isActive}
        sx={{
          borderLeft: "4px solid",
          borderLeftColor: isActive ? "primary.main" : "transparent",
          borderRadius: 1,
          boxSizing: "border-box",
          justifyContent: collapsed && !mobile ? "center" : "flex-start",
          minHeight: 44,
          overflowX: "hidden",
          px: collapsed && !mobile ? 1 : 1.5,
          width: "100%",
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? "primary.main" : "text.secondary",
            justifyContent: "center",
            minWidth: collapsed && !mobile ? 0 : 42,
          }}
        >
          {icon}
        </ListItemIcon>
        {collapsed && !mobile ? null : (
          <ListItemText primary={item.label} sx={{ minWidth: 0 }} />
        )}
      </ListItemButton>
    </Tooltip>
  );
}

function NavbarContent({ collapsed, mobile, onClose, onToggleCollapse }) {
  const router = useRouter();
  const { estaAutenticado, usuario } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const [chats, setChats] = useState([]);
  const [chatsExpanded, setChatsExpanded] = useState(true);
  const visibleAccountItems = getVisibleItems(
    accountNavItems,
    estaAutenticado
  );

  const loadChats = useCallback(async () => {
    try {
      const response = await authAxios.get("/chats");
      setChats(Array.isArray(response.data) ? response.data : []);
    } catch {
      setChats([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const initialLoad = window.setTimeout(loadChats, 0);
    window.addEventListener(CHATS_CHANGE_EVENT, loadChats);

    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener(CHATS_CHANGE_EVENT, loadChats);
    };
  }, [estaAutenticado, loadChats]);

  const navigateToChat = (href) => {
    router.push(href);

    if (mobile) {
      onClose();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          gap: 1,
          justifyContent: collapsed && !mobile ? "center" : "space-between",
          minHeight: 64,
          px: 1.5,
        }}
      >
        {collapsed && !mobile ? null : (
          <Typography component="span" fontWeight={700} variant="subtitle1">
            EduDict
          </Typography>
        )}
        <Tooltip title={mobile ? "Fechar menu" : "Alternar menu"}>
          <IconButton
            aria-label={mobile ? "Fechar menu" : "Alternar menu"}
            onClick={mobile ? onClose : onToggleCollapse}
          >
            {collapsed && !mobile ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      <List sx={{ flex: 1, overflowX: "hidden", px: 1, py: 1.5 }}>
        {mainNavItems.map((item) => (
          <NavbarItem
            collapsed={collapsed}
            item={item}
            key={item.href}
            mobile={mobile}
            onNavigate={mobile ? onClose : undefined}
            usuario={usuario}
          />
        ))}

        {visibleAccountItems.map((item) => (
          <NavbarItem
            collapsed={collapsed}
            item={item}
            key={item.href}
            mobile={mobile}
            onNavigate={mobile ? onClose : undefined}
            usuario={usuario}
          />
        ))}

        <Divider sx={{ my: 1 }} />

        {documentationNavItems.map((item) => (
          <NavbarItem
            collapsed={collapsed}
            item={item}
            key={item.href}
            mobile={mobile}
            onNavigate={mobile ? onClose : undefined}
            usuario={usuario}
          />
        ))}

        <Divider sx={{ my: 1 }} />

        {predictionNavItems.map((item) => (
          <NavbarItem
            collapsed={collapsed}
            item={item}
            key={item.href}
            mobile={mobile}
            onNavigate={mobile ? onClose : undefined}
            usuario={usuario}
          />
        ))}

        <Tooltip
          disableHoverListener={!collapsed || mobile}
          placement="right"
          title="Novo Chat"
        >
          <ListItemButton
            onClick={() => navigateToChat("/chat")}
            selected={router.pathname === "/chat" && !router.query.id}
            sx={{
              borderLeft: "4px solid",
              borderLeftColor:
                router.pathname === "/chat" && !router.query.id
                  ? "primary.main"
                  : "transparent",
              borderRadius: 1,
              boxSizing: "border-box",
              justifyContent: collapsed && !mobile ? "center" : "flex-start",
              minHeight: 44,
              overflowX: "hidden",
              px: collapsed && !mobile ? 1 : 1.5,
              width: "100%",
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  router.pathname === "/chat" && !router.query.id
                    ? "primary.main"
                    : "text.secondary",
                justifyContent: "center",
                minWidth: collapsed && !mobile ? 0 : 42,
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            {collapsed && !mobile ? null : (
              <>
                <ListItemText primary="Novo Chat" sx={{ minWidth: 0 }} />
                <IconButton
                  aria-label={
                    chatsExpanded ? "Recolher chats" : "Expandir chats"
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    setChatsExpanded((current) => !current);
                  }}
                  size="small"
                >
                  <ChevronRightIcon
                    fontSize="small"
                    sx={{
                      transform: chatsExpanded
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                      transition: "transform 160ms ease",
                    }}
                  />
                </IconButton>
              </>
            )}
          </ListItemButton>
        </Tooltip>

        {(!collapsed || mobile) && chatsExpanded ? (
          <List
            aria-label="Histórico de chats"
            disablePadding
            sx={{ mb: 1, ml: 3, mt: 0.5 }}
          >
            {chats.map((chat) => (
              <ListItemButton
                key={chat.id}
                onClick={() => navigateToChat(`/chat?id=${chat.id}`)}
                selected={
                  router.pathname === "/chat" &&
                  String(router.query.id) === String(chat.id)
                }
                sx={{
                  borderRadius: 1,
                  minHeight: 38,
                  pl: 1.25,
                  pr: 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <ChatIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={chat.titulo || "Chat sem título"}
                  slotProps={{
                    primary: {
                      fontSize: 13,
                      noWrap: true,
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        ) : null}
      </List>

      <Divider />

      <Box sx={{ p: 1 }}>
        <Tooltip title={mode === "light" ? "Usar tema escuro" : "Usar tema claro"}>
          <ListItemButton
            aria-label={mode === "light" ? "Usar tema escuro" : "Usar tema claro"}
            onClick={toggleTheme}
            sx={{
              borderRadius: 1,
              boxSizing: "border-box",
              justifyContent: collapsed && !mobile ? "center" : "flex-start",
              overflowX: "hidden",
              px: collapsed && !mobile ? 1 : 1.5,
              width: "100%",
            }}
          >
            <ListItemIcon
              sx={{
                color: "text.secondary",
                justifyContent: "center",
                minWidth: collapsed && !mobile ? 0 : 42,
              }}
            >
              {mode === "light" ? <DarkModeIcon fontSize="small" /> : <WbSunnyIcon fontSize="small" />}
            </ListItemIcon>
            {collapsed && !mobile ? null : (
              <ListItemText
                primary={mode === "light" ? "Tema escuro" : "Tema claro"}
                sx={{ minWidth: 0 }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default function NavbarLayout({ children }) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const collapsed = useSyncExternalStore(
    subscribeCollapsedState,
    getInitialCollapsedState,
    () => false
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopWidth = collapsed ? NAVBAR_COLLAPSED_WIDTH : NAVBAR_EXPANDED_WIDTH;

  const toggleDesktopCollapse = () => {
    const nextCollapsed = !collapsed;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        NAVBAR_COLLAPSED_STORAGE_KEY,
        String(nextCollapsed)
      );
      window.dispatchEvent(new Event(NAVBAR_COLLAPSED_CHANGE_EVENT));
    }
  };

  const toggleMobileDrawer = () => {
    setMobileOpen((currentMobileOpen) => !currentMobileOpen);
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {mobile ? (
        <Tooltip title={mobileOpen ? "Fechar menu" : "Abrir menu"}>
          <IconButton
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            onClick={toggleMobileDrawer}
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              left: 12,
              position: "fixed",
              top: 12,
              zIndex: theme.zIndex.drawer + 1,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      <Drawer
        ModalProps={{ keepMounted: true }}
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        sx={{
          display: { md: "none", xs: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            overflowX: "hidden",
            width: NAVBAR_EXPANDED_WIDTH,
          },
        }}
        variant="temporary"
      >
        <NavbarContent
          collapsed={false}
          mobile
          onClose={() => setMobileOpen(false)}
          onToggleCollapse={toggleDesktopCollapse}
        />
      </Drawer>

      <Drawer
        open
        sx={{
          display: { md: "block", xs: "none" },
          flexShrink: 0,
          width: desktopWidth,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            overflowX: "hidden",
            width: desktopWidth,
          },
        }}
        variant="permanent"
      >
        <NavbarContent
          collapsed={collapsed}
          mobile={false}
          onClose={() => setMobileOpen(false)}
          onToggleCollapse={toggleDesktopCollapse}
        />
      </Drawer>

      <Box
        component="main"
        sx={{
          ml: { md: `${desktopWidth}px`, xs: 0 },
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
