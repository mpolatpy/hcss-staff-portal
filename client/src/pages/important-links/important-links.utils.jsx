
export const filterAndCategorizeLinks = (fetchedLinks, currentUser) => {
    const filteredLinks = filterLinks(fetchedLinks, currentUser);
    return categorizeLinks(filteredLinks);
}

const filterLinks = (links, currentUser) => {
    if(!currentUser.school) return [];
    
    if(currentUser.school === 'Central Office'){
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

const categorizeLinks = (fetchedLinks) => {
    const links = {};

    for (let link of fetchedLinks){
        if(link.category in links){
            links[link.category].push(link);
        } else {
            links[link.category] = [link];
        }
    }

    return links;
}