import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Link
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReactWordcloud from 'react-wordcloud';

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
  const [error, setError] = useState(null);

  const handleSearch = () => {
    if (eventSource) {
      eventSource.close();
    }

    setIsLoading(true);
    setStats(null);

    const regionsParam = selectedRegions.join(',');
    const newEventSource = new EventSource(`${API_BASE_URL}/api/vacancies/stream?query=${encodeURIComponent(query)}&areas=${regionsParam}`);

    newEventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStats(data);
    };

    newEventSource.onerror = () => {
      newEventSource.close();
      setIsLoading(false);
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

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          regions: selectedRegions,
        }),
      });
      // ... existing code ...
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          SkillPulse
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Анализ рынка труда
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Поисковый запрос"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
              >
                {isLoading ? <CircularProgress size={24} /> : 'Анализировать'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {stats && (
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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            )}

            {stats.word_cloud && Object.keys(stats.word_cloud).length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Популярные слова
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ReactWordcloud
                    words={Object.entries(stats.word_cloud).map(([text, value]) => ({
                      text,
                      value
                    }))}
                    options={{
                      rotations: 2,
                      rotationAngles: [-90, 0],
                      fontSizes: [12, 60]
                    }}
                  />
                </Box>
              </Paper>
            )}

            {stats.vacancies && stats.vacancies.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Список вакансий
                </Typography>
                <Grid container spacing={2}>
                  {stats.vacancies.map((vacancy) => (
                    <Grid item xs={12} key={vacancy.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
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
                          <Link href={vacancy.url} target="_blank" rel="noopener noreferrer">
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
}

export default App; 