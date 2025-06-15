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

const API_BASE_URL = 'http://localhost:8000';

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
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!words || !containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [words]);

  useEffect(() => {
    if (!words || !dimensions.width || !dimensions.height) return;

    // Преобразуем словарь в массив объектов
    const wordData = Object.entries(words || {}).map(([text, value]) => ({
      text,
      value: Math.max(value * 2, 10) // Минимальный размер слова
    }));

    if (wordData.length === 0) return;

    const layout = cloud()
      .size([dimensions.width, dimensions.height])
      .words(wordData)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font('Inter')
      .fontSize(d => d.value)
      .on('end', draw);

    layout.start();

    function draw(words) {
      d3.select(containerRef.current)
        .selectAll('*')
        .remove();

      d3.select(containerRef.current)
        .append('svg')
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .append('g')
        .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Inter')
        .style('fill', () => `hsl(${Math.random() * 360}, 70%, 50%)`)
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }, [words, dimensions]);

  if (!words || Object.keys(words).length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 2
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Нет данных для отображения
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '300px',
        position: 'relative',
        '& svg': {
          width: '100%',
          height: '100%'
        }
      }}
    />
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
  { id: 66, name: 'Екатеринбург' },
  { id: 53, name: 'Новосибирск' },
  { id: 3, name: 'Нижний Новгород' },
  { id: 72, name: 'Тюмень' },
  { id: 88, name: 'Краснодар' },
  { id: 99, name: 'Казань' },
  { id: 76, name: 'Ростов-на-Дону' },
  { id: 68, name: 'Воронеж' }
];

const industries = [
  'IT и разработка',
  'Маркетинг',
  'Продажи',
  'Финансы',
  'HR',
];

// Словарь ключевых слов для отраслей
const industryKeywords = {
  'IT и разработка': ['разработчик', 'программист', 'python', 'frontend', 'backend', 'java', '1C', 'devops', 'qa', 'тестировщик'],
  'Маркетинг': ['маркетолог', 'SMM', 'контент', 'реклама', 'таргетолог', 'SEO', 'PR'],
  'Продажи': ['менеджер по продажам', 'торговый представитель', 'аккаунт-менеджер', 'sales', 'b2b', 'b2c'],
  'Финансы': ['бухгалтер', 'финансист', 'аудитор', 'экономист', 'аналитик', 'финансовый менеджер'],
  'HR': ['HR', 'рекрутер', 'кадровик', 'специалист по персоналу', 'HR generalist', 'HR бизнес-партнер']
};

