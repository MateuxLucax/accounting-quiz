const quizContainer = document.getElementById("quiz");
const resultsContainer = document.getElementById("results");
const submitButton = document.getElementById("submit");
const progressBar = document.getElementById("progress-bar");
const progressBarTitle = document.getElementById("progress-bar-title");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

let slides = [];
let questions = [];
let currentSlide = 0;

window.onload = init;

async function init() {
	submitButton.addEventListener("click", showResults);
	previousButton.addEventListener("click", showPreviousSlide);
	nextButton.addEventListener("click", showNextSlide);

	await buildQuiz();
}

async function buildQuiz() {
	const output = [];

	questions = await getQuestions();

	questions.forEach((question, index) => {
		const answers = [];

		for (letter in question.answers) {
			answers.push(
				`<label class="radio-container">
            ${letter} :
            ${question.answers[letter]}
            <input type="radio" name="question${index}" value="${letter}" name="radio">
            <span class="checkmark"></span>
          </label>`
			);
		}

		output.push(
			`<div class="slide">
          <div class="question"> ${question.question} </div>
          <div class="answers"> ${answers.join("")} </div>
        </div>`
		);
	});

	quizContainer.insertAdjacentHTML("beforeend", output.join(""));
	slides = document.querySelectorAll(".slide");

	showSlide(currentSlide);
}

function getQuestions() {
	return fetch("./assets/questions.json")
		.then((response) => response.json())
		.then((questions) => questions.sort(() => Math.random() - 0.5))
		.catch((error) => console.warn(error));
}

function showResults() {
	const answerContainers = quizContainer.querySelectorAll(".answers");

	let numCorrect = 0;

	questions.forEach((currentQuestion, questionNumber) => {
		const answerContainer = answerContainers[questionNumber];
		const selector = `input[name=question${questionNumber}]:checked`;
		const userAnswer = (answerContainer.querySelector(selector) || {}).value;

		if (userAnswer === currentQuestion.correctAnswer) {
			numCorrect++;

			answerContainers[questionNumber].style.color = "#004643";
		} else {
			answerContainers[questionNumber].style.color = "#e16162";
		}
	});

	resultsContainer.insertAdjacentHTML(
		"beforeend",
		`<p class="results-paragraph">Você acertou ${numCorrect} de ${questions.length}!</p>`
	);
}

function showSlide(n) {
	progressBar.value = percentage(n + 1, questions.length);
	progressBarTitle.innerHTML = `${n + 1} de ${questions.length}`;

	slides[currentSlide].classList.remove("active-slide");
	slides[n].classList.add("active-slide");
	currentSlide = n;

	if (currentSlide === 0) {
		previousButton.style.display = "none";
	} else {
		previousButton.style.display = "inline-block";
	}

	if (currentSlide === slides.length - 1) {
		nextButton.style.display = "none";
		submitButton.style.display = "inline-block";
	} else {
		nextButton.style.display = "inline-block";
		submitButton.style.display = "none";
	}
}

function showNextSlide() {
	showSlide(currentSlide + 1);
}

function showPreviousSlide() {
	showSlide(currentSlide - 1);
}

function percentage(partialValue, totalValue) {
	console.log((100 * partialValue) / totalValue);
	return (100 * partialValue) / totalValue;
}
