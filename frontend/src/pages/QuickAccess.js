import React from 'react';
import { Container, Typography, Box, Paper, Grid, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportIcon from '@mui/icons-material/Support';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  borderRadius: '24px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
}));

const PricingCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  borderRadius: '24px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #2C3E50 0%, #0fb9c1 100%)',
  marginRight: theme.spacing(2),
  '& svg': {
    color: '#fff',
    fontSize: '24px',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  '&.gradient-text': {
    background: 'linear-gradient(135deg, #2C3E50 0%, #0fb9c1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
  },
  '&.section-title': {
    color: '#fff',
    fontWeight: 600,
    marginBottom: theme.spacing(3),
  },
  '&.section-subtitle': {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: theme.spacing(2),
  },
  '&.price': {
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2C3E50 0%, #0fb9c1 100%)',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(15, 185, 193, 0.3)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255,255,255,0.05)',
    transform: 'translateX(10px)',
  },
  '& .MuiListItemText-primary': {
    color: '#fff',
    fontWeight: 500,
  },
  '& .MuiListItemText-secondary': {
    color: 'rgba(255,255,255,0.7)',
  },
}));

const QuickAccess = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      pt: { xs: 8, md: 12 },
      pb: { xs: 8, md: 12 }
    }}>
      <Container maxWidth="lg">
        <StyledTypography variant="h3" className="gradient-text" gutterBottom align="center" sx={{ mb: 6 }}>
          Тарифы и личный кабинет
        </StyledTypography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <PricingCard>
              <StyledTypography variant="h5" className="section-title">
                Базовый
              </StyledTypography>
              <StyledTypography className="price">
                ₽0
              </StyledTypography>
              <List>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <SpeedIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Базовый доступ" 
                    secondary="Ограниченный набор функций"
                  />
                </StyledListItem>
              </List>
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <StyledButton fullWidth>
                  Начать бесплатно
                </StyledButton>
              </Box>
            </PricingCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <PricingCard>
              <StyledTypography variant="h5" className="section-title">
                Профессиональный
              </StyledTypography>
              <StyledTypography className="price">
                ₽999/мес
              </StyledTypography>
              <List>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <SpeedIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Расширенный доступ" 
                    secondary="Все функции базового тарифа"
                  />
                </StyledListItem>
              </List>
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <StyledButton fullWidth>
                  Выбрать тариф
                </StyledButton>
              </Box>
            </PricingCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <PricingCard>
              <StyledTypography variant="h5" className="section-title">
                Корпоративный
              </StyledTypography>
              <StyledTypography className="price">
                По запросу
              </StyledTypography>
              <List>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <SpeedIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Полный доступ" 
                    secondary="Индивидуальные условия"
                  />
                </StyledListItem>
              </List>
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <StyledButton fullWidth>
                  Связаться с нами
                </StyledButton>
              </Box>
            </PricingCard>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <StyledTypography variant="h5" className="section-title">
                Личный кабинет
              </StyledTypography>
              <List>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <SecurityIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Безопасность" 
                    secondary="Защита данных и конфиденциальность"
                  />
                </StyledListItem>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <SupportIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Поддержка" 
                    secondary="Круглосуточная техническая поддержка"
                  />
                </StyledListItem>
              </List>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper>
              <StyledTypography variant="h5" className="section-title">
                Быстрый доступ
              </StyledTypography>
              <List>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <AccessTimeIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Мгновенный доступ" 
                    secondary="Немедленный доступ к данным после оплаты"
                  />
                </StyledListItem>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <SpeedIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Высокая скорость" 
                    secondary="Оптимизированная работа системы"
                  />
                </StyledListItem>
              </List>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default QuickAccess; 