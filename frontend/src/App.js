import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  Chip,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Link,
  LinearProgress,
  ThemeProvider,
  createTheme,
  Avatar
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import cloud from 'd3-cloud';
import * as d3 from 'd3';
import Logo from './assets/Logo.png';

// Создаем тему с новой цветовой схемой
const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50', // Основной цвет
      light: '#34495E',
      dark: '#1A252F',
    },
    secondary: {
      main: '#0fb9c1', // Акцентный цвет
      light: '#4FC3F7',
      dark: '#0288D1',
    },
    background: {
      default: '#ECF0F1', // Фоновый цвет
      paper: '#FFFFFF',
    },
    warning: {
      main: '#F1C40F', // Цвет уведомлений
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      color: '#2C3E50',
    },
    h5: {
      color: '#0fb9c1',
    },
    h6: {
      color: '#2C3E50',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

const regions = [
  { id: '1', name: 'Москва' },
  { id: '2', name: 'Санкт-Петербург' },
  { id: '3', name: 'Екатеринбург' },
  { id: '4', name: 'Новосибирск' },
  { id: '66', name: 'Нижний Новгород' },
  { id: '76', name: 'Ростов-на-Дону' },
  { id: '88', name: 'Красноярск' },
  { id: '99', name: 'Воронеж' },
  { id: '104', name: 'Казань' },
  { id: '1118', name: 'Уфа' }
];

const API_BASE_URL = 'https://skillpulse-6ayv.onrender.com';

function App() {
  const [query, setQuery] = useState('python');
  const [selectedRegions, setSelectedRegions] = useState(['1']);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [eventSource, setEventSource] = useState(null);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [error, setError] = useState(null);
  const startTime = useRef(null);

  const handleSearch = () => {
    if (eventSource) {
      eventSource.close();
    }

    setIsLoading(true);
    setStats(null);
    setProgress(0);
    setTimeRemaining(null);
    setError(null);
    startTime.current = Date.now();

    const regionsParam = selectedRegions.join(',');
    const newEventSource = new EventSource(`${API_BASE_URL}/api/vacancies/stream?query=${encodeURIComponent(query)}&areas=${regionsParam}`);

    newEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStats(data);
        
        if (data.total_vacancies > 0) {
          const currentProgress = (data.unique_vacancies / data.total_vacancies) * 100;
          setProgress(currentProgress);
          
          const elapsedTime = (Date.now() - startTime.current) / 1000;
          const estimatedTotalTime = elapsedTime / (currentProgress / 100);
          const remainingTime = estimatedTotalTime - elapsedTime;
          setTimeRemaining(Math.round(remainingTime));
        }
      } catch (err) {
        console.error('Error parsing event data:', err);
        setError('Ошибка при обработке данных');
      }
    };

    newEventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      newEventSource.close();
      setIsLoading(false);
      setProgress(100);
      setTimeRemaining(0);
      setError('Ошибка соединения с сервером');
    };

    setEventSource(newEventSource);
  };

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const formatSalary = (salary) => {
    if (!salary) return 'Не указана';
    const { from, to, currency } = salary;
    if (from && to) {
      return `${from.toLocaleString()} - ${to.toLocaleString()} ${currency}`;
    } else if (from) {
      return `от ${from.toLocaleString()} ${currency}`;
    } else if (to) {
      return `до ${to.toLocaleString()} ${currency}`;
    }
    return 'Не указана';
  };

  const formatTimeRemaining = (seconds) => {
    if (seconds === null) return '';
    if (seconds < 60) return `${seconds} сек`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} мин ${remainingSeconds} сек`;
  };

  const WordCloud = ({ words }) => {
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
      if (!words || !svgRef.current) return;

      const updateDimensions = () => {
        const container = svgRef.current.parentElement;
        setDimensions({
          width: container.clientWidth,
          height: Math.max(400, container.clientHeight)
        });
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, [words]);

    useEffect(() => {
      if (!words || !svgRef.current || dimensions.width === 0) return;

      const layout = cloud()
        .size([dimensions.width, dimensions.height])
        .words(words.map(word => ({
          text: word.text,
          size: word.value * 2,
          value: word.value
        })))
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font("Roboto")
        .fontSize(d => d.size)
        .on("end", draw);

      layout.start();

      function draw(words) {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g")
          .attr("transform", `translate(${dimensions.width / 2},${dimensions.height / 2})`);

        g.selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", d => `${d.size}px`)
          .style("font-family", "Roboto")
          .style("fill", d => {
            // Создаем градиент цветов на основе значения
            const hue = 200 + (d.value * 40); // От голубого к синему
            const saturation = 70 + (d.value * 20); // Увеличиваем насыщенность
            const lightness = 50 + (d.value * 10); // Увеличиваем яркость
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          })
          .style("opacity", d => 0.7 + (d.value * 0.3)) // Увеличиваем прозрачность для больших слов
          .attr("text-anchor", "middle")
          .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
          .text(d => d.text)
          .style("cursor", "pointer")
          .on("mouseover", function() {
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 1)
              .style("font-weight", "bold");
          })
          .on("mouseout", function() {
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", d => 0.7 + (d.value * 0.3))
              .style("font-weight", "normal");
          });
      }
    }, [words, dimensions]);

    return (
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ width: '100%', height: '100%' }}
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 3,
              gap: 2
            }}>
              <Avatar
                src={Logo}
                alt="SkillPulse Logo"
                sx={{ 
                  width: 80, 
                  height: 80,
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              />
              <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                  SkillPulse
                </Typography>
                <Typography variant="h5" component="h2" color="secondary">
                  Анализ рынка труда
                </Typography>
              </Box>
            </Box>

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
                  <Typography variant="body1" gutterBottom>
                    Прогресс анализа: {Math.round(progress)}%
                  </Typography>
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
                  <Typography variant="body2" color="text.secondary">
                    Осталось времени: {formatTimeRemaining(timeRemaining)}
                  </Typography>
                )}
              </Paper>
            )}

            {stats && !isLoading && (
              <>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Статистика
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography>
                        Всего вакансий: {stats.total_vacancies}
                      </Typography>
                      <Typography>
                        Обработано: {stats.unique_vacancies} ({Math.round(stats.unique_vacancies / stats.total_vacancies * 100)}%)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography>
                        С зарплатой: {stats.vacancies_with_salary} ({Math.round(stats.vacancies_with_salary / stats.unique_vacancies * 100)}%)
                      </Typography>
                      <Typography>
                        Без зарплаты: {stats.vacancies_without_salary} ({Math.round(stats.vacancies_without_salary / stats.unique_vacancies * 100)}%)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography>
                        Средняя зарплата: {stats.average_salary ? `${Math.round(stats.average_salary).toLocaleString()} ₽` : 'Н/Д'}
                      </Typography>
                      <Typography>
                        Медианная зарплата: {stats.median_salary ? `${Math.round(stats.median_salary).toLocaleString()} ₽` : 'Н/Д'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {stats.salary_distribution && Object.keys(stats.salary_distribution).length > 0 && (
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Распределение зарплат
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={Object.entries(stats.salary_distribution).map(([range, count]) => ({
                          range,
                          count
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ECF0F1" />
                          <XAxis dataKey="range" stroke="#2C3E50" />
                          <YAxis stroke="#2C3E50" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#FFFFFF',
                              border: 'none',
                              borderRadius: 8,
                              boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#0fb9c1" 
                            strokeWidth={2}
                            dot={{ fill: '#0fb9c1', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                )}

                <Grid item xs={12}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Популярные навыки
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <WordCloud words={stats.word_cloud} />
                    </Box>
                  </Paper>
                </Grid>

                {stats.vacancies && stats.vacancies.length > 0 && (
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Список вакансий
                    </Typography>
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
                              <Typography variant="h6" gutterBottom color="primary">
                                {vacancy.name}
                              </Typography>
                              <Typography color="text.secondary" gutterBottom>
                                {vacancy.employer} • {vacancy.area}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {formatSalary(vacancy.salary)}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {vacancy.description}
                              </Typography>
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
      </Box>
    </ThemeProvider>
  );
}

export default App; 