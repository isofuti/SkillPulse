import React, { useState } from 'react';
import { Card, Row, Col, Button, Form, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { API_ENDPOINTS } from '../utils/config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analysis = () => {
  const [query, setQuery] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [showVacancies, setShowVacancies] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Введите поисковый запрос');
      return;
    }

    if (selectedAreas.length === 0) {
      setError('Выберите хотя бы один регион');
      return;
    }

    setLoading(true);
    setError(null);
    setStats(null);
    setShowVacancies(false);

    try {
      const response = await fetch(API_ENDPOINTS.VACANCIES + '/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          areas: selectedAreas,
          per_page: 100
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка при поиске по запросу "${query}": ${response.status}`);
      }

      const data = await response.json();
      console.log('Полученные данные:', data);
      setStats(data);
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('ru-RU').format(salary) + ' ₽';
  };

  const salaryChartData = stats?.salary_distribution ? {
    labels: stats.salary_distribution.distribution.map(d => d.range),
    datasets: [
      {
        label: 'Количество вакансий',
        data: stats.salary_distribution.distribution.map(d => d.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  const salaryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Распределение зарплат',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body>
          <h2 className="mb-4">Анализ вакансий</h2>
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Поисковый запрос</Form.Label>
              <Form.Control
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Например: Python"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Регионы</Form.Label>
              <div>
                <Form.Check
                  type="checkbox"
                  id="area-1"
                  label="Москва"
                  checked={selectedAreas.includes(1)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAreas([...selectedAreas, 1]);
                    } else {
                      setSelectedAreas(selectedAreas.filter(area => area !== 1));
                    }
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="area-2"
                  label="Санкт-Петербург"
                  checked={selectedAreas.includes(2)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAreas([...selectedAreas, 2]);
                    } else {
                      setSelectedAreas(selectedAreas.filter(area => area !== 2));
                    }
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="area-3"
                  label="Нижний Новгород"
                  checked={selectedAreas.includes(3)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAreas([...selectedAreas, 3]);
                    } else {
                      setSelectedAreas(selectedAreas.filter(area => area !== 3));
                    }
                  }}
                />
              </div>
            </Form.Group>

            <Button 
              variant="primary" 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Загрузка...
                </>
              ) : (
                'Начать анализ'
              )}
            </Button>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          {stats && (
            <div className="mt-4">
              <h3>Результаты анализа</h3>
              
              <Row className="mb-4">
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h4>Общая статистика</h4>
                      <p>Всего вакансий: {stats.total_vacancies}</p>
                      <p>Уникальных вакансий: {stats.unique_vacancies}</p>
                      <p>Вакансий с зарплатой: {stats.vacancies_with_salary}</p>
                      <p>Вакансий без зарплаты: {stats.vacancies_without_salary}</p>
                      <p>Средняя зарплата: {formatSalary(stats.average_salary)}</p>
                      <p>Медианная зарплата: {formatSalary(stats.median_salary)}</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h4>Распределение зарплат</h4>
                      {console.log('Данные для графика:', salaryChartData)}
                      {salaryChartData && (
                        <Bar data={salaryChartData} options={salaryChartOptions} />
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Button 
                variant="outline-primary" 
                className="mb-3"
                onClick={() => setShowVacancies(!showVacancies)}
              >
                {showVacancies ? 'Скрыть список вакансий' : 'Показать список вакансий'}
              </Button>

              {showVacancies && (
                <ListGroup>
                  {console.log('Список вакансий:', stats.vacancies)}
                  {stats.vacancies && stats.vacancies.map(vacancy => (
                    <ListGroup.Item key={vacancy.id}>
                      <h5>{vacancy.name}</h5>
                      <p className="mb-1">
                        <strong>Компания:</strong> {vacancy.company}
                      </p>
                      {vacancy.salary && (
                        <p className="mb-1">
                          <strong>Зарплата:</strong>{' '}
                          {vacancy.salary.from && vacancy.salary.to
                            ? `${formatSalary(vacancy.salary.from)} - ${formatSalary(vacancy.salary.to)}`
                            : vacancy.salary.from
                            ? `от ${formatSalary(vacancy.salary.from)}`
                            : vacancy.salary.to
                            ? `до ${formatSalary(vacancy.salary.to)}`
                            : 'Не указана'}
                        </p>
                      )}
                      <p className="mb-1">
                        <strong>Описание:</strong> {vacancy.description}
                      </p>
                      <a 
                        href={vacancy.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        Открыть на hh.ru
                      </a>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Analysis; 