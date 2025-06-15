export const formatSalary = (salary) => {
    if (!salary) return 'Зарплата не указана';
    
    const { from, to, currency } = salary;
    const currencySymbol = {
        'RUR': '₽',
        'RUB': '₽',
        'USD': '$',
        'EUR': '€'
    }[currency] || currency;

    if (from && to) {
        return `${from.toLocaleString()} - ${to.toLocaleString()} ${currencySymbol}`;
    } else if (from) {
        return `от ${from.toLocaleString()} ${currencySymbol}`;
    } else if (to) {
        return `до ${to.toLocaleString()} ${currencySymbol}`;
    }

    return 'Зарплата не указана';
}; 