document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const genderInputs = document.querySelectorAll('input[name="gender"]');

    // Função para exibir mensagem de erro
    function displayError(inputElement, message) {
        const errorSpan = document.getElementById(inputElement.id + 'Error');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
        inputElement.classList.add('invalid'); // Adiciona classe para estilização de erro, se quiser
    }

    // Função para remover mensagem de erro
    function clearError(inputElement) {
        const errorSpan = document.getElementById(inputElement.id + 'Error');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
        inputElement.classList.remove('invalid');
    }

    // Função para validar email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Função para validar telefone (formato básico)
    function isValidPhoneNumber(phone) {
        // Permite dígitos, parênteses, espaços, hifens
        return /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(phone);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        let isValid = true;

        // Validação Primeiro Nome
        if (firstNameInput.value.trim() === '') {
            displayError(firstNameInput, 'Por favor, digite seu primeiro nome.');
            isValid = false;
        } else {
            clearError(firstNameInput);
        }

        // Validação Sobrenome
        if (lastNameInput.value.trim() === '') {
            displayError(lastNameInput, 'Por favor, digite seu sobrenome.');
            isValid = false;
        } else {
            clearError(lastNameInput);
        }

        // Validação Email
        if (emailInput.value.trim() === '') {
            displayError(emailInput, 'Por favor, digite seu e-mail.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            displayError(emailInput, 'Por favor, digite um e-mail válido.');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        // Validação Celular
        if (phoneNumberInput.value.trim() === '') {
            displayError(phoneNumberInput, 'Por favor, digite seu celular.');
            isValid = false;
        } else if (!isValidPhoneNumber(phoneNumberInput.value.trim())) {
            displayError(phoneNumberInput, 'Formato de celular inválido (ex: (XX) XXXX-XXXX ou XXXXX-XXXX).');
            isValid = false;
        } else {
            clearError(phoneNumberInput);
        }

        // Validação Senha
        if (passwordInput.value.length < 6) {
            displayError(passwordInput, 'A senha deve ter no mínimo 6 caracteres.');
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        // Validação Confirmar Senha
        if (confirmPasswordInput.value.trim() === '') {
            displayError(confirmPasswordInput, 'Por favor, confirme sua senha.');
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            displayError(confirmPasswordInput, 'As senhas não coincidem.');
            isValid = false;
        } else {
            clearError(confirmPasswordInput);
        }

        // Validação Gênero
        let genderSelected = false;
        for (const radio of genderInputs) {
            if (radio.checked) {
                genderSelected = true;
                break;
            }
        }
        const genderErrorSpan = document.getElementById('genderError');
        if (!genderSelected) {
            if (genderErrorSpan) {
                genderErrorSpan.textContent = 'Por favor, selecione seu gênero.';
            }
            isValid = false;
        } else {
            if (genderErrorSpan) {
                genderErrorSpan.textContent = '';
            }
        }

        // Se tudo estiver válido, pode processar o formulário e redirecionar
        if (isValid) {
            alert('Cadastro enviado com sucesso! Redirecionando para a página principal...');
            // Em uma aplicação real, você enviaria esses dados para um servidor para registro.
            // Por enquanto, apenas redirecionamos.
            window.location.href = 'masculino.html'; // Redireciona para a sua página principal
        }
    });

    // Adiciona validação em tempo real ao sair do campo (blur)
    firstNameInput.addEventListener('blur', () => {
        if (firstNameInput.value.trim() === '') {
            displayError(firstNameInput, 'Por favor, digite seu primeiro nome.');
        } else {
            clearError(firstNameInput);
        }
    });

    lastNameInput.addEventListener('blur', () => {
        if (lastNameInput.value.trim() === '') {
            displayError(lastNameInput, 'Por favor, digite seu sobrenome.');
        } else {
            clearError(lastNameInput);
        }
    });

    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim() === '') {
            displayError(emailInput, 'Por favor, digite seu e-mail.');
        } else if (!isValidEmail(emailInput.value.trim())) {
            displayError(emailInput, 'Por favor, digite um e-mail válido.');
        } else {
            clearError(emailInput);
        }
    });

    phoneNumberInput.addEventListener('blur', () => {
        if (phoneNumberInput.value.trim() === '') {
            displayError(phoneNumberInput, 'Por favor, digite seu celular.');
        } else if (!isValidPhoneNumber(phoneNumberInput.value.trim())) {
            displayError(phoneNumberInput, 'Formato de celular inválido (ex: (XX) XXXX-XXXX ou XXXXX-XXXX).');
        } else {
            clearError(phoneNumberInput);
        }
    });

    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value.length < 6) {
            displayError(passwordInput, 'A senha deve ter no mínimo 6 caracteres.');
        } else {
            clearError(passwordInput);
            // Revalida a confirmação de senha se a senha mudar
            if (confirmPasswordInput.value !== '' && confirmPasswordInput.value !== passwordInput.value) {
                displayError(confirmPasswordInput, 'As senhas não coincidem.');
            } else {
                clearError(confirmPasswordInput);
            }
        }
    });

    confirmPasswordInput.addEventListener('blur', () => {
        if (confirmPasswordInput.value.trim() === '') {
            displayError(confirmPasswordInput, 'Por favor, confirme sua senha.');
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            displayError(confirmPasswordInput, 'As senhas não coincidem.');
        } else {
            clearError(confirmPasswordInput);
        }
    });

    // Remove erro do gênero ao selecionar
    genderInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            const genderErrorSpan = document.getElementById('genderError');
            if (genderErrorSpan) {
                genderErrorSpan.textContent = '';
            }
        });
    });
});