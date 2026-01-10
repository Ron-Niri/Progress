console.log('Progress App Loaded 🚀');

// Add simple interaction for demo purposes
document.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('click', (e) => {
        // Prevent triggering twice if clicking the checkbox directly
        if (e.target.tagName === 'INPUT') return;
        
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
    });
});
