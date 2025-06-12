import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Paper, Grid, TextField, Button, CircularProgress, Alert, Chip, Card, CardContent, CardActions, Link, LinearProgress, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from '@emotion/styled';
import cloud from 'd3-cloud';
import * as d3 from 'd3';
import { keyframes } from '@emotion/react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';

const API_BASE_URL = 'https://skillpulse-6ayv.onrender.com';

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

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#ECF0F1',
    '& fieldset': {
      borderColor: 'rgba(15, 185, 193, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(15, 185, 193, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0fb9c1',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#ECF0F1',
  },
  '& .MuiSelect-icon': {
    color: '#ECF0F1',
  },
});

const StyledButton = styled(Button)({
  background: 'linear-gradient(135deg, #0fb9c1 0%, #2C3E50 100%)',
  color: '#ECF0F1',
  padding: '10px 24px',
  borderRadius: '30px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 20px rgba(15, 185, 193, 0.3)',
  },
});

const AnimatedSection = styled(Box)({
  animation: `${fadeIn} 0.8s ease-out`,
  marginBottom: '40px',
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

const WordCloud = ({ words }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!words || words.length === 0) return;

    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [words]);

  useEffect(() => {
    if (!words || words.length === 0 || dimensions.width === 0) return;

    const layout = cloud()
      .size([dimensions.width, dimensions.height])
      .words(words.map(d => ({
        text: d.text,
        size: d.value * 2,
        value: d.value
      })))
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font("Inter")
      .fontSize(d => d.size)
      .on("end", draw);

    layout.start();

    function draw(words) {
      d3.select(svgRef.current)
        .selectAll("*")
        .remove();

      const svg = d3.select(svgRef.current)
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`);

      svg.selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "Inter")
        .style("fill", () => d3.schemeCategory10[~~(Math.random() * 10)])
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text)
        .style("cursor", "pointer")
        .on("mouseover", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style("font-size", d => `${d.size * 1.2}px`);
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style("font-size", d => `${d.size}px`);
        });
    }
  }, [words, dimensions]);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};

const formatSalary = (salary) => {
  if (!salary) return 'Не указана';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(salary);
};

const formatTimeRemaining = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const prepareSalaryData = (distribution) => {
  if (!distribution) return [];
  
  return Object.entries(distribution)
    .map(([range, count]) => ({
      label: range,
      count: count
    }))
    .sort((a, b) => {
      const getMinSalary = (range) => parseInt(range.split('-')[0]);
      return getMinSalary(a.label) - getMinSalary(b.label);
    });
};

const regions = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
  { id: 3, name: 'Новосибирск' },
  { id: 4, name: 'Екатеринбург' },
  { id: 5, name: 'Казань' },
  { id: 6, name: 'Нижний Новгород' },
  { id: 7, name: 'Красноярск' },
  { id: 8, name: 'Челябинск' },
  { id: 9, name: 'Самара' },
  { id: 10, name: 'Уфа' },
  { id: 11, name: 'Ростов-на-Дону' },
  { id: 12, name: 'Омск' },
  { id: 13, name: 'Краснодар' },
  { id: 14, name: 'Воронеж' },
  { id: 15, name: 'Пермь' },
  { id: 16, name: 'Волгоград' }
];

const industries = [
  'IT и разработка',
  'Маркетинг',
  'Продажи',
  'Финансы',
  'HR',
];

const Analysis = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [eventSource, setEventSource] = useState(null);

  const handleSearch = async () => {
    if (!selectedRegion || !selectedIndustry) {
      setError('Пожалуйста, выберите регион и отрасль');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Здесь будет логика запроса к API
      console.log('Анализ для:', { region: selectedRegion, industry: selectedIndustry });
    } catch (err) {
      setError('Произошла ошибка при выполнении анализа');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

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
            Анализ рынка труда
          </Typography>
        </AnimatedSection>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <AnimatedSection>
              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <IconWrapper>
                    <TrendingUpIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                    Выберите параметры анализа
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <StyledTextField
                      select
                      fullWidth
                      label="Регион"
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      sx={{ mb: 3 }}
                    >
                      {regions.map((region) => (
                        <MenuItem key={region.id} value={region.name}>
                          {region.name}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                    <StyledTextField
                      select
                      fullWidth
                      label="Отрасль"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      sx={{ mb: 3 }}
                    >
                      {industries.map((industry) => (
                        <MenuItem key={industry} value={industry}>
                          {industry}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                    <StyledButton variant="contained" fullWidth onClick={handleSearch}>
                      Начать анализ
                    </StyledButton>
                  </Box>
                </CardContent>
              </StyledCard>
            </AnimatedSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <AnimatedSection>
              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <IconWrapper>
                    <AssessmentIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                    Метрики анализа
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ECF0F1', mb: 3 }}>
                    Мы анализируем следующие показатели:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <BarChartIcon sx={{ color: '#0fb9c1' }} />
                      <Typography variant="body1" sx={{ color: '#ECF0F1' }}>
                        Средняя заработная плата
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PieChartIcon sx={{ color: '#0fb9c1' }} />
                      <Typography variant="body1" sx={{ color: '#ECF0F1' }}>
                        Распределение вакансий
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TrendingUpIcon sx={{ color: '#0fb9c1' }} />
                      <Typography variant="body1" sx={{ color: '#ECF0F1' }}>
                        Тренды рынка труда
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </AnimatedSection>
          </Grid>
        </Grid>

        {isLoading && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ mb: 2 }}>
              <StyledTypography variant="body1" gutterBottom>
                Прогресс анализа: {Math.round(progress)}%
              </StyledTypography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'rgba(15, 185, 193, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#0fb9c1',
                    transition: 'transform 0.4s linear',
                  }
                }} 
              />
            </Box>
            {timeRemaining !== null && (
              <StyledTypography variant="body2" color="text.secondary">
                Осталось времени: {formatTimeRemaining(timeRemaining)}
              </StyledTypography>
            )}
          </Paper>
        )}

        {stats && !isLoading && (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <StyledTypography variant="h6" gutterBottom>
                Статистика
              </StyledTypography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <StyledTypography>
                    Всего вакансий: {stats.total_vacancies}
                  </StyledTypography>
                  <StyledTypography>
                    Обработано: {stats.unique_vacancies} ({Math.round(stats.unique_vacancies / stats.total_vacancies * 100)}%)
                  </StyledTypography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <StyledTypography>
                    С зарплатой: {stats.vacancies_with_salary} ({Math.round(stats.vacancies_with_salary / stats.unique_vacancies * 100)}%)
                  </StyledTypography>
                  <StyledTypography>
                    Без зарплаты: {stats.vacancies_without_salary} ({Math.round(stats.vacancies_without_salary / stats.unique_vacancies * 100)}%)
                  </StyledTypography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <StyledTypography>
                    Средняя зарплата: {formatSalary(stats.average_salary)}
                  </StyledTypography>
                  <StyledTypography>
                    Медианная зарплата: {formatSalary(stats.median_salary)}
                  </StyledTypography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <StyledTypography>
                    Максимальная зарплата: {formatSalary(stats.max_salary)}
                  </StyledTypography>
                  <StyledTypography>
                    Минимальная зарплата: {formatSalary(stats.min_salary)}
                  </StyledTypography>
                </Grid>
              </Grid>
            </Paper>

            {stats.salary_distribution && Object.keys(stats.salary_distribution).length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <StyledTypography variant="h6" gutterBottom>
                  Распределение зарплат
                </StyledTypography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={prepareSalaryData(stats.salary_distribution)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECF0F1" />
                      <XAxis 
                        dataKey="label" 
                        stroke="#2C3E50"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis 
                        stroke="#2C3E50"
                        label={{ 
                          value: 'Количество вакансий', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' }
                        }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF',
                          border: 'none',
                          borderRadius: 8,
                          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value, name, props) => [
                          value,
                          'Количество вакансий'
                        ]}
                        labelFormatter={(label) => `Диапазон: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#0fb9c1" 
                        strokeWidth={2}
                        dot={{ 
                          fill: '#0fb9c1', 
                          strokeWidth: 2,
                          r: 4
                        }}
                        activeDot={{ 
                          r: 6,
                          fill: '#0fb9c1',
                          stroke: '#FFFFFF',
                          strokeWidth: 2
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            )}

            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <StyledTypography variant="h6" gutterBottom>
                  Популярные навыки
                </StyledTypography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <WordCloud words={stats.word_cloud} />
                </Box>
              </Paper>
            </Grid>

            {stats.vacancies && stats.vacancies.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <StyledTypography variant="h6" gutterBottom>
                  Список вакансий
                </StyledTypography>
                <Grid container spacing={2}>
                  {stats.vacancies.map((vacancy) => (
                    <Grid item xs={12} key={vacancy.id}>
                      <Card sx={{ 
                        '&:hover': {
                          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease'
                        }
                      }}>
                        <CardContent>
                          <StyledTypography variant="h6" gutterBottom color="primary">
                            {vacancy.name}
                          </StyledTypography>
                          <StyledTypography color="text.secondary" gutterBottom>
                            {vacancy.employer} • {vacancy.area}
                          </StyledTypography>
                          <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {formatSalary(vacancy.salary)}
                          </StyledTypography>
                          <StyledTypography variant="body2" sx={{ mt: 1 }}>
                            {vacancy.description}
                          </StyledTypography>
                        </CardContent>
                        <CardActions>
                          <Link 
                            href={vacancy.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ 
                              color: 'secondary.main',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            Открыть на hh.ru
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Analysis; 