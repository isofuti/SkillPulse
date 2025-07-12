import React from 'react';
import { 
    List, 
    Typography, 
    Link,
    Box,
    Chip,
    Card,
    CardContent,
    Grid,
    IconButton,
    Tooltip
} from '@mui/material';
import { formatSalary } from '../utils/formatters';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const VacancyList = ({ vacancies }) => {
    if (!vacancies || vacancies.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                Вакансии не найдены
            </Typography>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <List sx={{ width: '100%' }}>
            {vacancies.map((vacancy) => (
                <Card 
                    key={vacancy.id}
                    sx={{
                        mb: 2,
                        '&:hover': {
                            boxShadow: 3,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease'
                        }
                    }}
                >
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        {vacancy.name}
                                    </Typography>
                                    {vacancy.salary && (
                                        <Chip 
                                            label={formatSalary(vacancy.salary)}
                                            color="primary"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <BusinessIcon color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        {vacancy.employer}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <LocationOnIcon color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        {vacancy.area}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <AccessTimeIcon color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        Опубликовано: {formatDate(vacancy.published_at)}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 2,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {vacancy.snippet || 'Описание отсутствует'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Tooltip title="Открыть на hh.ru">
                                        <IconButton
                                            component={Link}
                                            href={vacancy.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            color="primary"
                                        >
                                            <OpenInNewIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </List>
    );
};

export default VacancyList; 