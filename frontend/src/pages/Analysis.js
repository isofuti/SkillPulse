import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Paper, Grid, TextField, Button, CircularProgress, Alert, Chip, Card, CardContent, CardActions, Link, LinearProgress, MenuItem, FormControl, InputLabel, Select, List, ListItem, ListItemText, Divider, Table, TableCell, TableRow, TableBody } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import styled from '@emotion/styled';
import cloud from 'd3-cloud';

// Стилизованные компоненты
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(44, 62, 80, 0.9)',
  color: '#fff',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const StyledTagCloud = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& .custom-tag-cloud': {
    width: '100%',
    height: '100%',
  },
});

// Компонент страницы анализа
const Analysis = () => {
  const [query, setQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [areas, setAreas] = useState([]);
  const [flattenedAreas, setFlattenedAreas] = useState([]);
  const canvasRef = useRef(null);

  // Список основных регионов
  const mainAreas = [
    { id: "1", name: "Москва" },
    { id: "2", name: "Санкт-Петербург" },
    { id: "3", name: "Новосибирск" },
    { id: "4", name: "Екатеринбург" },
    { id: "66", name: "Нижний Новгород" },
    { id: "78", name: "Казань" },
    { id: "72", name: "Тюмень" },
    { id: "54", name: "Красноярск" },
    { id: "99", name: "Воронеж" },
    { id: "88", name: "Ростов-на-Дону" }
  ];

  // Функция для "сплющивания" иерархии регионов
  const flattenAreas = (areas) => {
    // Находим Россию (id: "113")
    const russia = areas.find(area => area.id === "113");
    if (!russia) return [];

    let result = [];
    // Добавляем только регионы России
    russia.areas.forEach(area => {
      result.push({
        id: area.id,
        name: area.name
      });
      // Добавляем подрегионы, если они есть
      if (area.areas && area.areas.length > 0) {
        area.areas.forEach(subArea => {
          result.push({
            id: subArea.id,
            name: `${area.name} - ${subArea.name}`
          });
        });
      }
    });
    return result;
  };

  // Загрузка списка регионов при монтировании компонента
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/areas');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке регионов');
        }
        const data = await response.json();
        setAreas(data);
        // Создаем плоский список регионов с полными путями
        const flattened = flattenAreas(data);
        setFlattenedAreas(flattened);
      } catch (error) {
        console.error('Ошибка при загрузке регионов:', error);
        setError('Не удалось загрузить список регионов');
      }
    };

    fetchAreas();
  }, []);

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStats(null);

    try {
      // Находим ID региона по имени
      const area = mainAreas.find(a => a.name.toLowerCase() === selectedArea.toLowerCase());
      if (!area) {
        throw new Error('Регион не найден. Пожалуйста, выберите регион из списка.');
      }

      const response = await fetch('http://localhost:8000/api/vacancies/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          areas: [area.id],
          per_page: 100,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }

      const data = await response.json();
      console.log('Полученные данные:', data);
      setStats(data);
    } catch (error) {
      console.error('Ошибка:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Форматирование зарплаты
  const formatSalary = (salary) => {
    if (!salary) return 'Не указана';
    
    let amount = null;
    if (salary.from !== null && salary.from !== undefined) {
      amount = salary.from;
    } else if (salary.to !== null && salary.to !== undefined) {
      amount = salary.to;
    }
    
    if (amount === null) return 'Не указана';
    
    const currency = salary.currency || 'RUR';
    const formattedAmount = new Intl.NumberFormat('ru-RU').format(amount);
    return `${formattedAmount} ${currency}`;
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Подготовка данных для графика зарплат
  const salaryChartData = React.useMemo(() => {
    if (!stats?.salary_ranges) {
      console.log('Нет данных для графика');
      return null;
    }

    console.log('Создаем данные для графика из:', stats.salary_ranges);
    
    const data = {
      labels: ['0-50k', '50k-100k', '100k-150k', '150k-200k', '200k-250k', '250k-300k', '300k+'],
      datasets: [
        {
          label: 'Количество вакансий',
          data: [
            stats.salary_ranges['0-50000'] || 0,
            stats.salary_ranges['50000-100000'] || 0,
            stats.salary_ranges['100000-150000'] || 0,
            stats.salary_ranges['150000-200000'] || 0,
            stats.salary_ranges['200000-250000'] || 0,
            stats.salary_ranges['250000-300000'] || 0,
            stats.salary_ranges['300000+'] || 0,
          ],
          backgroundColor: 'rgba(15, 185, 193, 0.6)',
          borderColor: 'rgba(15, 185, 193, 1)',
          borderWidth: 1,
        },
      ],
    };

    console.log('Данные для графика:', data);
    return data;
  }, [stats]);

  // Подготовка данных для облака слов
  const wordCloudData = React.useMemo(() => {
    if (!stats?.word_cloud) {
      console.log('Нет данных для облака слов');
      return [];
    }

    console.log('Создаем данные для облака слов из:', stats.word_cloud);

    return Object.entries(stats.word_cloud)
      .filter(([text]) => !text.match(/^\d+$/)) // Исключаем числовые значения
      .filter(([text]) => text.length > 2) // Исключаем короткие слова
      .map(([text, value], index) => ({
        key: `${text}-${index}`,
        text,
        value: value * 10,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50);
  }, [stats]);

  // Рендеринг графика зарплат
  const renderSalaryChart = () => {
    if (!salaryChartData) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Нет данных для отображения графика
          </Typography>
        </Box>
      );
    }

    const data = salaryChartData.datasets[0].data.map((value, index) => ({
      range: salaryChartData.labels[index],
      value: value
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <RechartsTooltip />
          <Bar dataKey="value" fill="#0FB9C1" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Рендеринг облака слов
  const renderWordCloud = () => {
    if (!wordCloudData.length) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Нет данных для отображения облака слов
          </Typography>
        </Box>
      );
    }

    return (
      <StyledTagCloud>
        <canvas ref={canvasRef} />
      </StyledTagCloud>
    );
  };

  // Рендеринг списка вакансий
  const renderVacanciesList = () => {
    if (!stats?.vacancies?.length) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Нет данных о вакансиях
          </Typography>
        </Box>
      );
    }

    return (
      <List>
        {stats.vacancies.map((vacancy) => (
          <React.Fragment key={vacancy.id}>
            <ListItem>
              <ListItemText
                primary={
                  <Link href={vacancy.url} target="_blank" rel="noopener noreferrer">
                    {vacancy.name}
                  </Link>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {formatSalary(vacancy.salary)}
                    </Typography>
                    {` — ${vacancy.employer} — ${vacancy.area}`}
                  </>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Анализ вакансий
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Поисковый запрос"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Регион"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                required
                helperText="Доступные регионы: Москва, Санкт-Петербург, Новосибирск, Екатеринбург, Нижний Новгород, Казань, Тюмень, Красноярск, Воронеж, Ростов-на-Дону"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Анализировать'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ width: '100%', mb: 4 }}>
          <LinearProgress />
        </Box>
      )}

      {stats && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
                  Общая статистика
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Всего вакансий" 
                      secondary={stats.total_vacancies}
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: '#0FB9C1' }}
                    />
                  </ListItem>
                  <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemText 
                      primary="Уникальных вакансий" 
                      secondary={stats.unique_vacancies}
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: '#0FB9C1' }}
                    />
                  </ListItem>
                  <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemText 
                      primary="Вакансий с зарплатой" 
                      secondary={stats.vacancies_with_salary}
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: '#0FB9C1' }}
                    />
                  </ListItem>
                  <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemText 
                      primary="Вакансий без зарплаты" 
                      secondary={stats.vacancies_without_salary}
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: '#0FB9C1' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
                  Зарплаты
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Средняя зарплата" 
                      secondary={`${new Intl.NumberFormat('ru-RU').format(stats.average_salary)} ₽`}
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: '#0FB9C1' }}
                    />
                  </ListItem>
                  <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                  <ListItem>
                    <ListItemText 
                      primary="Медианная зарплата" 
                      secondary={`${new Intl.NumberFormat('ru-RU').format(stats.median_salary)} ₽`}
                      primaryTypographyProps={{ color: '#fff' }}
                      secondaryTypographyProps={{ color: '#0FB9C1' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Распределение зарплат
                </Typography>
                {renderSalaryChart()}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Облако навыков
                </Typography>
                {renderWordCloud()}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Список вакансий
                </Typography>
                {renderVacanciesList()}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Analysis;