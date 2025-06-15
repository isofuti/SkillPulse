import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import styled from '@emotion/styled';
import logoImage from '../assets/Logo.svg';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  position: 'fixed',
  width: '100%',
  zIndex: 1000,
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: '80px',
  padding: '0 24px',
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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
  }
});

const StyledLogo = styled('img')({
  height: 40,
  width: 40,
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

const globalStyles = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Navbar = () => {
  const location = useLocation();

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
          <NavButtons>
            <NavButton
              component={Link}
              to="/"
              active={location.pathname === '/' ? 1 : 0}
            >
              Главная
            </NavButton>
            <NavButton
              component={Link}
              to="/analysis"
              active={location.pathname === '/analysis' ? 1 : 0}
            >
              Анализ
            </NavButton>
            <NavButton
              component={Link}
              to="/pricing"
              active={location.pathname === '/pricing' ? 1 : 0}
            >
              Цены
            </NavButton>
            <NavButton
              component={Link}
              to="/statistics"
              active={location.pathname === '/statistics' ? 1 : 0}
            >
              Статистика
            </NavButton>
            <NavButton
              component={Link}
              to="/about"
              active={location.pathname === '/about' ? 1 : 0}
            >
              О нас
            </NavButton>
          </NavButtons>
        </StyledToolbar>
      </StyledAppBar>
      <div style={{ height: '80px' }} /> {/* Отступ для фиксированной навигации */}
    </>
  );
};

export default Navbar; 