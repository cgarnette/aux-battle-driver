export const getFromCookies = (property) => {

    
    const cookie = decodeURIComponent(document.cookie);
    if (cookie.length > 0) {
        const cookieDict = cookie.split(";").map( pair => {
            const parts = pair.split("=");
            return {[parts[0]]: parts[1]};
        });

        if (!property) {
            return cookieDict;
        }
        return cookieDict[property];
    }
    return undefined;
};

export const setCookie = (cookie) => {

}