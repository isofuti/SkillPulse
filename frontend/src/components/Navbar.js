import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styled from '@emotion/styled';
import logoImage from '../assets/Logo.svg';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  position: 'fixed',
  width: '100%',
  zIndex: 1000,
  maxWidth: '100vw',
  overflow: 'hidden',
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: '80px',
  padding: '0 24px',
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme => theme.breakpoints.down('md')]: {
    padding: '0 16px',
    minHeight: '60px',
    justifyContent: 'space-between',
  },
  [theme => theme.breakpoints.down('sm')]: {
    padding: '0 12px',
    minHeight: '50px',
    justifyContent: 'space-between',
  },
});

const LogoContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 24px',
  borderRadius: '30px',
  background: '#2C3E50',
  transition: 'all 0.3s ease',
  position: 'absolute',
  left: '20px',
  textDecoration: 'none',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  [theme => theme.breakpoints.down('md')]: {
    position: 'static',
    padding: '6px 12px',
    left: 'auto',
    flexShrink: 0,
  },
  [theme => theme.breakpoints.down('sm')]: {
    gap: '6px',
    padding: '4px 8px',
    borderRadius: '20px',
  },
  [theme => theme.breakpoints.down('xs')]: {
    gap: '4px',
    padding: '3px 6px',
  }
});

const StyledLogo = styled('img')({
  height: 40,
  width: 40,
  [theme => theme.breakpoints.down('sm')]: {
    height: 28,
    width: 28,
  },
  [theme => theme.breakpoints.down('xs')]: {
    height: 24,
    width: 24,
  }
});

const LogoText = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: '28px',
  fontWeight: 700,
  textDecoration: 'none',
  '& span:first-of-type': {
    color: '#ECF0F1',
  },
  '& span:last-of-type': {
    color: '#0fb9c1',
  },
  [theme => theme.breakpoints.down('md')]: {
    fontSize: '22px',
  },
  [theme => theme.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
  [theme => theme.breakpoints.down('xs')]: {
    fontSize: '16px',
  }
});

const NavButtons = styled('div')({
  display: 'flex',
  gap: '8px',
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#2C3E50',
  padding: '8px',
  borderRadius: '40px',
  [theme => theme.breakpoints.down('md')]: {
    display: 'none !important',
  }
});

const NavButton = styled(Button)(({ theme, active }) => ({
  color: active ? '#fff' : 'rgba(255, 255, 255, 0.9)',
  padding: '8px 24px',
  borderRadius: '30px',
  fontSize: '16px',
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  background: active ? 'linear-gradient(45deg, #2C3E50, #0fb9c1, #2C3E50)' : 'transparent',
  backgroundSize: active ? '200% 200%' : '100% 100%',
  animation: active ? 'gradient 3s ease infinite' : 'none',
  '&:hover': {
    color: '#fff',
    transform: 'scale(1.05)',
    background: active ? 'linear-gradient(45deg, #2C3E50, #0fb9c1, #2C3E50)' : 'rgba(15, 185, 193, 0.2)',
    backgroundSize: active ? '200% 200%' : '100% 100%',
  }
}));

const MobileMenuButton = styled(IconButton)({
  color: '#fff',
  background: '#2C3E50',
  padding: '8px',
  borderRadius: '8px',
  '&:hover': {
    background: '#34495E',
  },
  [theme => theme.breakpoints.up('md')]: {
    display: 'none !important',
  },
  [theme => theme.breakpoints.down('sm')]: {
    padding: '6px',
  },
  [theme => theme.breakpoints.down('xs')]: {
    padding: '4px',
  }
});

const StyledDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    background: '#2C3E50',
    color: '#fff',
    width: 280,
    paddingTop: '20px',
  }
});

const DrawerHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  marginBottom: '20px',
});

const DrawerLogo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '24px',
  fontWeight: 700,
  '& span:first-of-type': {
    color: '#ECF0F1',
  },
  '& span:last-of-type': {
    color: '#0fb9c1',
  }
});

const DrawerLogoImage = styled('img')({
  height: 36,
  width: 36,
});

const DrawerListItem = styled(ListItem)(({ active }) => ({
  margin: '4px 16px',
  borderRadius: '8px',
  background: active ? 'linear-gradient(45deg, #2C3E50, #0fb9c1, #2C3E50)' : 'transparent',
  backgroundSize: active ? '200% 200%' : '100% 100%',
  animation: active ? 'gradient 3s ease infinite' : 'none',
  '&:hover': {
    background: active ? 'linear-gradient(45deg, #2C3E50, #0fb9c1, #2C3E50)' : 'rgba(15, 185, 193, 0.2)',
    backgroundSize: active ? '200% 200%' : '100% 100%',
  }
}));

const DrawerListItemText = styled(ListItemText)({
  '& .MuiListItemText-primary': {
    fontSize: '16px',
    fontWeight: 500,
    color: '#fff',
  }
});

const globalStyles = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const navItems = [
    { text: 'Главная', path: '/' },
    { text: 'Анализ', path: '/analysis' },
    { text: 'Цены', path: '/pricing' },
    { text: 'Статистика', path: '/statistics' },
    { text: 'О нас', path: '/about' },
  ];

  const drawer = (
    <div>
      <DrawerHeader>
        <DrawerLogo>
          <DrawerLogoImage src={logoImage} alt="SkillPulse Logo" />
        </DrawerLogo>
      </DrawerHeader>
      <List>
        {navItems.map((item) => (
          <DrawerListItem
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleDrawerClose}
            active={location.pathname === item.path ? 1 : 0}
          >
            <DrawerListItemText primary={item.text} />
          </DrawerListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <style>{globalStyles}</style>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <LogoContainer as={Link} to="/">
            <StyledLogo src={logoImage} alt="SkillPulse Logo" />
            <LogoText>
              <span>Skill</span><span>Pulse</span>
            </LogoText>
          </LogoContainer>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <NavButtons>
              {navItems.map((item) => (
                <NavButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  active={location.pathname === item.path ? 1 : 0}
                >
                  {item.text}
                </NavButton>
              ))}
            </NavButtons>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <MobileMenuButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ marginLeft: 'auto' }}
            >
              <MenuIcon />
            </MobileMenuButton>
          )}
        </StyledToolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <StyledDrawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </StyledDrawer>

      {/* Spacer for fixed navbar */}
      <div style={{ 
        height: isMobile ? '60px' : '80px' 
      }} />
    </>
  );
};

export default Navbar; 