import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import PeopleIcon from '@mui/icons-material/People';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

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

const StyledCard = styled(Card)({
  background: 'rgba(44, 62, 80, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(15, 185, 193, 0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
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
});

const AnimatedSection = styled(Box)({
  animation: `${fadeIn} 0.8s ease-out`,
  marginBottom: '40px',
});

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <AnimatedSection>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            color: '#ECF0F1',
            fontWeight: 700,
            mb: 6,
            background: 'linear-gradient(135deg, #0fb9c1 0%, #2C3E50 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          О SkillPulse
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            textAlign: 'center',
            color: '#ECF0F1',
            mb: 8,
            maxWidth: '800px',
            margin: '0 auto 60px',
          }}
        >
          Мы создаем будущее HR-аналитики, предоставляя инновационные решения для анализа рынка труда
        </Typography>
      </AnimatedSection>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <AnimatedSection>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <IconWrapper>
                  <PeopleIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                  Наша миссия
                </Typography>
                <Typography variant="body1" sx={{ color: '#ECF0F1', mb: 3 }}>
                  Мы стремимся сделать рынок труда более прозрачным и эффективным, предоставляя HR-специалистам 
                  инструменты для принятия обоснованных решений на основе актуальных данных.
                </Typography>
              </CardContent>
            </StyledCard>
          </AnimatedSection>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedSection>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <IconWrapper>
                  <EmojiObjectsIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                  Наши ценности
                </Typography>
                <Typography variant="body1" sx={{ color: '#ECF0F1', mb: 3 }}>
                  Инновации, точность данных и постоянное развитие — вот что движет нами в создании 
                  лучших решений для HR-сообщества.
                </Typography>
              </CardContent>
            </StyledCard>
          </AnimatedSection>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedSection>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <IconWrapper>
                  <SecurityIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                  Безопасность данных
                </Typography>
                <Typography variant="body1" sx={{ color: '#ECF0F1', mb: 3 }}>
                  Мы обеспечиваем надежную защиту всех данных, используя современные технологии 
                  шифрования и безопасного хранения информации.
                </Typography>
              </CardContent>
            </StyledCard>
          </AnimatedSection>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedSection>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <IconWrapper>
                  <SpeedIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                  Скорость и эффективность
                </Typography>
                <Typography variant="body1" sx={{ color: '#ECF0F1', mb: 3 }}>
                  Наша платформа обеспечивает мгновенный доступ к актуальным данным и быструю 
                  генерацию отчетов для принятия оперативных решений.
                </Typography>
              </CardContent>
            </StyledCard>
          </AnimatedSection>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About; 