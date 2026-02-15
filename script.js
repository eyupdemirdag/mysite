// Logo fallback if image doesn't load
const logo = document.getElementById('logo');
if (logo) {
    logo.addEventListener('error', function() {
        // If logo doesn't load, hide it
        this.style.display = 'none';
    });
}
