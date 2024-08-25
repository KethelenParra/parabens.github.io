document.addEventListener('DOMContentLoaded', function () {
    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');
    const gameDiv = document.getElementById('game');
    const resultParagraph = document.getElementById('result');
    const choicesList = document.getElementById('choices');
    const checkButton = document.getElementById('check');

    // Pergunta inicial - "Sim" se move, "Não" inicia o jogo
    yesButton.addEventListener('mouseover', function() {
        desvia(yesButton);
    });
    noButton.addEventListener('click', startGame);

    let correctOrder = [];
    let attempts = 0;

    function desvia(btn) {
        // btn declarado na função
        btn.style.position = 'absolute';
        btn.style.bottom = geraPosicao(10, 90);
        btn.style.left = geraPosicao(10, 90);
        console.log('opa, desviei...');
    }

    function geraPosicao(min, max) {
        return (Math.random() * (max - min) + min) + "%";
    }

    function startGame() {
        document.getElementById('question').style.display = 'none';
        gameDiv.style.display = 'block';
        setupGame();
    }

    function setupGame() {
        // Gera uma ordem aleatória para o ranking
        const people = ['Stefany', 'Newanderson', 'Kethelen', 'Bruna', 'Gilberto'];
        correctOrder = people.sort(() => Math.random() - 0.5);
        resultParagraph.textContent = '';

        // Ordena aleatoriamente os itens na lista de escolhas
        const shuffledPeople = [...people].sort(() => Math.random() - 0.5);
        choicesList.innerHTML = ''; // Limpar a lista atual
        shuffledPeople.forEach(person => {
            const li = document.createElement('li');
            li.textContent = person;
            li.setAttribute('draggable', true);
            choicesList.appendChild(li);
        });

        // Torna a lista arrastável
        makeListDraggable(choicesList);
    }

    function makeListDraggable(list) {
        let draggedItem = null;

        Array.from(list.children).forEach(item => {
            item.addEventListener('dragstart', function (e) {
                draggedItem = item;
                setTimeout(() => item.style.display = 'none', 0);
            });

            item.addEventListener('dragend', function () {
                setTimeout(() => {
                    draggedItem.style.display = 'block';
                    draggedItem = null;
                }, 0);
            });

            item.addEventListener('dragover', function (e) {
                e.preventDefault();
            });

            item.addEventListener('dragenter', function (e) {
                e.preventDefault();
                this.style.border = '2px dashed #000';
            });

            item.addEventListener('dragleave', function () {
                this.style.border = '1px solid #ccc';
            });

            item.addEventListener('drop', function () {
                this.style.border = '1px solid #ccc';
                if (draggedItem !== this) {
                    const allItems = Array.from(list.children);
                    const draggedIndex = allItems.indexOf(draggedItem);
                    const droppedIndex = allItems.indexOf(this);

                    if (draggedIndex < droppedIndex) {
                        this.parentNode.insertBefore(draggedItem, this.nextSibling);
                    } else {
                        this.parentNode.insertBefore(draggedItem, this);
                    }
                }
            });
        });
    }

    checkButton.addEventListener('click', function () {
        const currentOrder = Array.from(choicesList.children).map(item => item.textContent);

        if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
            resultParagraph.textContent = 'Parabéns! Você acertou a ordem!';
        } else {
            attempts++;
            if (attempts < 2) {
                resultParagraph.textContent = 'Ordem errada! Tente novamente.';
            } else {
                resultParagraph.textContent = `Ordem errada! A ordem correta era: ${correctOrder.join(', ')}. Tente novamente.`;
                attempts = 0; // Resetar tentativas para permitir novas chances
            }
        }
    });
});
