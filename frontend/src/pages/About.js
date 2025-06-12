import React from 'react';
import { Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';
import styled from '@emotion/styled';

const StyledTypography = styled(Typography)({
  fontFamily: '"Inter", "SF Pro", sans-serif',
  fontWeight: 400,
});

const TechCard = styled(Paper)({
  padding: '24px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
});

const technologies = [
  {
    name: 'React',
    description: 'Современный JavaScript-фреймворк для создания пользовательских интерфейсов',
    icon: '⚛️',
  },
  {
    name: 'Material-UI',
    description: 'Библиотека компонентов для создания красивых и отзывчивых интерфейсов',
    icon: '🎨',
  },
  {
    name: 'FastAPI',
    description: 'Высокопроизводительный Python-фреймворк для создания API',
    icon: '⚡',
  },
  {
    name: 'D3.js',
    description: 'Библиотека для создания интерактивных визуализаций данных',
    icon: '📊',
  },
];

const About = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: { xs: 3, md: 6 }, mb: 4 }}>
          <StyledTypography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              fontFamily: '"Montserrat", sans-serif',
              mb: 4,
            }}
          >
            О проекте
          </StyledTypography>

          {/* Миссия */}
          <Box sx={{ mb: 6 }}>
            <StyledTypography 
              variant="h5" 
              gutterBottom 
              color="primary"
              sx={{ 
                fontWeight: 600,
                fontFamily: '"Montserrat", sans-serif',
                mb: 3,
              }}
            >
              Миссия
            </StyledTypography>
            <StyledTypography 
              variant="body1" 
              paragraph 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: 'text.secondary',
              }}
            >
              Сделать аналитику рынка труда доступной и актуальной каждому, 
              кто нанимает, обучает или управляет талантами.
            </StyledTypography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Ценности */}
          <Box sx={{ mb: 6 }}>
            <StyledTypography 
              variant="h5" 
              gutterBottom 
              color="primary"
              sx={{ 
                fontWeight: 600,
                fontFamily: '"Montserrat", sans-serif',
                mb: 3,
              }}
            >
              Ценности
            </StyledTypography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TechCard>
                  <Box sx={{ fontSize: '2.5rem', mb: 2 }}>📊</Box>
                  <StyledTypography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ fontWeight: 600 }}
                  >
                    Актуальность
                  </StyledTypography>
                  <StyledTypography variant="body2" color="text.secondary">
                    Обновление каждый час
                  </StyledTypography>
                </TechCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <TechCard>
                  <Box sx={{ fontSize: '2.5rem', mb: 2 }}>⚙️</Box>
                  <StyledTypography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ fontWeight: 600 }}
                  >
                    Простота
                  </StyledTypography>
                  <StyledTypography variant="body2" color="text.secondary">
                    Минимум действий — максимум пользы
                  </StyledTypography>
                </TechCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <TechCard>
                  <Box sx={{ fontSize: '2.5rem', mb: 2 }}>🔍</Box>
                  <StyledTypography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ fontWeight: 600 }}
                  >
                    Честность
                  </StyledTypography>
                  <StyledTypography variant="body2" color="text.secondary">
                    Данные без приукрас
                  </StyledTypography>
                </TechCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <TechCard>
                  <Box sx={{ fontSize: '2.5rem', mb: 2 }}>🚀</Box>
                  <StyledTypography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ fontWeight: 600 }}
                  >
                    Скорость
                  </StyledTypography>
                  <StyledTypography variant="body2" color="text.secondary">
                    Алерты, быстрые отчёты, Telegram
                  </StyledTypography>
                </TechCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <TechCard>
                  <Box sx={{ fontSize: '2.5rem', mb: 2 }}>🧭</Box>
                  <StyledTypography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ fontWeight: 600 }}
                  >
                    Навигация
                  </StyledTypography>
                  <StyledTypography variant="body2" color="text.secondary">
                    Помогаем действовать, а не просто анализировать
                  </StyledTypography>
                </TechCard>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Технологии */}
          <Box>
            <StyledTypography 
              variant="h5" 
              gutterBottom 
              color="primary"
              sx={{ 
                fontWeight: 600,
                fontFamily: '"Montserrat", sans-serif',
                mb: 3,
              }}
            >
              Технологии
            </StyledTypography>
            <Grid container spacing={3}>
              {technologies.map((tech) => (
                <Grid item xs={12} sm={6} md={3} key={tech.name}>
                  <TechCard>
                    <Box sx={{ fontSize: '2.5rem', mb: 2 }}>{tech.icon}</Box>
                    <StyledTypography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ fontWeight: 600 }}
                    >
                      {tech.name}
                    </StyledTypography>
                    <StyledTypography variant="body2" color="text.secondary">
                      {tech.description}
                    </StyledTypography>
                  </TechCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default About; 