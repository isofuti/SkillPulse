import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import styled from '@emotion/styled';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Statistics from './pages/Statistics';
import About from './pages/About';
import logoImage from './assets/Logo.svg';

// Создаем тему с цветами из брендбука
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2C3E50', // Основной (тёмный индиго)
    },
    secondary: {
      main: '#0fb9c1', // Акцентный (бирюзовый)
    },
    background: {
      default: '#000000',
      paper: '#1a1a1a',
    },
    warning: {
      main: '#F1C40F', // Уведомления
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const StyledAppBar = styled(AppBar)({
  background: 'transparent',
  boxShadow: 'none',
  position: 'fixed',
});

const StyledToolbar = styled(Toolbar)({
  minHeight: 80,
  padding: '0 24px',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
});

const LogoContainer = styled(Box)({
  position: 'absolute',
  left: 24,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  padding: '8px 24px',
  borderRadius: '30px',
  background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.1) 0%, rgba(15, 185, 193, 0.1) 100%)',
  '&:hover': {
    transform: 'scale(1.05)',
    background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.2) 0%, rgba(15, 185, 193, 0.2) 100%)',
  },
});

const StyledLogo = styled('img')({
  height: 40,
  width: 40,
});

const LogoText = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  fontSize: '28px',
  textDecoration: 'none',
  '& span:first-of-type': {
    color: '#2C3E50',
    fontWeight: 700,
  },
  '& span:last-of-type': {
    color: '#0fb9c1',
    fontWeight: 700,
  },
});

const NavButtons = styled(Box)({
  display: 'flex',
  gap: 8,
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
});

const NavButton = styled(Button)(({ active }) => ({
  color: active ? 'white' : '#2C3E50',
  fontWeight: 600,
  fontSize: '1rem',
  padding: '8px 24px',
  borderRadius: '30px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: active 
      ? 'linear-gradient(135deg, #2C3E50 0%, #0fb9c1 100%)'
      : 'linear-gradient(135deg, rgba(44, 62, 80, 0.1) 0%, rgba(15, 185, 193, 0.1) 100%)',
    zIndex: -1,
    borderRadius: '30px',
    transition: 'all 0.3s ease',
  },
  '&:hover': {
    color: 'white',
    transform: 'scale(1.05)',
    '&::before': {
      background: 'linear-gradient(135deg, #2C3E50 0%, #0fb9c1 100%)',
    },
  },
}));

const Navigation = () => {
  const location = useLocation();

  return (
    <StyledAppBar>
      <StyledToolbar>
        <LogoContainer component={Link} to="/" sx={{ textDecoration: 'none' }}>
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
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Box sx={{ pt: 10 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 