const Analysis = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [eventSource, setEventSource] = useState(null);
  const [customQuery, setCustomQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  const handleSearch = async () => {
    // Проверяем, что выбран регион
    if (!selectedRegion) {
      setError('Пожалуйста, выберите регион');
      return;
    }

    // Проверяем, что либо введен запрос, либо выбрана отрасль
    if (!customQuery.trim() && !selectedIndustry) {
      setError('Пожалуйста, либо введите поисковый запрос, либо выберите отрасль');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);
    setStats(null);
    setSearchStatus('Начинаем поиск...');

    try {
      const regionId = regions.find(r => r.name === selectedRegion)?.id;
      if (!regionId) {
        throw new Error('Регион не найден');
      }

      // Определяем список поисковых запросов
      let queries = [];
      if (customQuery.trim()) {
        queries = [customQuery.trim()];
        setSearchStatus(`Ищем вакансии по запросу: "${customQuery.trim()}"`);
      } else {
        queries = industryKeywords[selectedIndustry] || [selectedIndustry];
        setSearchStatus(`Ищем вакансии по ключевым словам отрасли: ${selectedIndustry}`);
      }

      let aggregatedStats = null;
      let totalQueries = queries.length;
      let completedQueries = 0;

      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        setSearchStatus(`Поиск по запросу "${query}" (${i + 1}/${queries.length})...`);
        
        const response = await fetch(`${API_BASE_URL}/api/vacancies/stats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            areas: [regionId],
            per_page: 100,
            page: 1
          }),
        });

        if (!response.ok) {
          console.error(`Ошибка при поиске по запросу "${query}":`, response.status);
          continue;
        }

        const data = await response.json();
        console.log('Получены данные:', data);

        completedQueries++;
        setProgress((completedQueries / totalQueries) * 100);

        if (!aggregatedStats) {
          aggregatedStats = data;
        } else {
          // Агрегируем результаты
          aggregatedStats.total_vacancies += data.total_vacancies;
          aggregatedStats.unique_vacancies += data.unique_vacancies;
          aggregatedStats.vacancies_with_salary += data.vacancies_with_salary;
          aggregatedStats.vacancies_without_salary += data.vacancies_without_salary;
          
          if (data.average_salary && aggregatedStats.average_salary) {
            aggregatedStats.average_salary = Math.round((aggregatedStats.average_salary + data.average_salary) / 2);
          }
          if (data.median_salary && aggregatedStats.median_salary) {
            aggregatedStats.median_salary = Math.round((aggregatedStats.median_salary + data.median_salary) / 2);
          }
          
          // Объединяем word_cloud
          if (data.word_cloud && aggregatedStats.word_cloud) {
            for (const [word, count] of Object.entries(data.word_cloud)) {
              aggregatedStats.word_cloud[word] = (aggregatedStats.word_cloud[word] || 0) + count;
            }
          }
          
          // Объединяем salary_distribution
          if (data.salary_distribution && aggregatedStats.salary_distribution) {
            for (const [range, count] of Object.entries(data.salary_distribution)) {
              aggregatedStats.salary_distribution[range] = (aggregatedStats.salary_distribution[range] || 0) + count;
            }
          }
        }
      }

      if (!aggregatedStats || aggregatedStats.total_vacancies === 0) {
        setError('По вашему запросу не найдено вакансий. Попробуйте изменить параметры поиска.');
        setSearchStatus('Поиск завершен. Вакансии не найдены.');
      } else {
        console.log('Устанавливаем статистику:', aggregatedStats);
        setStats(aggregatedStats);
        setSearchStatus(`Найдено ${aggregatedStats.total_vacancies} вакансий`);
      }
    } catch (err) {
      console.error('Ошибка при выполнении анализа:', err);
      setError('Произошла ошибка при выполнении анализа: ' + err.message);
      setSearchStatus('Произошла ошибка при поиске');
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                      required
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
                      label="Отрасль (необязательно)"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      sx={{ mb: 3 }}
                    >
                      <MenuItem value="">
                        <em>Не выбрано</em>
                      </MenuItem>
                      {industries.map((industry) => (
                        <MenuItem key={industry} value={industry}>
                          {industry}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                    <StyledTextField
                      label="Поисковый запрос (необязательно)"
                      value={customQuery}
                      onChange={e => setCustomQuery(e.target.value)}
                      fullWidth
                      margin="normal"
                      sx={{ mb: 3 }}
                      helperText="Введите запрос или выберите отрасль"
                    />
                    <StyledButton 
                      variant="contained" 
                      fullWidth 
                      onClick={handleSearch}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Поиск...' : 'Начать анализ'}
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
                    Результаты анализа
                  </Typography>
                  {isLoading && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body1" gutterBottom>
                        {searchStatus}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress || 0} 
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
                  )}
                  {error && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                      {error}
                    </Alert>
                  )}
                  {stats && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1' }}>
                        Общая статистика
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ color: '#ECF0F1' }}>
                            Всего вакансий: {stats.total_vacancies}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ color: '#ECF0F1' }}>
                            Уникальных: {stats.unique_vacancies}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ color: '#ECF0F1' }}>
                            С зарплатой: {stats.vacancies_with_salary}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ color: '#ECF0F1' }}>
                            Без зарплаты: {stats.vacancies_without_salary}
                          </Typography>
                        </Grid>
                        {stats.average_salary > 0 && (
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ color: '#ECF0F1' }}>
                              Средняя зарплата: {stats.average_salary.toLocaleString()} ₽
                            </Typography>
                          </Grid>
                        )}
                        {stats.median_salary > 0 && (
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ color: '#ECF0F1' }}>
                              Медианная зарплата: {stats.median_salary.toLocaleString()} ₽
                            </Typography>
                          </Grid>
                        )}
                      </Grid>

                      {Object.keys(stats.area_stats).length > 0 && (
                        <Box sx={{ mt: 4 }}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1' }}>
                            Статистика по регионам
                          </Typography>
                          {Object.entries(stats.area_stats).map(([area, data]) => (
                            <Box key={area} sx={{ mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ color: '#ECF0F1' }}>
                                {regions.find(r => r.id === parseInt(area.split('_')[1]))?.name || area}
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Typography variant="body2" sx={{ color: '#ECF0F1' }}>
                                    Всего: {data.total}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" sx={{ color: '#ECF0F1' }}>
                                    С зарплатой: {data.with_salary}
                                  </Typography>
                                </Grid>
                                {data.average_salary && (
                                  <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#ECF0F1' }}>
                                      Средняя: {data.average_salary.toLocaleString()} ₽
                                    </Typography>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {Object.keys(stats.word_cloud).length > 0 && (
                        <Box sx={{ mt: 4 }}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1' }}>
                            Популярные навыки
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Object.entries(stats.word_cloud)
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 20)
                              .map(([word, count]) => (
                                <Chip
                                  key={word}
                                  label={`${word} (${count})`}
                                  sx={{
                                    backgroundColor: 'rgba(15, 185, 193, 0.1)',
                                    color: '#ECF0F1',
                                    '&:hover': {
                                      backgroundColor: 'rgba(15, 185, 193, 0.2)',
                                    }
                                  }}
                                />
                              ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </StyledCard>
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Analysis; 