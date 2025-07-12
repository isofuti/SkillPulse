import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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



const FooterWrapper = styled('footer')({
  width: '100%',
  background: 'transparent',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px 0 24px 0',
});

const FooterBlock = styled(Container)({
  background: 'rgba(44, 62, 80, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '40px',
  border: '1px solid rgba(15, 185, 193, 0.1)',
  boxShadow: '0 8px 30px rgba(15, 185, 193, 0.15)',
  padding: '32px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '1100px',
  width: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    border: '1px solid rgba(15, 185, 193, 0.3)',
    boxShadow: '0 8px 30px rgba(15, 185, 193, 0.25)',
  },
});

const FooterLink = styled(Link)({
  color: '#ECF0F1',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '16px',
  borderRadius: '30px',
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#0fb9c1',
    background: 'rgba(15, 185, 193, 0.08)',
    transform: 'translateY(-2px)',
  },
});

const FooterIcon = styled(IconButton)({
  color: '#ECF0F1',
  borderRadius: '50%',
  transition: 'all 0.3s ease',
  background: 'rgba(15, 185, 193, 0.08)',
  '&:hover': {
    color: '#0fb9c1',
    background: 'rgba(15, 185, 193, 0.15)',
    transform: 'translateY(-2px)',
  },
});

const AnimatedSection = styled(Box)({
  animation: `${fadeIn} 0.8s ease-out`,
  width: '100%',
});

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterBlock>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <AnimatedSection>
              <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 700 }}>
                О SkillPulse
              </Typography>
              <Typography variant="body2" sx={{ color: '#ECF0F1', mb: 2, opacity: 0.9 }}>
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
            </AnimatedSection>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AnimatedSection>
              <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 700 }}>
                Контакты
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: '#0fb9c1' }} />
                <Typography variant="body2" sx={{ color: '#ECF0F1', opacity: 0.9 }}>
                  г. Москва, ул. Примерная, д. 123
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#ECF0F1', mb: 1, opacity: 0.9 }}>
                Email: info@skillpulse.ru
              </Typography>
              <Typography variant="body2" sx={{ color: '#ECF0F1', opacity: 0.9 }}>
                Телефон: +7 (999) 123-45-67
              </Typography>
            </AnimatedSection>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AnimatedSection>
              <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 700 }}>
                Навигация
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FooterLink href="/">Главная</FooterLink>
                <FooterLink href="/analysis">Анализ</FooterLink>
                <FooterLink href="/pricing">Цены</FooterLink>
                <FooterLink href="/statistics">Статистика</FooterLink>
                <FooterLink href="/about">О нас</FooterLink>
              </Box>
            </AnimatedSection>
          </Grid>
        </Grid>
        <Box sx={{ 
          mt: 4, 
          pt: 2, 
          borderTop: '1px solid rgba(236, 240, 241, 0.1)', 
          width: '100%',
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ color: '#ECF0F1', opacity: 0.7 }}>
            © {new Date().getFullYear()} SkillPulse. Все права защищены.
          </Typography>
        </Box>
      </FooterBlock>
    </FooterWrapper>
  );
};

export default Footer; 