import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Paper, Grid, TextField, Button, CircularProgress, Alert, Chip, Card, CardContent, CardActions, Link, LinearProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from '@emotion/styled';
import cloud from 'd3-cloud';
import * as d3 from 'd3';

const API_BASE_URL = 'https://skillpulse-6ayv.onrender.com';

const StyledTypography = styled(Typography)({
  fontFamily: '"Inter", "SF Pro", sans-serif',
  fontWeight: 400,
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

const Analysis = () => {
  const [query, setQuery] = useState('');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [eventSource, setEventSource] = useState(null);

  const handleSearch = async () => {
    if (selectedRegions.length === 0) {
      setError('Выберите хотя бы один регион');
      return;
    }

    setError(null);
    setIsLoading(true);
    setProgress(0);
    setStats(null);
    setTimeRemaining(null);

    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = new EventSource(
      `${API_BASE_URL}/api/vacancies/stream?query=${encodeURIComponent(query)}&regions=${selectedRegions.join(',')}`
    );

    setEventSource(newEventSource);

    newEventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'progress') {
        setProgress(data.progress);
        if (data.time_remaining) {
          setTimeRemaining(data.time_remaining);
        }
      } else if (data.type === 'complete') {
        setStats(data.stats);
        setIsLoading(false);
        newEventSource.close();
      } else if (data.type === 'error') {
        setError(data.message);
        setIsLoading(false);
        newEventSource.close();
      }
    };

    newEventSource.onerror = () => {
      setError('Произошла ошибка при подключении к серверу');
      setIsLoading(false);
      newEventSource.close();
    };
  };

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Поисковый запрос"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                variant="outlined"
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {regions.map((region) => (
                  <Chip
                    key={region.id}
                    label={region.name}
                    onClick={() => {
                      setSelectedRegions(prev => 
                        prev.includes(region.id)
                          ? prev.filter(id => id !== region.id)
                          : [...prev, region.id]
                      );
                    }}
                    color={selectedRegions.includes(region.id) ? "primary" : "default"}
                    variant={selectedRegions.includes(region.id) ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={isLoading || selectedRegions.length === 0}
                color="primary"
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Анализировать'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

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
      </Box>
    </Container>
  );
};

export default Analysis; 