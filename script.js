const words = [{
        word: 'Adventure',
        translation: 'Приключение',
        example: "I love going on adventures to explore new places.",
    },
    {
        word: 'Serendipity',
        translation: 'Счастливое случайное совпадение',
        example: "It was pure serendipity that I found my favorite book at the used bookstore.",
    },
    {
        word: 'Wanderlust',
        translation: 'Тяга к путешествиям',
        example: "Her wanderlust led her to travel to over 20 countries in a year."
    },
    {
        word: 'Resilience',
        translation: 'Устойчивость',
        example: "The team showed incredible resilience in overcoming the challenges they faced."
    },
    {
        word: 'Jubilant',
        translation: 'Радостный',
        example: "The crowd erupted into jubilant cheers as the team scored the winning goal."
    }
]

const card = document.querySelector(".flip-card");
const prevButton = document.querySelector("#back");
const nextButton = document.querySelector("#next");
const testButton = document.querySelector("#exam");
const wordNumberElement = document.querySelector("#current-word");
const totalWordsElement = document.querySelector("#total-word");
const studyCards = document.querySelector(".study-cards");
const examCards = document.querySelector("#exam-cards");
const examModeProgress = document.querySelector(".sidebar #exam-mode");


let idx = 0;

function prepareCard({ word, translation, example }) {
    renderCard({ word, translation, example });
    card.addEventListener("click", (event) => {
        if (idx !== words.length - 1) {
            event.currentTarget.classList.toggle("active");
        }
    });
}

function renderCard({ word, translation, example }) {
    card.querySelector("#card-front h1").textContent = word || "Default Word";
    card.querySelector("#card-back h1").textContent = translation || "Default Translation";
    card.querySelector("#card-back p span").textContent = example || "Default Example";

}

function updateButtons() {
    prevButton.disabled = idx === 0;
    nextButton.disabled = idx === words.length - 1;
}

function updateWordNumber() {
    totalWordsElement.textContent = words.length;
    wordNumberElement.textContent = `${idx + 1}`;
}


prevButton.addEventListener("click", () => {
    idx = Math.max(0, idx - 1);
    renderCard(words[idx]);
    updateButtons();
    updateWordNumber()
});

nextButton.addEventListener("click", () => {
    idx = Math.min(words.length - 1, idx + 1);
    renderCard(words[idx]);
    updateButtons();
    updateWordNumber()
});


const englishWords = words.map(function(item) {
    return item.word;
});
const russianWords = words.map(function(item) {
    return item.translation;
});
const allWords = [...englishWords, ...russianWords];

testButton.addEventListener('click', function() {
    studyCards.classList.add('hidden');

    const fragment = new DocumentFragment();
    for (let i = 0; i < allWords.length; i++) {
        const element = document.createElement('span');
        element.classList.add('card');
        element.dataset.index = i;
        element.textContent = allWords[i];
        examCards.append(element);
    };

    examCards.append(fragment);

});


let firstCardIndex = null;

function handleCardClick(event) {

    const clickedCard = event.target;
    if (clickedCard.classList.contains('.fade-out') || !clickedCard.classList.contains('card')) {
        return
    }
    const clickedIndex = parseInt(clickedCard.dataset.index);


    if (firstCardIndex == null) {
        firstCardIndex = clickedIndex;
        clickedCard.classList.add('correct');

    } else {
        const firstCard = document.querySelector(`[data-index='${firstCardIndex}']`);

        const wordObject = words.find(word => word.word === firstCard.textContent || word.translation === firstCard.textContent);

        if (firstCard.textContent !== clickedCard.textContent) {
            if (wordObject.translation === clickedCard.textContent || wordObject.word === clickedCard.textContent) {

                firstCard.classList.add('fade-out');
                firstCard.style.pointerEvents = "none";
                clickedCard.classList.add('correct', 'fade-out');
                clickedCard.style.pointerEvents = "none";
                firstCardIndex = null;

            } else {

                clickedCard.classList.add('wrong');
                setTimeout(() => {
                    clickedCard.classList.remove('wrong');
                    firstCard.classList.remove('correct');
                    firstCardIndex = null;

                }, 500);
            }
        }

    }

    if (document.querySelectorAll('.card:not(.fade-out)').length === 0) {
        setTimeout(() => {
            alert('Поздравляем! Вы успешно завершили проверку знаний.');
        }, 700);

    }
}

examCards.addEventListener('click', handleCardClick);


prepareCard(words[idx]);

updateButtons();
updateWordNumber()