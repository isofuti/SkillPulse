import React from 'react';
import { Container, Typography, Box, Grid, Button, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;





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

const StyledCard = styled(Card)({
  background: 'rgba(44, 62, 80, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(15, 185, 193, 0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(15, 185, 193, 0.2)',
    border: '1px solid rgba(15, 185, 193, 0.3)',
  },
});

const IconWrapper = styled(Box)({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  background: 'linear-gradient(135deg, #0fb9c1 0%, #2C3E50 100%)',
  color: '#ECF0F1',
  animation: `${float} 3s ease-in-out infinite`,
  '& svg': {
    fontSize: '30px',
  },
  [theme => theme.breakpoints.down('sm')]: {
    width: '50px',
    height: '50px',
    marginBottom: '16px',
    '& svg': {
      fontSize: '24px',
    },
  },
  [theme => theme.breakpoints.down('xs')]: {
    width: '40px',
    height: '40px',
    marginBottom: '12px',
    '& svg': {
      fontSize: '20px',
    },
  },
});

const AnimatedSection = styled(Box)({
  animation: `${fadeIn} 0.8s ease-out`,
  marginBottom: '60px',
  [theme => theme.breakpoints.down('md')]: {
    marginBottom: '40px',
  },
  [theme => theme.breakpoints.down('sm')]: {
    marginBottom: '30px',
  },
  [theme => theme.breakpoints.down('xs')]: {
    marginBottom: '20px',
  },
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
      <Container maxWidth="lg" sx={{ 
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <AnimatedSection>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              textAlign: 'center',
              color: '#ECF0F1',
              fontWeight: 700,
              mb: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
              background: 'linear-gradient(135deg, #0fb9c1 0%, #2C3E50 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SkillPulse
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              textAlign: 'center',
              color: '#ECF0F1',
              mb: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' },
              fontWeight: 600,
            }}
          >
            Аналитика, которая дышит рынком
          </Typography>
          <Typography
            variant="h5"
            component="h3"
            sx={{
              textAlign: 'center',
              color: '#ECF0F1',
              mb: { xs: 4, sm: 6, md: 8 },
              maxWidth: '800px',
              margin: { xs: '0 auto 32px', sm: '0 auto 48px', md: '0 auto 60px' },
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem' },
              opacity: 0.9,
            }}
          >
            Единственный российский инструмент, который показывает пульс рынка труда 
            с обновлением каждый час и возможностью настроить Telegram-уведомления
          </Typography>
        </AnimatedSection>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={6}>
            <AnimatedSection>
              <StyledCard>
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <IconWrapper>
                    <TrendingUpIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                    Анализ рынка труда
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ECF0F1', mb: 3 }}>
                    Получайте актуальную информацию о трендах, зарплатах и требованиях к специалистам в различных отраслях
                  </Typography>
                  <Button
                    component={Link}
                    to="/market-analysis"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </StyledCard>
            </AnimatedSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <AnimatedSection>
              <StyledCard>
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <IconWrapper>
                    <AssessmentIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                    Статистика и отчеты
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ECF0F1', mb: 3 }}>
                    Детальные отчеты и визуализация данных для принятия обоснованных решений
                  </Typography>
                  <Button
                    component={Link}
                    to="/reports"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </StyledCard>
            </AnimatedSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <AnimatedSection>
              <StyledCard>
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <IconWrapper>
                    <SpeedIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                    Быстрый доступ
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ECF0F1', mb: 3 }}>
                    Мгновенный доступ к актуальным данным через удобный интерфейс
                  </Typography>
                  <Button
                    component={Link}
                    to="/quick-access"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </StyledCard>
            </AnimatedSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <AnimatedSection>
              <StyledCard>
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <IconWrapper>
                    <SecurityIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                    Безопасность данных
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ECF0F1', mb: 3 }}>
                    Надежное хранение и защита конфиденциальной информации
                  </Typography>
                  <Button
                    component={Link}
                    to="/security"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </StyledCard>
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home; 