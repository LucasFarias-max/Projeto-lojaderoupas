// Espera o carregamento completo da página para rodar o código
document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("produtos");
    const botoesFiltro = document.querySelectorAll("[data-categoria]");

    // Variável para armazenar os produtos carregados para que 'adicionarAoCarrinho' possa acessá-los
    let produtosCarregadosAtualmente = []; 

    const categoriasPersonalizadas = {
        all: {
            display: "Todos",
            apiCategories: ["men's clothing", "women's clothing", "jewelery"]
        },
        tendencia: {
            display: "Tendência",
            apiCategories: ["men's clothing", "women's clothing"]
        },
        masculino: {
            display: "Masculino",
            apiCategories: ["men's clothing"]
        },
        feminino: {
            display: "Feminino",
            apiCategories: ["women's clothing"]
        },
        acessorios: {
            display: "Acessórios",
            apiCategories: ["jewelery"]
        }
    };

    // Traduções conhecidas de títulos
    const traducoesTitulos = {
        "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops": "Mochila Fjallraven - Foldsack Nº1, Para Laptops de 15\"",
        "Mens Casual Premium Slim Fit T-Shirts ": "Camiseta Masculina Slim Fit Premium Casual",
        "Mens Cotton Jacket": "Jaqueta Masculina de Algodão",
        "Mens Casual Slim Fit": "Camiseta Masculina Casual Slim Fit",
        "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet": "Pulseira Feminina John Hardy Dragão Dourado e Prateado",
        "Solid Gold Petite Micropave ": "Anel Micropavê em Ouro Maciço",
        "White Gold Plated Princess": "Anel Princess Banhado a Ouro Branco",
        "Pierced Owl Rose Gold Plated Stainless Steel Double": "Brinco Aço Inoxidável Banhado a Ouro Rosé - Pierced Owl",
        "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats": "Jaqueta Feminina 3-em-1 para Neve - BIYLACLESEN",
        "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket": "Jaqueta Feminina Motoqueira com Capuz Removível - Lock and Love",
        "Rain Jacket Women Windbreaker Striped Climbing Raincoats": "Capa de Chuva Feminina Corta-Vento com Listras",
        "MBJ Women's Solid Short Sleeve Boat Neck V ": "Blusa Feminina Gola Canoa com Manga Curta - MBJ",
        "Opna Women's Short Sleeve Moisture": "Camiseta Feminina Manga Curta Anti-Suor - Opna",
        "DANVOUY Womens T Shirt Casual Cotton Short": "Camiseta Feminina Casual de Algodão - DANVOUY"
    };

    function traduzirTitulo(titulo) {
        return traducoesTitulos[titulo] || titulo;
    }

    // Função para formatar o valor para Real brasileiro (R$ 0.000,00)
    function formatarParaBRL(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    async function buscarProdutos(apiCategories, limite = 18) {
        let todosProdutosUnicos = [];

        if (!Array.isArray(apiCategories) || apiCategories.length === 0) {
            return [];
        }

        const apiRequestLimit = 20;

        for (const categoria of apiCategories) {
            const url = `https://fakestoreapi.com/products/category/${encodeURIComponent(categoria)}?limit=${apiRequestLimit}`;
            try {
                const resposta = await fetch(url);
                if (!resposta.ok) {
                    console.error(`Erro ao buscar produtos da categoria ${categoria}: ${resposta.statusText}`);
                    continue;
                }
                const produtos = await resposta.json();
                todosProdutosUnicos.push(...produtos);
            } catch (error) {
                console.error(`Falha na requisição para a categoria ${categoria}:`, error);
            }
        }

        const produtosParaExibir = [];
        let indexRepeticao = 0;

        for (let i = 0; i < todosProdutosUnicos.length && produtosParaExibir.length < limite; i++) {
            produtosParaExibir.push(todosProdutosUnicos[i]);
        }

        while (produtosParaExibir.length < limite && todosProdutosUnicos.length > 0) {
            produtosParaExibir.push(todosProdutosUnicos[indexRepeticao]);
            indexRepeticao = (indexRepeticao + 1) % todosProdutosUnicos.length;
        }

        return produtosParaExibir;
    }

    async function carregarProdutos(categoriaChave) {
        container.innerHTML = "<p>Carregando produtos...</p>";

        const categoriaInfo = categoriasPersonalizadas[categoriaChave];

        if (!categoriaInfo) {
            container.innerHTML = "<p>Categoria não encontrada.</p>";
            return;
        }

        try {
            let produtos = await buscarProdutos(categoriaInfo.apiCategories, 18);
            produtosCarregadosAtualmente = produtos; // Armazena os produtos carregados para uso posterior

            container.innerHTML = ""; // Limpa o contêiner para novos produtos

            if (produtos.length === 0) {
                container.innerHTML = "<p>Nenhum produto encontrado nesta categoria.</p>";
                return;
            }

            produtos.forEach(produto => {
                // Multiplica o preço por 10 e arredonda para duas casas decimais ANTES de exibir
                // e antes de ser passado para 'adicionarAoCarrinho'
                produto.price = parseFloat((produto.price * 10).toFixed(2)); 
                
                const card = document.createElement("div");
                card.classList.add("produto");

                const tituloPT = traduzirTitulo(produto.title);

                card.innerHTML = `
                    <img src="${produto.image}" alt="${tituloPT}">
                    <h3>${tituloPT}</h3>
                    <p>${formatarParaBRL(produto.price)}</p>
                    <button class="btn-comprar" data-product-id="${produto.id}">Comprar</button>
                `;

                container.appendChild(card);
            });

            // Anexa os event listeners aos botões "Comprar" DEPOIS que eles são criados e adicionados ao DOM
            document.querySelectorAll('.btn-comprar').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = parseInt(event.currentTarget.dataset.productId);
                    const produtoParaAdicionar = produtosCarregadosAtualmente.find(p => p.id === productId);
                    if (produtoParaAdicionar) {
                        adicionarAoCarrinho(produtoParaAdicionar); // Passa o objeto completo do produto
                    } else {
                        console.error("Produto não encontrado na lista carregada para adicionar ao carrinho.");
                    }
                });
            });

        } catch (erro) {
            console.error("Erro ao carregar os produtos:", erro);
            container.innerHTML = "<p>Erro ao carregar os produtos.</p>";
        }
    }

    // Adiciona event listeners aos botões de filtro
    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", () => {
            const categoria = botao.getAttribute("data-categoria");
            carregarProdutos(categoria);
        });

        const categoriaChave = botao.getAttribute("data-categoria");
        if (categoriasPersonalizadas[categoriaChave]) {
            botao.textContent = categoriasPersonalizadas[categoriaChave].display;
        }
    });

    // Carrega os produtos da categoria 'all' ao iniciar a página
    carregarProdutos("all");

    // Função para adicionar um produto ao carrinho (global para ser chamada pelo event listener)
    async function adicionarAoCarrinho(produtoCompleto) {
        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        const jaTem = carrinho.find(p => p.id === produtoCompleto.id);

        if (jaTem) {
            // Se o produto já existe, apenas incrementa a quantidade
            jaTem.quantidade++;
            alert(`Quantidade de "${traduzirTitulo(produtoCompleto.title)}" atualizada no carrinho!`);
        } else {
            // Se o produto não está no carrinho, adiciona com quantidade 1
            // O preço já vem em BRL do 'carregarProdutos'
            carrinho.push({
                id: produtoCompleto.id,
                title: produtoCompleto.title,
                price: produtoCompleto.price, // Preço já em BRL
                image: produtoCompleto.image,
                quantidade: 1 
            });
            alert("Produto adicionado ao carrinho!");
        }
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        // Opcional: Aqui você pode chamar uma função para atualizar um contador de carrinho no cabeçalho.
        // Por exemplo: atualizarContadorCarrinho();
    }
});