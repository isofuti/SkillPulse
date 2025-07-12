import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ExtensionIcon from '@mui/icons-material/Extension';

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
  minHeight: '500px',
  maxHeight: 'none',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(15, 185, 193, 0.2)',
    border: '1px solid rgba(15, 185, 193, 0.3)',
  },
});

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '24px',
  paddingBottom: '24px',
  alignItems: 'center',
  '&:last-child': {
    paddingBottom: '24px',
  },
});

const FeaturesList = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: '16px',
  marginBottom: '0px',
  minHeight: 'unset',
  maxHeight: 'unset',
});

const FeatureItem = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  minHeight: '24px',
  padding: '4px 0',
});

const IconWrapper = styled(Box)({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: 'rgba(15, 185, 193, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  transition: 'all 0.3s ease',
  '& svg': {
    fontSize: '30px',
    color: '#0fb9c1',
    transition: 'all 0.3s ease',
  },
  '@media (max-width: 600px)': {
    width: '50px',
    height: '50px',
    '& svg': {
      fontSize: '25px',
    },
  },
});

const AnimatedSection = styled(Box)({
  animation: `${fadeIn} 0.8s ease-out`,
  marginBottom: '40px',
});





const ComparisonTable = styled(Table)({
  background: 'rgba(44, 62, 80, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(15, 185, 193, 0.1)',
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(15, 185, 193, 0.1)',
    padding: '16px',
  },
});



const ServiceCard = styled(Card)({
  background: 'rgba(44, 62, 80, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(15, 185, 193, 0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
  minHeight: '250px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(15, 185, 193, 0.2)',
    border: '1px solid rgba(15, 185, 193, 0.3)',
  },
  '@media (max-width: 600px)': {
    padding: '16px',
    minHeight: '220px',
  },
});

const StyledButton = styled(Button)({
  background: 'linear-gradient(135deg, #0fb9c1 0%, #2C3E50 100%)',
  color: '#ECF0F1',
  height: '40px',
  width: '200px',
  margin: '8px auto 16px auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    background: 'linear-gradient(135deg, #2C3E50 0%, #0fb9c1 100%)',
  },
});

// Новый стилизованный компонент для горизонтального списка функций
const HorizontalFeaturesList = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '12px',
  marginBottom: '16px',
  marginTop: '16px',
});

// Новый стилизованный компонент для элемента горизонтального списка
const HorizontalFeatureItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  borderRadius: '12px',
  background: 'rgba(15, 185, 193, 0.1)',
  color: '#ECF0F1',
  fontSize: '0.8rem',
  flexShrink: 0,
});

const ServiceButton = styled(Button)({
  background: 'linear-gradient(135deg, #0fb9c1 0%, #2C3E50 100%)',
  color: '#ECF0F1',
  height: '40px',
  width: '180px',
  marginTop: '20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #2C3E50 0%, #0fb9c1 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 20px rgba(15, 185, 193, 0.3)',
  },
  '@media (max-width: 600px)': {
    width: '160px',
    height: '36px',
    fontSize: '0.9rem',
  },
});

