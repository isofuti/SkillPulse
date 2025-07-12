import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Analysis from './pages/Analysis';
import Statistics from './pages/Statistics';
import Pricing from './pages/Pricing';
import MarketAnalysis from './pages/MarketAnalysis';
import Reports from './pages/Reports';
import QuickAccess from './pages/QuickAccess';
import Security from './pages/Security';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`
          html, body {
            overflow-x: hidden;
            max-width: 100%;
          }
          .App {
            overflow-x: hidden;
            max-width: 100%;
          }
        `}
      </style>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Основные страницы навигации */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Дополнительные страницы */}
            <Route path="/market-analysis" element={<MarketAnalysis />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/quick-access" element={<QuickAccess />} />
            <Route path="/security" element={<Security />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 