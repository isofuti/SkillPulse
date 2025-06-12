import React from 'react';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@mui/system';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;

const graphAnimation = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 0.15;
  }
`;

const squareAnimation = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 0.2;
  }
  50% {
    transform: rotate(180deg) scale(1.1);
    opacity: 0.4;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 0.2;
  }
`;

const lineAnimation = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const dotAnimation = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.2;
  }
`;

const StyledTypography = styled(Typography)({
  fontFamily: '"Inter", "SF Pro", sans-serif',
  fontWeight: 400,
});

const StyledButton = styled(Button)({
  padding: '12px 24px',
  fontSize: '1.1rem',
  borderRadius: '8px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(15, 185, 193, 0.2)',
  },
});

const FeatureCard = styled(Paper)({
  padding: '24px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(135deg, #2C3E50 0%, #0fb9c1 100%)',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
});

const TargetAudienceCard = styled(Paper)({
  padding: '24px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(135deg, #2C3E50 0%, #0fb9c1 100%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    '&::before': {
      opacity: 1,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #0fb9c1 0%, #2C3E50 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
});

const PulseWave = styled(Box)({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(15, 185, 193, 0.1) 0%, transparent 70%)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.5,
    },
    '50%': {
      transform: 'scale(1.1)',
      opacity: 0.2,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.5,
    },
  },
});

const AnimatedBackground = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  overflow: 'hidden',
  backgroundColor: '#000000',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(241, 196, 15, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
    animation: `${pulseAnimation} 4s ease-in-out infinite`,
  },
});

const AnimatedGraph = styled(Box)({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: '100%',
  opacity: 0.15,
  '&::before': {
    content: '""',
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, #F1C40F 0%, transparent 100%)',
    clipPath: 'polygon(0 100%, 0 80%, 20% 60%, 40% 90%, 60% 40%, 80% 70%, 100% 30%, 100% 100%)',
    animation: `${graphAnimation} 2s ease-out forwards`,
  },
});

const AnimatedSquare = styled(Box)({
  position: 'fixed',
  width: '100px',
  height: '100px',
  border: '2px solid rgba(241, 196, 15, 0.3)',
  animation: `${squareAnimation} 10s linear infinite`,
});

const AnimatedLine = styled(Box)({
  position: 'fixed',
  height: '1px',
  width: '100%',
  background: 'linear-gradient(90deg, transparent, #F1C40F, transparent)',
  animation: `${lineAnimation} 3s linear infinite`,
});

const AnimatedDot = styled(Box)({
  position: 'fixed',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#F1C40F',
  animation: `${dotAnimation} 2s ease-in-out infinite`,
});

const Home = () => {
  return (
    <>
      <AnimatedBackground>
        <AnimatedGraph />
        <AnimatedSquare style={{ top: '10%', left: '10%' }} />
        <AnimatedSquare style={{ top: '20%', right: '15%' }} />
        <AnimatedSquare style={{ bottom: '15%', left: '20%' }} />
        <AnimatedSquare style={{ bottom: '25%', right: '25%' }} />
        <AnimatedLine style={{ top: '30%' }} />
        <AnimatedLine style={{ top: '60%' }} />
        <AnimatedDot style={{ top: '40%', left: '30%' }} />
        <AnimatedDot style={{ top: '70%', right: '40%' }} />
        <AnimatedDot style={{ bottom: '20%', left: '50%' }} />
      </AnimatedBackground>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {/* Hero Section */}
          <Paper 
            sx={{ 
              p: { xs: 3, md: 6 }, 
              mb: 4,
              background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(15, 185, 193, 0.95) 100%)',
              color: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
            }}
          >
            <PulseWave />
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <StyledTypography 
                  variant="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontFamily: '"Montserrat", sans-serif',
                  }}
                >
                  SkillPulse
                </StyledTypography>
                <StyledTypography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    mb: 3, 
                    opacity: 0.9,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Аналитика, которая дышит рынком
                </StyledTypography>
                <StyledTypography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.8,
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                  }}
                >
                  Единственный российский инструмент, который показывает пульс рынка труда 
                  с обновлением каждый час и возможностью настроить Telegram-уведомления.
                </StyledTypography>
                <StyledButton
                  component={Link}
                  to="/analysis"
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  Начать анализ
                </StyledButton>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="/hero-image.png"
                  alt="SkillPulse Analytics"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    display: { xs: 'none', md: 'block' },
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))',
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Features Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <Box sx={{ fontSize: '2rem', mb: 2, color: 'white' }}>📊</Box>
                <StyledTypography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  Актуальность
                </StyledTypography>
                <StyledTypography 
                  variant="body2" 
                  sx={{ 
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Обновление данных каждый час, чтобы вы всегда были в курсе последних 
                  изменений на рынке труда.
                </StyledTypography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <Box sx={{ fontSize: '2rem', mb: 2, color: 'white' }}>⚙️</Box>
                <StyledTypography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  Простота
                </StyledTypography>
                <StyledTypography 
                  variant="body2" 
                  sx={{ 
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Минимум действий — максимум пользы. PDF и CSV отчёты за 2 минуты, 
                  без сложных настроек.
                </StyledTypography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <Box sx={{ fontSize: '2rem', mb: 2, color: 'white' }}>🚀</Box>
                <StyledTypography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  Скорость
                </StyledTypography>
                <StyledTypography 
                  variant="body2" 
                  sx={{ 
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Мгновенные алерты, быстрые отчёты и интеграция с Telegram для 
                  оперативного реагирования.
                </StyledTypography>
              </FeatureCard>
            </Grid>
          </Grid>

          {/* Target Audience Section */}
          <Paper 
            sx={{ 
              p: { xs: 3, md: 6 }, 
              mt: 4, 
              mb: 4,
              background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(15, 185, 193, 0.95) 100%)',
              color: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
            }}
          >
            <PulseWave />
            <StyledTypography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                fontFamily: '"Montserrat", sans-serif',
                mb: 4,
                color: 'white',
              }}
            >
              Для кого SkillPulse?
            </StyledTypography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TargetAudienceCard>
                  <StyledTypography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    Рекрутинговые агентства
                  </StyledTypography>
                  <StyledTypography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6,
                    }}
                  >
                    Быстрые решения и поиск новых регионов для размещения вакансий
                  </StyledTypography>
                </TargetAudienceCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <TargetAudienceCard>
                  <StyledTypography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    HR-отделы компаний
                  </StyledTypography>
                  <StyledTypography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6,
                    }}
                  >
                    PDF и CSV отчёты, уменьшение Excel-зависимости
                  </StyledTypography>
                </TargetAudienceCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <TargetAudienceCard>
                  <StyledTypography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    IT-стартапы
                  </StyledTypography>
                  <StyledTypography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6,
                    }}
                  >
                    Понимание перегретости рынка и поиск альтернативных регионов
                  </StyledTypography>
                </TargetAudienceCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <TargetAudienceCard>
                  <StyledTypography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    Онлайн-школы (EdTech)
                  </StyledTypography>
                  <StyledTypography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6,
                    }}
                  >
                    Формирование курсов по реальному спросу на рынке
                  </StyledTypography>
                </TargetAudienceCard>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Home; 