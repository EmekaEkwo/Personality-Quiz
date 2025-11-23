// Simple log so you can quickly confirm the file is connected
console.log("script.js connected!");

// Wait until the DOM is fully loaded (good habit, even with script at the bottom)
document.addEventListener("DOMContentLoaded", function () {
  const questionBlocks = document.querySelectorAll(".question-block");
  const showResultButton = document.getElementById("show-result");
  const resultContainer = document.getElementById("result-container");
  const resultText = document.getElementById("result-text");

  // Store user's answers here: { "question-1": "A", "question-2": "B", ... }
  const selectedAnswers = {};

  // Attach click handlers to every answer button in every question block
  questionBlocks.forEach(function (block, index) {
    const buttons = block.querySelectorAll(".answer-btn");

    // Give each block a question id if it doesn't already have one
    const questionId = block.id || `question-${index + 1}`;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        // 1. Remove 'selected' class from all buttons in this block
        buttons.forEach(function (btn) {
          btn.classList.remove("selected");
        });

        // 2. Add 'selected' class to the clicked button
        button.classList.add("selected");

        // 3. Store the selected answer in our object
        const answerCode = button.dataset.answer; // "A", "B", "C", or "D"
        selectedAnswers[questionId] = answerCode;

        // Handy for debugging in the console while you test
        // console.log("Current answers:", selectedAnswers);
      });
    });
  });

  // Map each answer letter to a description
  const resultDetails = {
    A: {
      title: "Playmaker",
      text:
        "You love to be on the ball, control the tempo, and create chances. " +
        "You see passes that others miss and keep the team ticking."
    },
    B: {
      title: "Finisher",
      text:
        "You live for goals. You love making smart runs, attacking the box, " +
        "and putting the ball in the back of the net."
    },
    C: {
      title: "Engine",
      text:
        "You cover huge distances, help in both attack and defense, and keep " +
        "the intensity high from the first whistle to the last."
    },
    D: {
      title: "Defender",
      text:
        "You take pride in clean sheets, tackles, and blocks. You love winning " +
        "duels and organizing the players around you."
    }
  };

  function calculateResult() {
    // Make sure every question has an answer
    const totalQuestions = questionBlocks.length;
    const answeredCount = Object.keys(selectedAnswers).length;

    if (answeredCount < totalQuestions) {
      return {
        error: "Please answer every question before seeing your result."
      };
    }

    // Start scores at zero for each letter
    const scores = {
      A: 0,
      B: 0,
      C: 0,
      D: 0
    };

    // Count how many times each letter was chosen
    Object.values(selectedAnswers).forEach(function (answerCode) {
      if (scores[answerCode] !== undefined) {
        scores[answerCode] += 1;
      }
    });

    // Find the letter with the highest score
    let bestCode = "A";
    let bestScore = scores["A"];

    ["B", "C", "D"].forEach(function (code) {
      if (scores[code] > bestScore) {
        bestScore = scores[code];
        bestCode = code;
      }
    });

    return {
      code: bestCode,
      details: resultDetails[bestCode]
    };
  }

  function displayResult() {
    const outcome = calculateResult();

    resultContainer.style.display = "block";

    if (outcome.error) {
      // If not all questions are answered, show a friendly message
      resultText.textContent = outcome.error;
      return;
    }

    const title = outcome.details.title;
    const text = outcome.details.text;

    // Use innerHTML so we can bold the title
    resultText.innerHTML = "<strong>" + title + "</strong> – " + text;
  }

  // When the user clicks the button, show the result
  showResultButton.addEventListener("click", displayResult);
});
