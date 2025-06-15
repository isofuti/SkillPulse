import React, { useEffect, useRef } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#2C3E50',
  padding: theme.spacing(3),
  height: '100%',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(15, 185, 193, 0.2)',
  },
}));

const WordCloud = ({ words }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!words || Object.keys(words).length === 0) return;

    // Очищаем предыдущий контент
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 800;
    const height = 400;

    // Создаем SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);

    // Преобразуем объект в массив для d3-cloud
    const wordData = Object.entries(words).map(([text, value]) => ({
      text,
      size: Math.log(value) * 15 + 20,
      value
    }));

    // Настройка облака слов
    const layout = cloud()
      .size([width, height])
      .words(wordData)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font('Arial')
      .fontSize(d => d.size)
      .on('end', draw);

    layout.start();

    function draw(words) {
      svg.selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Arial')
        .style('fill', () => {
          // Используем бирюзовый цвет с разной прозрачностью
          return `rgba(15, 185, 193, ${0.3 + Math.random() * 0.7})`;
        })
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style('fill', '#0fb9c1')
            .style('font-weight', 'bold');
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style('fill', () => `rgba(15, 185, 193, ${0.3 + Math.random() * 0.7})`)
            .style('font-weight', 'normal');
        });
    }
  }, [words]);

  if (!words || Object.keys(words).length === 0) {
    return (
      <StyledPaper>
        <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 'bold' }}>
          Облако навыков
        </Typography>
        <Typography color="#ECF0F1">
          Нет данных для отображения
        </Typography>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom sx={{ color: '#ECF0F1', fontWeight: 'bold' }}>
        Облако навыков
      </Typography>
      <Box sx={{ 
        width: '100%', 
        height: 400, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <svg ref={svgRef}></svg>
      </Box>
    </StyledPaper>
  );
};

export default WordCloud; 