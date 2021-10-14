
export const getTargetAndSlgData = (records, header) => {
    const idx1 = header.indexOf('Target Rating');
    const idx2 = header.indexOf('SLG Rating');
    const targetData = {}, slgData = {};

    records.forEach(record => {
        const targetRating = record[idx1];
        const slgRating = record[idx2];
        targetData[targetRating] = (targetData[targetRating] || 0) + 1;
        slgData[slgRating] = (slgData[slgRating] || 0) + 1;
    });

    return {
        targetData,
        slgData
    };
};

export const mapRawData = (data, teacherList, schools, departments, gradeLevels, targetRatings) => {
    if (!data.length) return null;

    const header = data[0];
    const teacherIndex = header.indexOf('Teacher'),
        gradeIndex = header.indexOf('Grade'),
        schoolIndex = header.indexOf('School'),
        targetRatingIndex = header.indexOf('Target Rating'),
        targetScoreIndex = header.indexOf('SLG Target');
    const mappedData = {};

    for (let school of schools) {
        mappedData[school] = {};
        for (let department of departments) {
            mappedData[school][department] = {};
            for (let grade of gradeLevels) {
                mappedData[school][department][grade] = {
                    valueCounts: 0,
                    total: 0
                };
                for (let targetRating of targetRatings) {
                    mappedData[school][department][grade][targetRating] = 0;
                }
            }
        }
    }

    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const school = row[schoolIndex],
            teacher = row[teacherIndex],
            grade = row[gradeIndex],
            targetRating = row[targetRatingIndex],
            targetScore = row[targetScoreIndex];
        const { department } = teacherList[teacher];
        if (targetRating !== '') mappedData[school][department][grade][targetRating]++;
        if (targetScore !== '') {
            mappedData[school][department][grade].valueCounts++;
            mappedData[school][department][grade].total += parseInt(targetScore);
        }
    }
    return mappedData;
}