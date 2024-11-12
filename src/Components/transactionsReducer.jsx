import { ADD_TRANSACTION, UPDATE_CHART } from './actions';

const initialState = {
    transactions: [],
    chartData: {
        monthlyTotals: Array(7).fill(0), // инициализируем массив для 7 месяцев
        incomeCategories: {},
        expenseCategories: {}
    },
};

const transactionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TRANSACTION:
            // Добавляем новую транзакцию
            return {
                ...state,
                transactions: [...state.transactions, action.payload]
            };
        case UPDATE_CHART:
            // Обновляем данные для графиков на основе текущих транзакций
            const updatedChartData = updateChartData(state.transactions); // Функция для пересчета данных для графиков
            return {
                ...state,
                chartData: updatedChartData
            };
        default:
            return state;
    }
};

// Функция для пересчета данных для графиков
const updateChartData = (transactions) => {
    const monthlyTotals = Array(7).fill(0);
    const incomeCategories = {};
    const expenseCategories = {};

    transactions.forEach(transaction => {
        const amount = transaction.amount;
        const category = transaction.category;

        // Добавляем сумму в соответствующую категорию
        if (transaction.type === 'income') {
            incomeCategories[category] = (incomeCategories[category] || 0) + amount;
        } else {
            expenseCategories[category] = (expenseCategories[category] || 0) + amount;
        }

        // Обновляем месячные итоги (предполагая, что у вас есть логика для определения месяца)
        const monthIndex = getMonthIndex(transaction.date); // Функция для получения индекса месяца
        monthlyTotals[monthIndex] += amount;
    });

    return {
        monthlyTotals,
        incomeCategories,
        expenseCategories,
    };
};

// Функция для получения индекса месяца (0-6) на основе даты
const getMonthIndex = (date) => {
    const month = new Date(date).getMonth(); // Получаем номер месяца (0-11)
    return month; // Возвращаем индекс месяца
};

export default transactionsReducer;
