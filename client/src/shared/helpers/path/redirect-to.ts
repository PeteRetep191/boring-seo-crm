// ============================
// Redirect To
// ============================
const redirectTo = (page: 'home' | 'login') => {
    switch (page) {
        case 'home':
            if(window.location.pathname !== '/') {
                window.location.href = '/';
            }
            break;
        case 'login':
            if(window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            break;
    }
}

export default redirectTo;