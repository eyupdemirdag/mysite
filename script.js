// Logo error handling and debugging
const logo = document.getElementById('logo');
if (logo) {
    logo.addEventListener('error', function() {
        console.error('❌ Logo failed to load!');
        console.error('Check the following:');
        console.error('1. Is logo.png uploaded to your hosting?');
        console.error('2. Is the filename exactly "logo.png" (case-sensitive)?');
        console.error('3. Is logo.png in the same directory as index.html?');
        console.error('4. Check file permissions (should be 644)');
        console.error('5. Try accessing: ' + window.location.origin + '/logo.png');
        // Don't hide it, so user can see there's a problem
    });
    
    logo.addEventListener('load', function() {
        console.log('✅ Logo loaded successfully!');
    });
}
