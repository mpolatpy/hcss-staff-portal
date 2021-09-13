
const expressionDays = ['A', 'B', 'C', 'D', 'E'];

export const createScheduleArray = (scheduleData) => {
    const schedule = {};
    expressionDays.forEach((day) => schedule[day] = Array(6).fill(''));
    scheduleData.forEach( data => processOneCourseEntry(schedule, data));

    return schedule;
};

const processOneCourseEntry = (schedule, data) => {
    const blocks = {'1': 0, '2': 1, '3': 2, '4': 3, '7': 4, '5': 5};
    const expressions = data.expression.split(' ');
    const { course_name, section_number, room } = data;
    
    expressions.forEach(expression => {
        const block = expression[0];
        const idx = blocks[block];
        const days = getDaysFromExpression(expression);
        days.forEach(
            day => schedule[day][idx] = ({
                course_name,
                section_number,
                room
            })
        );
    })
};

const getDaysFromExpression = (expression) => {
    let scheduleDays = [];
    const days = expression.substring(2, expression.length - 1);
    const daysArray = days.split(',');

    for (let exp of daysArray) {
        if(exp.includes('-')){
            const start = expressionDays.indexOf(exp[0]);
            const end = expressionDays.indexOf(exp[exp.length - 1]);
            scheduleDays = [...scheduleDays, ...expressionDays.slice(start, end + 1)];
        } else {
            scheduleDays.push(exp);
        }
    }
    return scheduleDays;
};