const Pricing = () => {
  const comparisonData = [
    {
      feature: 'Частота обновления данных',
      ourService: 'Каждые 1–6 часов',
      traditional: 'Раз в квартал',
      competitors: 'Раз в месяц / квартал (зависит от тарифа)',
    },
    {
      feature: 'Гибкость параметров отчёта',
      ourService: 'Любой навык/регион/период за 2 минуты',
      traditional: 'Фиксированный набор параметров, без возможности «под себя»',
      competitors: 'Ограничено предустановленными фильтрами',
    },
    {
      feature: 'Моментальные уведомления',
      ourService: 'Есть (Telegram/e-mail)',
      traditional: 'Нет',
      competitors: 'Есть, но только по крупным категориям',
    },
    {
      feature: 'Стоимость доступа',
      ourService: 'От 3 000 ₽/мес',
      traditional: 'От 50 000 ₽ за разовый отчёт',
      competitors: 'От 10 000 ₽/мес',
    },
    {
      feature: 'Экспорт данных',
      ourService: 'CSV, PDF, API без доплат',
      traditional: 'Только PDF',
      competitors: 'CSV, но часто с ограничениями и за доп. плату',
    },
    {
      feature: 'Время формирования отчёта',
      ourService: '~2 минуты',
      traditional: '~2–4 недели ожидания',
      competitors: '~1 неделя (зависит от объёма данных)',
    },
  ];

  const subscriptionPlans = [
    {
      name: 'Free',
      price: '0 ₽/мес',
      features: [
        { text: 'До 2 навыков и 1 региона', included: true },
        { text: 'Отчёты с задержкой 24 ч', included: true },
        { text: 'Без уведомлений', included: true },
        { text: 'Базовые отчёты', included: true },
        { text: 'Экспорт CSV', included: false },
        { text: 'Supply vs Demand', included: false },
        { text: 'Сопоставление нескольких навыков', included: false },
        { text: 'Telegram-уведомления', included: false },
        { text: 'Расширенные отчёты', included: false },
        { text: 'Неограниченное число навыков/регионов', included: false },
      ],
      icon: <StarIcon />,
    },
    {
      name: 'Start',
      price: '3 000 ₽/мес',
      features: [
        { text: 'До 5 навыков и 3 регионов', included: true },
        { text: 'Обновления каждые 6 ч', included: true },
        { text: 'Базовые отчёты', included: true },
        { text: 'Экспорт CSV', included: true },
        { text: 'Supply vs Demand', included: false },
        { text: 'Сопоставление нескольких навыков', included: false },
        { text: 'Telegram-уведомления', included: false },
        { text: 'Расширенные отчёты', included: false },
        { text: 'Неограниченное число навыков/регионов', included: false },
      ],
      icon: <BusinessIcon />,
    },
    {
      name: 'Pro',
      price: '8 000 ₽/мес',
      features: [
        { text: 'Неограниченное число навыков/регионов', included: true },
        { text: 'Обновления каждый час', included: true },
        { text: 'Расширенные отчёты', included: true },
        { text: 'Telegram-уведомления', included: true },
        { text: 'Supply vs Demand', included: true },
        { text: 'Сопоставление нескольких навыков', included: true },
        { text: 'Экспорт CSV', included: true },
        { text: 'Базовые отчёты', included: true },
        { text: 'Приоритетная поддержка', included: false },
        { text: 'API-доступ', included: false },
      ],
      icon: <CompareArrowsIcon />,
    },
    {
      name: 'Enterprise',
      price: 'от 20 000 ₽/мес',
      features: [
        { text: 'Кастомные интеграции (LDAP, SSO)', included: true },
        { text: 'API-доступ', included: true },
        { text: 'Приоритетная поддержка', included: true },
        { text: 'Экспертное сопровождение', included: true },
        { text: 'Внедрение внутри компании', included: true },
        { text: 'Неограниченное число навыков/регионов', included: true },
        { text: 'Расширенные отчёты', included: true },
        { text: 'Telegram-уведомления', included: true },
        { text: 'Supply vs Demand', included: true },
        { text: 'Сопоставление нескольких навыков', included: true },
      ],
      icon: <CodeIcon />,
    },
  ];

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
            Тарифы и цены
          </Typography>
        </AnimatedSection>

        <Grid container spacing={4} sx={{ height: '100%' }}>
          {subscriptionPlans.map((plan, index) => (
            <Grid item xs={12} md={6} lg={index === subscriptionPlans.length - 1 && subscriptionPlans.length > 3 ? 12 : 4} key={plan.name} sx={{ height: '100%' }}>
              <AnimatedSection>
                <StyledCard>
                  <StyledCardContent>
                    <IconWrapper>
                      {plan.icon}
                    </IconWrapper>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ color: '#0fb9c1', mb: '8px', fontWeight: 700 }}>
                      {plan.price}
                    </Typography>
                    <StyledButton
                      variant="contained"
                    >
                      Выбрать тариф
                    </StyledButton>

                    {plan.name === 'Enterprise' ? (
                      <HorizontalFeaturesList>
                        {plan.features.map((feature, idx) => (
                          <HorizontalFeatureItem key={idx}>
                            {feature.included ? (
                              <CheckCircleIcon sx={{ color: '#0fb9c1', fontSize: '1rem', flexShrink: 0 }} />
                            ) : (
                              <CancelIcon sx={{ color: 'rgba(236, 240, 241, 0.5)', fontSize: '1rem', flexShrink: 0 }} />
                            )}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: feature.included ? '#ECF0F1' : 'rgba(236, 240, 241, 0.5)',
                                textDecoration: feature.included ? 'none' : 'line-through',
                                lineHeight: 1.2,
                              }}
                            >
                              {feature.text}
                            </Typography>
                          </HorizontalFeatureItem>
                        ))}
                      </HorizontalFeaturesList>
                    ) : (
                      <FeaturesList>
                        {plan.features.map((feature, index) => (
                          <FeatureItem key={index}>
                            {feature.included ? (
                              <CheckCircleIcon sx={{ color: '#0fb9c1', mt: 0.5, flexShrink: 0 }} />
                            ) : (
                              <CancelIcon sx={{ color: 'rgba(236, 240, 241, 0.5)', mt: 0.5, flexShrink: 0 }} />
                            )}
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: feature.included ? '#ECF0F1' : 'rgba(236, 240, 241, 0.5)',
                                textDecoration: feature.included ? 'none' : 'line-through',
                                lineHeight: 1.4,
                                flex: 1
                              }}
                            >
                              {feature.text}
                            </Typography>
                          </FeatureItem>
                        ))}
                      </FeaturesList>
                    )}
                  </StyledCardContent>
                </StyledCard>
              </AnimatedSection>
            </Grid>
          ))}
        </Grid>

        <AnimatedSection>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              color: '#ECF0F1',
              fontWeight: 700,
              mb: 4,
              background: 'linear-gradient(135deg, #0fb9c1 0%, #2C3E50 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Дополнительные услуги
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <ServiceCard>
                <IconWrapper>
                  <LightbulbIcon />
                </IconWrapper>
                <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                  Разовая платная аналитика
                </Typography>
                <Typography variant="body1" sx={{ color: '#ECF0F1', textAlign: 'center', mb: 2 }}>
                  Глубокий отчёт по 10 навыкам и 5 регионам
                </Typography>
                <Typography variant="body2" sx={{ color: '#ECF0F1', textAlign: 'center', mb: 3, opacity: 0.9 }}>
                  Вручную собирается и оформляется экспертами:
                  <br />• Более подробные графики
                  <br />• Дополнительный сегмент «опыт работы»
                  <br />• Инсайты по конкуренции
                </Typography>
                <Typography variant="h6" sx={{ color: '#0fb9c1', fontWeight: 600, mb: 2 }}>
                  30 000 ₽
                </Typography>
                <Typography variant="caption" sx={{ color: '#ECF0F1', opacity: 0.8, mb: 2, display: 'block' }}>
                  за разовый заказ
                </Typography>
                <ServiceButton variant="contained">Связаться</ServiceButton>
              </ServiceCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ServiceCard>
                <IconWrapper>
                  <ExtensionIcon />
                </IconWrapper>
                <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                  White label и API-доступ
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#ECF0F1', fontWeight: 600, mb: 1, textAlign: 'center' }}>
                    White label для рекрутинговых агентств:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ECF0F1', mb: 1, opacity: 0.9, textAlign: 'center' }}>
                    • Брендированный интерфейс
                    <br />• Собственный домен
                    <br />• Обучающее видео
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: '#ECF0F1', fontWeight: 600, mb: 1, textAlign: 'center' }}>
                    API-доступ:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ECF0F1', opacity: 0.9, textAlign: 'center' }}>
                    Программный доступ к агрегированным данным
                    <br />• Бесплатно до 100 000 запросов/мес
                    <br />• Далее 0,05 ₽ за запрос
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#0fb9c1', fontWeight: 600, textAlign: 'center' }}>
                    200 000 ₽
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ECF0F1', opacity: 0.8, display: 'block', textAlign: 'center' }}>
                    разово + 10 000 ₽/мес за техподдержку
                  </Typography>
                </Box>
                <ServiceButton variant="contained">Связаться</ServiceButton>
              </ServiceCard>
            </Grid>
          </Grid>
        </AnimatedSection>

        <AnimatedSection>
          <StyledCard sx={{ mt: 6 }}>
            <StyledCardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                Сравнение с конкурентами
              </Typography>
              <TableContainer component={Paper} sx={{ background: 'rgba(44, 62, 80, 0.7)', backdropFilter: 'blur(10px)' }}>
                <ComparisonTable>
                  <TableHead>
                    <TableRow>
                      <TableCell>Функция</TableCell>
                      <TableCell>Наш сервис</TableCell>
                      <TableCell>Традиционный отчёт</TableCell>
                      <TableCell>Аналоги (HeadHunter Analytics)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {comparisonData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.feature}</TableCell>
                        <TableCell sx={{ color: '#0fb9c1' }}>{row.ourService}</TableCell>
                        <TableCell>{row.traditional}</TableCell>
                        <TableCell>{row.competitors}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </ComparisonTable>
              </TableContainer>
            </StyledCardContent>
          </StyledCard>
        </AnimatedSection>
      </Container>
    </>
  );
};

export default Pricing; 