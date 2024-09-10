// Seleciona os elementos do formulário
const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');

// Seleciona os elementos da lista
const expenseList = document.querySelector('ul');
const expensesQuantity = document.querySelector('aside header span');
const expenseTotal = document.querySelector('aside header h2');

// Array para armazenar as despesas
let expenses = [];

// Função para carregar as despesas do localStorage
function loadExpenses() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        expenses.forEach(expenseAdd);
        updateTotals();
    }
}

// Função para salvar as despesas no localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Captura o evento de input para formatar o valor
amount.oninput = () => {
    // Obtém o valor atual do input e remove todos os caracteres não numéricos
    let value = amount.value.replace(/\D/g, '');

    // Transforma o valor em centavos
    value = Number(value) / 100;

    // Atualiza o valor do input
    amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
    // Formata o valor no padrão BRL
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    // Retorna o valor formatado
    return value;
}

// Captura o evento de submit para obter os valores
form.onsubmit = (event) => {
    // Previne o comportamento padrão de recarregar a página
    event.preventDefault();

    // Cria um objeto com os detalhes na nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        create_at: new Date(),
    };

    // Adiciona a nova despesa ao array
    expenses.push(newExpense);

    // Salva as despesas no localStorage
    saveExpenses();

    // Chama a função para adicionar o item na lista
    expenseAdd(newExpense);
};

function expenseAdd(newExpense) {
    try {
        // Criar o elemento para adicionar o item (li) na lista (ul)
        const expenseItem = document.createElement('li');
        expenseItem.classList.add('expense');
        expenseItem.setAttribute('data-id', newExpense.id);

        // Criar o ícone da categoria
        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute('alt', newExpense.category_name);

        // Adiciona as informações de imagem (src e alt) no item.
        expenseItem.append(expenseIcon);
        // Adiciona o item na lista
        expenseList.append(expenseItem);

        // Cria as informações da despesa
        const expenseInfo = document.createElement('div');
        expenseInfo.classList.add('expense-info');

        // Cria o nome da despesa
        const expenseName = document.createElement('strong');
        expenseName.textContent = newExpense.expense;

        // Cria a categoria da despesa
        const expenseCategory = document.createElement('span');
        expenseCategory.textContent = newExpense.category_name;

        // Adiciona o nome da despesa (strong) e a categoria da despesa (span) na informação da despesa (div)
        expenseInfo.append(expenseName, expenseCategory);

        // Cria o valor da despesa
        const expenseAmount = document.createElement('span');
        expenseAmount.classList.add('expense-amount');
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
            .toUpperCase()
            .replace('R$', '')}`;

        // Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount);

        // Adiciona o item na lista
        expenseList.append(expenseItem);

        // Cria o ícone de remover
        const removeIcon = document.createElement('img');
        removeIcon.classList.add('remove-icon');
        removeIcon.setAttribute('src', 'img/remove.svg');
        removeIcon.setAttribute('alt', 'Remover despesa');

        // Adiciona o ícone de remover no item
        expenseItem.append(removeIcon);

        // Atualiza os totais
        updateTotals();
    } catch (error) {
        alert('Não foi possível adicionar a despesa na lista');
        console.log(error);
    }
    // Limpa os campos do formulário depois de adicionar a despesa
    formClear();
}

// Atualiza os totais
function updateTotals() {
    try {
        // Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children;
        // Atualiza a quantidade de itens da lista
        expensesQuantity.textContent = `${items.length} ${
            items.length > 1 ? 'despesas' : 'despesa'
        }`;

        // Variável para incrementar o total
        let total = 0;

        // Percorre todos os itens (li) da lista (ul)
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector('.expense-amount');

            // Remove caracteres não numéricos e substitui a vírgula pelo ponto
            let value = itemAmount.textContent
                .replace(/[^\d,]/g, '')
                .replace(',', '.');

            // Converte o valor para float
            value = parseFloat(value);

            // Verificar se é um número válido
            if (isNaN(value)) {
                return alert(
                    'Não foi possível calcular o total. O valor não parecer ser um número.'
                );
            }

            // Incrementa o total
            total += Number(value);
        }
        // Cria a span para adicionar o R$ formatado
        const symbolBRL = document.createElement('small');
        symbolBRL.textContent = 'R$';

        // Formata o valor e remove o R$ que será exibido pela small com estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace('R$', '');

        // Limpa o total (span) anterior
        expenseTotal.innerHTML = '';

        // Adiciona o símbolo da moeda e o valor total formatado
        expenseTotal.append(symbolBRL, total);
    } catch (error) {
        console.log(error);
        alert('Não foi possível atualizar os totais');
    }
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener('click', (event) => {
    // Verifica se o elemento clicado é o ícone de remover
    if (event.target.classList.contains('remove-icon')) {
        // Obtém a li pai do elemento clicado
        const item = event.target.closest('.expense');

        // Remove o item do array de despesas
        const itemId = parseInt(item.getAttribute('data-id'));
        expenses = expenses.filter((expense) => expense.id !== itemId);

        // Salva as despesas atualizadas no localStorage
        saveExpenses();

        // Remove o item da lista
        item.remove();
    }
    // Atualiza os totais
    updateTotals();
});

function formClear() {
    // Função para limpar os campos do formulário
    expense.value = '';
    category.value = '';
    amount.value = '';

    // Coloca o foco no input do nome da despesa
    expense.focus();
}

// Carrega as despesas do localStorage quando a página é carregada
document.addEventListener('DOMContentLoaded', loadExpenses);