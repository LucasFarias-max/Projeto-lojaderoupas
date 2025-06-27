document.addEventListener("DOMContentLoaded", () => {
    loadUserName();
    atualizarDisplayCarrinho(); // Garante que o carrinho é renderizado ao carregar a página
});

function loadUserName() {
    const userNameSpan = document.getElementById("userName");
    if (userNameSpan) { // Verifica se o elemento existe
        // userNameSpan.textContent = ; // quando entregar com banco de dados 
        return 1;// Nome fixo para demonstração
    }
}

// Função para formatar o valor para Real brasileiro (R$ 0.000,00)
function formatarParaBRL(valor) {
    // Garante que o valor é um número válido antes de formatar
    if (typeof valor !== 'number' || isNaN(valor)) {
        console.warn("Valor inválido para formatação BRL:", valor);
        return "R$ 0,00"; // Retorna um valor padrão para evitar erros
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Simulação de tradução de títulos
function traduzirTitulo(tituloOriginal) {
    const traducoes = {
        "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops": "Mochila Fjallraven - Foldsack Nº1, Para Laptops de 15\"",
        "Mens Casual Premium Slim Fit T-Shirts ": "Camiseta Masculina Slim Fit Premium Casual",
        "Mens Cotton Jacket": "Jaqueta Masculina de Algodão",
        "Mens Casual Slim Fit": "Camiseta Masculina Casual Slim Fit",
        "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet": "Pulseira Feminina John Hardy Dragão Dourado e Prateado",
        "Solid Gold Petite Micropave ": "Anel Micropavê em Ouro Maciço",
        "White Gold Plated Princess": "Anel Princess Banhado a Ouro Branco",
        "Pierced Owl Rose Gold Plated Stainless Steel Double": "Brinco Aço Inoxidável Banhado a Ouro Rosé - Pierced Owl",
        "WD 2TB Elements Portable External Hard Drive - USB 3.0 ": "HD Externo Portátil WD 2TB - USB 3.0",
        "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s": "SanDisk SSD PLUS 1TB - SATA III 6Gb/s",
        "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III": "Silicon Power 256GB SSD 3D NAND A55 com Cache SLC",
        "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive": "HD Externo WD 4TB para Playstation 4",
        "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin": "Monitor Acer 21.5” IPS Full HD Ultra Fino",
        "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor": "Monitor Gamer Curvo Samsung 49” 144Hz",
        "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats": "Jaqueta Feminina 3-em-1 para Neve - BIYLACLESEN",
        "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket": "Jaqueta Feminina Motoqueira com Capuz Removível - Lock and Love",
        "Rain Jacket Women Windbreaker Striped Climbing Raincoats": "Capa de Chuva Feminina Corta-Vento com Listras",
        "MBJ Women's Solid Short Sleeve Boat Neck V ": "Blusa Feminina Gola Canoa com Manga Curta - MBJ",
        "Opna Women's Short Sleeve Moisture": "Camiseta Feminina Manga Curta Anti-Suor - Opna",
        "DANVOUY Womens T Shirt Casual Cotton Short": "Camiseta Feminina DANVOUY Casual Algodão Manga Curta"
    };
    return traducoes[tituloOriginal] || tituloOriginal;
}

// Função para calcular o frete (exemplo simplificado)
function calcularFrete(subtotal) {
    if (subtotal === 0) return 0;
    return 15.00; // Frete fixo de R$15,00.
}

function atualizarDisplayCarrinho() {
    const container = document.getElementById("carrinho-items-container");
    const subtotalValorSpan = document.getElementById("subtotal-valor");
    const freteValorSpan = document.getElementById("frete-valor");
    const totalValorSpan = document.getElementById("total-valor");
    const carrinhoVazioMessage = document.querySelector('.carrinho-vazio-message');
    const resumoCompraSection = document.querySelector('.resumo-compra');
    const btnLimpar = document.querySelector('.btn-limpar');
    const btnFinalizar = document.querySelector('.btn-primary');
    const btnContinuar = document.querySelector('.btn-continue-shopping');

    // Sempre tenta carregar o carrinho do localStorage
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let subtotalCompra = 0;

    // Limpa o contêiner do carrinho para reconstruí-lo
    if (container) { // Garante que o contêiner existe
        container.innerHTML = ''; 
    } else {
        console.error("Elemento 'carrinho-items-container' não encontrado!");
        return; // Impede que o script continue e cause mais erros
    }

    if (carrinho.length === 0) {
        if (carrinhoVazioMessage) carrinhoVazioMessage.style.display = 'block';
        if (resumoCompraSection) resumoCompraSection.style.display = 'none';
        // A mensagem já está no HTML, não precisa appended-la novamente
    } else {
        if (carrinhoVazioMessage) carrinhoVazioMessage.style.display = 'none';
        if (resumoCompraSection) resumoCompraSection.style.display = 'block';

        carrinho.forEach(produto => {
            // Garante que a quantidade e o preço são números e existem
            produto.quantidade = parseInt(produto.quantidade) || 1;
            produto.price = parseFloat(produto.price) || 0; // Preço já deve estar em BRL

            const precoEmBRL = produto.price; 
            const subtotalItem = precoEmBRL * produto.quantidade;
            subtotalCompra += subtotalItem;

            const tituloTraduzido = traduzirTitulo(produto.title);

            const itemCard = document.createElement("div");
            itemCard.classList.add("carrinho-item");
            itemCard.dataset.productId = produto.id;

            itemCard.innerHTML = `
                <div class="item-image">
                    <img src="${produto.image}" alt="${tituloTraduzido}">
                </div>
                <div class="item-details">
                    <h3>${tituloTraduzido}</h3>
                    <p class="item-price-unit">${formatarParaBRL(precoEmBRL)} / unidade</p>
                    <div class="item-quantity-control">
                        <button class="quantity-btn" data-action="decrease" data-id="${produto.id}">-</button>
                        <span class="quantity-display">${produto.quantidade}</span>
                        <button class="quantity-btn" data-action="increase" data-id="${produto.id}">+</button>
                    </div>
                </div>
                <div class="item-subtotal">
                    <p>${formatarParaBRL(subtotalItem)}</p>
                </div>
                <div class="item-actions">
                    <button class="remove-item-btn" data-id="${produto.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            container.appendChild(itemCard);
        });
    }

    // Atualiza os valores do resumo da compra
    const freteValor = calcularFrete(subtotalCompra);
    const totalCompraFinal = subtotalCompra + freteValor;

    if (subtotalValorSpan) subtotalValorSpan.textContent = formatarParaBRL(subtotalCompra);
    if (freteValorSpan) freteValorSpan.textContent = formatarParaBRL(freteValor);
    if (totalValorSpan) totalValorSpan.textContent = formatarParaBRL(totalCompraFinal);

    // Re-anexa os event listeners aos botões
    // É CRÍTICO fazer isso toda vez que o HTML do carrinho é reconstruído
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.currentTarget.dataset.id);
            removerDoCarrinho(productId);
        });
    });

    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.currentTarget.dataset.id);
            const action = event.currentTarget.dataset.action;
            atualizarQuantidade(productId, action);
        });
    });

    // Controla a visibilidade dos botões de ação do carrinho
    if (btnLimpar) btnLimpar.style.display = carrinho.length === 0 ? 'none' : 'inline-block';
    if (btnFinalizar) btnFinalizar.style.display = carrinho.length === 0 ? 'none' : 'inline-block';
    if (btnContinuar) btnContinuar.style.display = carrinho.length === 0 ? 'none' : 'inline-block';
}

function removerDoCarrinho(idProduto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho = carrinho.filter(item => item.id !== idProduto);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarDisplayCarrinho(); // Re-renderiza o carrinho após a remoção
}

function atualizarQuantidade(idProduto, action) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const itemIndex = carrinho.findIndex(item => item.id === idProduto);

    if (itemIndex > -1) {
        if (action === 'increase') {
            carrinho[itemIndex].quantidade++;
        } else if (action === 'decrease') {
            if (carrinho[itemIndex].quantidade > 1) {
                carrinho[itemIndex].quantidade--;
            } else {
                // Se a quantidade for 1 e for diminuída, remove o item completamente
                removerDoCarrinho(idProduto); 
                return; // Sai da função para evitar processamento desnecessário
            }
        }
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarDisplayCarrinho(); // Re-renderiza o carrinho após a atualização
    }
}

function limparCarrinho() {
    localStorage.removeItem("carrinho");
    atualizarDisplayCarrinho(); // Atualiza a exibição para mostrar que o carrinho está vazio
}

function irParaCheckout() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.");
        return;
    }
    // Redireciona para a página de checkout
    window.location.href = "checkout.html";
}