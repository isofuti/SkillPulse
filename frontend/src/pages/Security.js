import React from 'react';
import { Container, Typography, Box, Paper, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityUpdateIcon from '@mui/icons-material/SecurityUpdate';

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

const Security = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      pt: { xs: 8, md: 12 },
      pb: { xs: 8, md: 12 }
    }}>
      <Container maxWidth="lg">
        <StyledTypography variant="h3" className="gradient-text" gutterBottom align="center" sx={{ mb: 6 }}>
          Безопасность данных
        </StyledTypography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <StyledTypography variant="h5" className="section-title">
                Защита данных
              </StyledTypography>
              <List>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <SecurityIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Шифрование данных" 
                    secondary="Использование современных алгоритмов шифрования"
                  />
                </StyledListItem>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <PrivacyTipIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Конфиденциальность" 
                    secondary="Строгая политика защиты персональных данных"
                  />
                </StyledListItem>
              </List>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper>
              <StyledTypography variant="h5" className="section-title">
                Правовая защита
              </StyledTypography>
              <List>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <GavelIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Соответствие законам" 
                    secondary="Соответствие требованиям законодательства о защите данных"
                  />
                </StyledListItem>
                <StyledListItem>
                  <ListItemIcon>
                    <IconWrapper>
                      <SecurityUpdateIcon />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Регулярные обновления" 
                    secondary="Постоянное обновление систем безопасности"
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

export default Security; 