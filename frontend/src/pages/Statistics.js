import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import styled from '@emotion/styled';

const StyledTypography = styled(Typography)({
  fontFamily: '"Inter", "SF Pro", sans-serif',
  fontWeight: 400,
});

const StatCard = styled(Paper)({
  padding: '24px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
});

const Statistics = () => {
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
            Статистика
          </StyledTypography>

          <Grid container spacing={3}>
            {/* Общая статистика */}
            <Grid item xs={12} md={6}>
              <StatCard>
                <StyledTypography 
                  variant="h6" 
                  gutterBottom 
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  Общая статистика
                </StyledTypography>
                <StyledTypography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Анализ рынка труда в реальном времени
                </StyledTypography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  bgcolor: 'background.default',
                  borderRadius: '8px',
                }}>
                  <StyledTypography variant="body2" color="text.secondary">
                    В разработке...
                  </StyledTypography>
                </Box>
              </StatCard>
            </Grid>

            {/* Тренды */}
            <Grid item xs={12} md={6}>
              <StatCard>
                <StyledTypography 
                  variant="h6" 
                  gutterBottom 
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  Тренды
                </StyledTypography>
                <StyledTypography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Динамика изменения спроса на навыки
                </StyledTypography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  bgcolor: 'background.default',
                  borderRadius: '8px',
                }}>
                  <StyledTypography variant="body2" color="text.secondary">
                    В разработке...
                  </StyledTypography>
                </Box>
              </StatCard>
            </Grid>

            {/* Региональная статистика */}
            <Grid item xs={12} md={6}>
              <StatCard>
                <StyledTypography 
                  variant="h6" 
                  gutterBottom 
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  Региональная статистика
                </StyledTypography>
                <StyledTypography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Сравнение рынков труда по регионам
                </StyledTypography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  bgcolor: 'background.default',
                  borderRadius: '8px',
                }}>
                  <StyledTypography variant="body2" color="text.secondary">
                    В разработке...
                  </StyledTypography>
                </Box>
              </StatCard>
            </Grid>

            {/* Прогнозы */}
            <Grid item xs={12} md={6}>
              <StatCard>
                <StyledTypography 
                  variant="h6" 
                  gutterBottom 
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  Прогнозы
                </StyledTypography>
                <StyledTypography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Предсказание трендов на основе исторических данных
                </StyledTypography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  bgcolor: 'background.default',
                  borderRadius: '8px',
                }}>
                  <StyledTypography variant="body2" color="text.secondary">
                    В разработке...
                  </StyledTypography>
                </Box>
              </StatCard>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Statistics; 