document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to dashboard
    if (sessionStorage.getItem('smartmove_admin_token') === 'true') {
        window.location.href = 'index.html';
    }

    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');

    function checkValidity() {
        const uValue = document.getElementById('username').value.trim();
        const pValue = document.getElementById('password').value.trim();
        
        if (uValue && pValue) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    loginForm.addEventListener('input', checkValidity);
    loginForm.addEventListener('submit', handleLogin);

    // Clear errors on input
    const inputs = loginForm.querySelectorAll('.check-valid');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('invalid');
            const errorElement = document.getElementById(`error-${this.id}`);
            if (errorElement) {
                errorElement.style.opacity = '0';
                setTimeout(() => errorElement.style.display = 'none', 300);
            }
            document.getElementById('loginMessage').style.display = 'none';
        });
    });
});

function showError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`error-${inputId}`);
    if (input && errorElement) {
        input.classList.add('invalid');
        errorElement.style.display = 'block';
        void errorElement.offsetWidth;
        errorElement.style.opacity = '1';
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const uInput = document.getElementById('username');
    const pInput = document.getElementById('password');
    const uValue = uInput.value.trim();
    const pValue = pInput.value.trim();
    
    let isValid = true;
    
    if (!uValue) { showError('username'); isValid = false; }
    if (!pValue) { showError('password'); isValid = false; }
    
    if (!isValid) return;

    // Hardcoded authentication
    if (uValue === 'admin' && pValue === 'admin123') {
        sessionStorage.setItem('smartmove_admin_token', 'true');
        SmartMoveUtils.showToast('Authentication successful.', 'success');
        setTimeout(() => window.location.href = 'index.html', 800);
    } else {
        const msg = document.getElementById('loginMessage');
        msg.style.display = 'block';
        SmartMoveUtils.showToast('Authentication failed. Invalid credentials.', 'error');
        uInput.value = '';
        pInput.value = '';
        document.getElementById('submitBtn').disabled = true;
    }
}
