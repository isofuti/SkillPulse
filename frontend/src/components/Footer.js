import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const FooterWrapper = styled('footer')({
  width: '100%',
  background: 'transparent', // Без отдельного фона
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px 0 24px 0',
});

const FooterBlock = styled(Container)({
  background: '#2C3E50',
  color: '#ECF0F1',
  borderRadius: '40px',
  boxShadow: '0 0 20px rgba(15, 185, 193, 0.15)',
  padding: '32px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '1100px',
  width: '100%',
  backdropFilter: 'blur(6px)',
});

const FooterLink = styled(Link)({
  color: '#ECF0F1',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '16px',
  borderRadius: '30px',
  padding: '4px 16px',
  transition: 'all 0.3s',
  '&:hover': {
    color: '#0fb9c1',
    background: 'rgba(15, 185, 193, 0.08)',
  },
});

const FooterIcon = styled(IconButton)({
  color: '#ECF0F1',
  borderRadius: '50%',
  transition: 'all 0.3s',
  '&:hover': {
    color: '#0fb9c1',
    background: 'rgba(15, 185, 193, 0.08)',
  },
});

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterBlock>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              О SkillPulse
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Аналитическая платформа для HR-специалистов, предоставляющая актуальные данные о рынке труда в реальном времени.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FooterIcon href="https://t.me/skillpulse" target="_blank">
                <TelegramIcon />
              </FooterIcon>
              <FooterIcon href="mailto:info@skillpulse.ru">
                <EmailIcon />
              </FooterIcon>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Контакты
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                г. Москва, ул. Примерная, д. 123
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@skillpulse.ru
            </Typography>
            <Typography variant="body2">
              Телефон: +7 (999) 123-45-67
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Навигация
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="/">Главная</FooterLink>
              <FooterLink href="/analysis">Анализ</FooterLink>
              <FooterLink href="/statistics">Статистика</FooterLink>
              <FooterLink href="/about">О нас</FooterLink>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(236, 240, 241, 0.1)', width: '100%' }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} SkillPulse. Все права защищены.
          </Typography>
        </Box>
      </FooterBlock>
    </FooterWrapper>
  );
};

export default Footer; 