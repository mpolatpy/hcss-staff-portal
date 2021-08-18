
export const filterLinks = (links, currentUser) => {
    if(currentUser.school.toLowerCase() === 'central office'){
        if(currentUser.role === 'superadmin'){
            return links;
        } else {
            return links.filter(link => {
                if(link.category === 'Department'){
                    return link.school.toLowerCase() === currentUser.department.toLowerCase();
                }
                return link.school.toLowerCase() !== 'superadmin only'
            });
        }  
    } else {
        return links.filter (
            link => (
                link.school.toLowerCase() === currentUser.school.toLowerCase() 
                ||
                link.school.toLowerCase() === currentUser.department.toLowerCase()
                || 
                link.school.toLowerCase() === 'district - all'
            )
        );
    }
};