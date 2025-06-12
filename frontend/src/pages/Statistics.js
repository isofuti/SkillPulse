import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';

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

const AnimatedSection = styled(Box)({
  animation: `${fadeIn} 0.8s ease-out`,
  marginBottom: '40px',
});

// Пример данных для графиков
const salaryData = [
  { month: 'Янв', salary: 120000 },
  { month: 'Фев', salary: 125000 },
  { month: 'Мар', salary: 130000 },
  { month: 'Апр', salary: 128000 },
  { month: 'Май', salary: 135000 },
  { month: 'Июн', salary: 140000 },
];

const vacancyData = [
  { name: 'Frontend', value: 35 },
  { name: 'Backend', value: 25 },
  { name: 'Fullstack', value: 20 },
  { name: 'DevOps', value: 15 },
  { name: 'QA', value: 5 },
];

const COLORS = ['#0fb9c1', '#2C3E50', '#34495E', '#3498DB', '#2980B9'];

const Statistics = () => {
  return (
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
          Статистика рынка труда
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
                  Динамика зарплат
                </Typography>
                <Box sx={{ height: 300, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salaryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(236, 240, 241, 0.1)" />
                      <XAxis dataKey="month" stroke="#ECF0F1" />
                      <YAxis stroke="#ECF0F1" />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(44, 62, 80, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#ECF0F1',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="salary"
                        stroke="#0fb9c1"
                        strokeWidth={2}
                        dot={{ fill: '#0fb9c1' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
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
                  <PieChartIcon />
                </IconWrapper>
                <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 600 }}>
                  Распределение вакансий
                </Typography>
                <Box sx={{ height: 300, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vacancyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {vacancyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(44, 62, 80, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#ECF0F1',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </StyledCard>
          </AnimatedSection>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistics; 