import ArticleIcon from "@mui/icons-material/Article";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
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
import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";

const NAVBAR_EXPANDED_WIDTH = 248;
const NAVBAR_COLLAPSED_WIDTH = 72;
const NAVBAR_COLLAPSED_STORAGE_KEY = "edudict-navbar-collapsed";

const navItems = [
  {
    href: "/",
    icon: HomeIcon,
    label: "Início",
    type: "public",
  },
  {
    href: "/docs/api",
    icon: ArticleIcon,
    label: "API",
    type: "public",
  },
  {
    href: "/docs/wiki",
    icon: ArticleIcon,
    label: "Wiki",
    type: "public",
  },
  {
    href: "/login",
    icon: LoginIcon,
    label: "Login",
    type: "guest",
  },
  {
    href: "/perfil",
    icon: PersonIcon,
    label: "Perfil",
    type: "private",
    usesAvatar: true,
  },
];

const getInitialCollapsedState = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(NAVBAR_COLLAPSED_STORAGE_KEY) === "true";
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
          justifyContent: collapsed && !mobile ? "center" : "flex-start",
          minHeight: 44,
          px: collapsed && !mobile ? 1 : 1.5,
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
        {collapsed && !mobile ? null : <ListItemText primary={item.label} />}
      </ListItemButton>
    </Tooltip>
  );
}

function NavbarContent({ collapsed, mobile, onClose, onToggleCollapse }) {
  const { estaAutenticado, usuario } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const visibleItems = getVisibleItems(navItems, estaAutenticado);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: collapsed && !mobile ? NAVBAR_COLLAPSED_WIDTH : NAVBAR_EXPANDED_WIDTH,
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
            edudict
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

      <List sx={{ flex: 1, px: 1, py: 1.5 }}>
        {visibleItems.map((item) => (
          <NavbarItem
            collapsed={collapsed}
            item={item}
            key={item.href}
            mobile={mobile}
            onNavigate={mobile ? onClose : undefined}
            usuario={usuario}
          />
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 1 }}>
        <Tooltip title={mode === "light" ? "Usar tema escuro" : "Usar tema claro"}>
          <ListItemButton
            aria-label={mode === "light" ? "Usar tema escuro" : "Usar tema claro"}
            onClick={toggleTheme}
            sx={{
              borderRadius: 1,
              justifyContent: collapsed && !mobile ? "center" : "flex-start",
              px: collapsed && !mobile ? 1 : 1.5,
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
              <ListItemText primary={mode === "light" ? "Tema escuro" : "Tema claro"} />
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
  const [collapsed, setCollapsed] = useState(getInitialCollapsedState);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopWidth = collapsed ? NAVBAR_COLLAPSED_WIDTH : NAVBAR_EXPANDED_WIDTH;

  const toggleDesktopCollapse = () => {
    const nextCollapsed = !collapsed;

    setCollapsed(nextCollapsed);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        NAVBAR_COLLAPSED_STORAGE_KEY,
        String(nextCollapsed)
      );
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
