import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, TextField, Button, CircularProgress, Alert, Card, CardContent, MenuItem, FormControl, InputLabel, Select, List, ListItem, ListItemText, Divider, IconButton, Tooltip, Dialog, DialogContent, DialogTitle, ListItemIcon, Menu } from '@mui/material';
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

import WordCloud from '../components/WordCloud';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CodeIcon from '@mui/icons-material/Code';
import TableChartIcon from '@mui/icons-material/TableChart';
import DataObjectIcon from '@mui/icons-material/DataObject';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { API_ENDPOINTS } from '../utils/config';

// Инициализация pdfmake с шрифтами
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Анимации
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const squareAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const lineAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const dotAnimation = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.5); opacity: 1; }
`;

// Стилизованные компоненты
const AnimatedBackground = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, #2C3E50 0%, #0fb9c1 100%)',
  backgroundSize: '400% 400%',
  animation: `${gradientAnimation} 15s ease infinite`,
  zIndex: -1,
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

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#2C3E50',
  color: '#ECF0F1',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(15, 185, 193, 0.2)',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#2C3E50',
  padding: theme.spacing(3),
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(15, 185, 193, 0.2)',
  },
}));

const SearchPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#2C3E50',
  padding: theme.spacing(3),
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(15, 185, 193, 0.2)',
  },
  '& .MuiInputLabel-root': {
    color: '#ECF0F1',
  },
  '& .MuiOutlinedInput-root': {
    color: '#ECF0F1',
    '& fieldset': {
      borderColor: '#0fb9c1',
    },
    '&:hover fieldset': {
      borderColor: '#0fb9c1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0fb9c1',
    },
  },
  '& .MuiSelect-icon': {
    color: '#ECF0F1',
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: '#0fb9c1',
  },
}));



// Компонент страницы анализа
const Analysis = () => {
  const [query, setQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [pdfProgress, setPdfProgress] = useState({
    isGenerating: false,
    currentStep: '',
    steps: [],
    error: null
  });
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

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

      const response = await fetch(API_ENDPOINTS.VACANCIES + '/stats', {
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



  // Подготовка данных для графика зарплат
  const salaryChartData = React.useMemo(() => {
    if (!stats?.salary_ranges) {
      console.log('Нет данных для графика');
      return [];
    }

    console.log('Создаем данные для графика из:', stats.salary_ranges);
    
    return Object.entries(stats.salary_ranges).map(([range, count]) => ({
      name: range,
      value: count
    }));
  }, [stats]);





  // Функция для скачивания отчета
  const downloadReport = async () => {
    if (!stats) return;
    
    setPdfProgress({
      isGenerating: true,
      currentStep: 'Подготовка документа...',
      steps: [],
      error: null
    });

    try {
      // Инициализация PDF
      setPdfProgress(prev => ({
        ...prev,
        currentStep: 'Инициализация PDF...',
        steps: [...prev.steps, { text: 'Подготовка документа', completed: true }]
      }));

      // Заголовок и основная информация
      setPdfProgress(prev => ({
        ...prev,
        currentStep: 'Добавление основной информации...',
        steps: [...prev.steps, { text: 'Инициализация PDF', completed: true }]
      }));

      // График распределения зарплат
      setPdfProgress(prev => ({
        ...prev,
        currentStep: 'Генерация графика зарплат...',
        steps: [...prev.steps, { text: 'Добавление основной информации', completed: true }]
      }));

      let salaryChartImage = null;
      try {
        const chartElement = document.querySelector('.salary-chart');
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 1,
            useCORS: true,
            logging: false,
            backgroundColor: '#2C3E50'
          });
          salaryChartImage = canvas.toDataURL('image/jpeg', 0.8);
        }
      } catch (chartError) {
        console.error('Ошибка при генерации графика:', chartError);
      }

      // Облако слов
      setPdfProgress(prev => ({
        ...prev,
        currentStep: 'Генерация облака слов...',
        steps: [...prev.steps, { text: 'Генерация графика зарплат', completed: true }]
      }));

      let wordCloudImage = null;
      try {
        const wordCloudElement = document.querySelector('.word-cloud');
        if (wordCloudElement) {
          const canvas = await html2canvas(wordCloudElement, {
            scale: 1,
            useCORS: true,
            logging: false,
            backgroundColor: '#2C3E50'
          });
          wordCloudImage = canvas.toDataURL('image/jpeg', 0.8);
        }
      } catch (wordCloudError) {
        console.error('Ошибка при генерации облака слов:', wordCloudError);
      }

      // Список вакансий
      setPdfProgress(prev => ({
        ...prev,
        currentStep: 'Добавление списка вакансий...',
        steps: [...prev.steps, { text: 'Генерация облака слов', completed: true }]
      }));

      // Ограничиваем количество вакансий для оптимизации
      const maxVacancies = 30;
      const vacanciesToShow = stats.vacancies.slice(0, maxVacancies);

      // Создаем документ
      const docDefinition = {
        content: [
          {
            text: 'Анализ рынка вакансий',
            style: 'header',
            alignment: 'center'
          },
          {
            text: '\n'
          },
          {
            table: {
              widths: ['*', '*'],
              body: [
                ['Параметр', 'Значение'],
                ['Поисковый запрос', query],
                ['Регион', selectedArea]
              ]
            },
            layout: 'lightHorizontalLines'
          },
          {
            text: '\n'
          },
          {
            table: {
              widths: ['*', '*'],
              body: [
                ['Показатель', 'Значение'],
                ['Всего вакансий', stats.total_vacancies.toString()],
                ['Средняя зарплата', `${stats.average_salary.toLocaleString()} ₽`],
                ['Медианная зарплата', `${stats.median_salary.toLocaleString()} ₽`]
              ]
            },
            layout: 'lightHorizontalLines'
          },
          {
            text: '\n'
          }
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            color: '#2C3E50',
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            color: '#0fb9c1',
            margin: [0, 10, 0, 5]
          }
        },
        defaultStyle: {
          fontSize: 12,
          color: '#2C3E50'
        }
      };

      // Добавляем графики, если они есть
      if (salaryChartImage) {
        docDefinition.content.push(
          { text: 'Распределение зарплат', style: 'subheader' },
          { image: salaryChartImage, width: 500 },
          { text: '\n' }
        );
      }

      if (wordCloudImage) {
        docDefinition.content.push(
          { text: 'Облако слов', style: 'subheader' },
          { image: wordCloudImage, width: 500 },
          { text: '\n' }
        );
      }

      // Добавляем список вакансий
      const vacanciesTable = {
        table: {
          headerRows: 1,
          widths: [30, '*', '*', 100],
          body: [
            ['№', 'Название', 'Компания', 'Зарплата'],
            ...vacanciesToShow.map((vacancy, index) => [
              (index + 1).toString(),
              vacancy.name,
              vacancy.employer,
              vacancy.salary ? formatSalary(vacancy.salary) : 'Не указана'
            ])
          ]
        },
        layout: 'lightHorizontalLines'
      };

      docDefinition.content.push(
        { text: 'Список вакансий', style: 'subheader' },
        vacanciesTable
      );

      // Финальный шаг
      setPdfProgress(prev => ({
        ...prev,
        currentStep: 'Сохранение документа...',
        steps: [...prev.steps, { text: 'Добавление списка вакансий', completed: true }]
      }));

      // Создаем и скачиваем PDF
      pdfMake.createPdf(docDefinition).download(`анализ_вакансий_${query}_${selectedArea}.pdf`);

      setPdfProgress(prev => ({
        ...prev,
        currentStep: 'Готово!',
        steps: [...prev.steps, { text: 'Сохранение документа', completed: true }]
      }));

      // Закрываем диалог через 2 секунды после успешного завершения
      setTimeout(() => {
        setPdfProgress({
          isGenerating: false,
          currentStep: '',
          steps: [],
          error: null
        });
      }, 2000);

    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
      setPdfProgress(prev => ({
        ...prev,
        error: 'Ошибка при генерации PDF отчета'
      }));
    }
  };

  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const exportToFormat = async (format) => {
    if (!stats) return;
    
    setExportLoading(true);
    handleExportMenuClose();
    
    try {
      // Получаем ID региона из названия
      const areaId = mainAreas.find(area => area.name === selectedArea)?.id;
      if (!areaId) {
        throw new Error('Регион не найден');
      }

      const response = await fetch(`/api/vacancies/export/${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          areas: [parseInt(areaId)],
          per_page: 100
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка экспорта: ${response.statusText}`);
      }

      // Получаем имя файла из заголовка
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `вакансии_${query}_${selectedArea}.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Скачиваем файл
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error(`Ошибка при экспорте в ${format}:`, error);
      setError(`Ошибка при экспорте в ${format.toUpperCase()}: ${error.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  // Функция для рендеринга списка вакансий
  const renderVacanciesList = () => {
    if (!stats?.vacancies || stats.vacancies.length === 0) {
      return null;
    }

    return (
      <Grid item xs={12}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 'bold' }}>
            Список вакансий ({stats.vacancies.length})
          </Typography>
          <List>
            {stats.vacancies.slice(0, 10).map((vacancy, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ color: '#ECF0F1', fontWeight: 'bold' }}>
                      {vacancy.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ color: '#0fb9c1' }}>
                        {vacancy.employer?.name || 'Компания не указана'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ECF0F1' }}>
                        {formatSalary(vacancy.salary)}
                      </Typography>
                      {vacancy.snippet?.requirement && (
                        <Typography variant="body2" sx={{ color: '#ECF0F1', opacity: 0.8 }}>
                          {vacancy.snippet.requirement}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
          {stats.vacancies.length > 10 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#ECF0F1', opacity: 0.7 }}>
                Показано 10 из {stats.vacancies.length} вакансий
              </Typography>
            </Box>
          )}
        </StyledPaper>
      </Grid>
    );
  };

  return (
    <>
      <AnimatedBackground>
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: '#ECF0F1',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Анализ рынка вакансий
          </Typography>
          {stats && (
            <>
              <Tooltip title="Скачать отчет">
                <IconButton 
                  onClick={handleExportMenuOpen}
                  disabled={exportLoading || pdfProgress.isGenerating}
                  sx={{ 
                    color: '#0fb9c1',
                    '&:hover': {
                      color: '#0da8af',
                    }
                  }}
                >
                  {exportLoading ? <CircularProgress size={24} /> : <MoreVertIcon />}
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={exportMenuAnchor}
                open={Boolean(exportMenuAnchor)}
                onClose={handleExportMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#2C3E50',
                    color: '#ECF0F1',
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        backgroundColor: '#34495E',
                      },
                    },
                  }
                }}
              >
                <MenuItem onClick={() => exportToFormat('json')}>
                  <DataObjectIcon sx={{ mr: 2, color: '#0fb9c1' }} />
                  Экспорт в JSON
                </MenuItem>
                <MenuItem onClick={() => exportToFormat('csv')}>
                  <TableChartIcon sx={{ mr: 2, color: '#0fb9c1' }} />
                  Экспорт в CSV
                </MenuItem>
                <MenuItem onClick={() => exportToFormat('xml')}>
                  <CodeIcon sx={{ mr: 2, color: '#0fb9c1' }} />
                  Экспорт в XML
                </MenuItem>
                <Divider sx={{ backgroundColor: '#ECF0F1', opacity: 0.3 }} />
                <MenuItem onClick={downloadReport}>
                  <PictureAsPdfIcon sx={{ mr: 2, color: '#0fb9c1' }} />
                  Экспорт в PDF
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Форма поиска */}
        <SearchPaper elevation={3} sx={{ mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Поисковый запрос"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Регион</InputLabel>
                  <Select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    label="Регион"
                  >
                    {mainAreas.map((area) => (
                      <MenuItem key={area.id} value={area.name}>
                        {area.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{ 
                    height: '100%',
                    backgroundColor: '#0fb9c1',
                    '&:hover': {
                      backgroundColor: '#0da8af',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Анализировать'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </SearchPaper>

        {/* Сообщение об ошибке */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, backgroundColor: '#F1C40F' }}>
            {error}
          </Alert>
        )}

        {/* Результаты анализа */}
        {stats && (
          <Grid container spacing={3}>
            {/* Статистика */}
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 'bold' }}>
                    Общая статистика
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Всего вакансий" 
                        secondary={stats.total_vacancies} 
                        primaryTypographyProps={{ color: '#ECF0F1' }}
                        secondaryTypographyProps={{ color: '#0fb9c1' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Средняя зарплата" 
                        secondary={`${stats.average_salary.toLocaleString()} ₽`}
                        primaryTypographyProps={{ color: '#ECF0F1' }}
                        secondaryTypographyProps={{ color: '#0fb9c1' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Медианная зарплата" 
                        secondary={`${stats.median_salary.toLocaleString()} ₽`}
                        primaryTypographyProps={{ color: '#ECF0F1' }}
                        secondaryTypographyProps={{ color: '#0fb9c1' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* График распределения зарплат */}
            <Grid item xs={12} md={8}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 'bold' }}>
                  Распределение зарплат
                </Typography>
                <Box sx={{ height: 300 }} className="salary-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECF0F1" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#ECF0F1"
                        tick={{ fill: '#ECF0F1' }}
                      />
                      <YAxis 
                        stroke="#ECF0F1"
                        tick={{ fill: '#ECF0F1' }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#2C3E50',
                          border: '1px solid #0fb9c1',
                          borderRadius: '4px',
                          color: '#ECF0F1',
                          boxShadow: '0 2px 10px rgba(15, 185, 193, 0.1)'
                        }}
                        formatter={(value) => [`${value} вакансий`, 'Количество']}
                        labelFormatter={(label) => `Диапазон: ${label}`}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#0fb9c1"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </StyledPaper>
            </Grid>

            {/* Облако слов */}
            <Grid item xs={12} className="word-cloud">
              <WordCloud words={stats?.word_cloud} />
            </Grid>

            {/* Список вакансий */}
            {renderVacanciesList()}
          </Grid>
        )}

        {/* Диалог прогресса */}
        <Dialog
          open={pdfProgress.isGenerating}
          PaperProps={{
            sx: {
              backgroundColor: '#2C3E50',
              color: '#ECF0F1',
              padding: 2,
              minWidth: '400px'
            }
          }}
        >
          <DialogTitle sx={{ color: '#ECF0F1', textAlign: 'center' }}>
            Генерация отчета
          </DialogTitle>
          <DialogContent>
            {pdfProgress.error ? (
              <Box sx={{ textAlign: 'center', color: '#F1C40F' }}>
                <ErrorIcon sx={{ fontSize: 40, mb: 2 }} />
                <Typography>{pdfProgress.error}</Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setPdfProgress({
                    isGenerating: false,
                    currentStep: '',
                    steps: [],
                    error: null
                  })}
                  sx={{ mt: 2, bgcolor: '#0fb9c1', '&:hover': { bgcolor: '#0da8af' } }}
                >
                  Закрыть
                </Button>
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <CircularProgress sx={{ color: '#0fb9c1', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#0fb9c1' }}>
                    {pdfProgress.currentStep}
                  </Typography>
                </Box>
                
                <List>
                  {pdfProgress.steps.map((step, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: '#0fb9c1' }} />
                      </ListItemIcon>
                      <ListItemText primary={step.text} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default Analysis;