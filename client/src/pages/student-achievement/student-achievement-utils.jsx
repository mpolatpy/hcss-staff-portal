
export const getTargetAndSlgData = ( records, header ) => {
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
}