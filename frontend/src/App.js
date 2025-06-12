import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import styled from '@emotion/styled';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Pricing from './pages/Pricing';
import Statistics from './pages/Statistics';
import About from './pages/About';
import logoImage from './assets/Logo.svg';
import Footer from './components/Footer';

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

// Добавляем keyframes для анимации градиента
const globalStyles = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const MainContent = styled('div')({
  paddingTop: '80px',
  minHeight: 'calc(100vh - 80px)', // Учитываем высоту шапки
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <ThemeProvider theme={theme}>
      <style>{globalStyles}</style>
      <CssBaseline />
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <LogoContainer as={Link} to="/" onClick={handleLogoClick}>
            <img src={logoImage} alt="SkillPulse Logo" style={{ width: '40px', height: '40px' }} />
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
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </MainContent>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <style>{globalStyles}</style>
      <CssBaseline />
      <Router>
        <Navigation />
      </Router>
    </ThemeProvider>
  );
};

export default App; 