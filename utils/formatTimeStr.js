export default function formatTimeStr(str) {
    return new Intl.DateTimeFormat('en', { 
        // timeStyle: 'short', 
        dateStyle: 'short' 
    }).format(new Date(str));
}