import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-game',
  templateUrl: './quiz-game.component.html',
  styleUrls: ['./quiz-game.component.css']
})
export class QuizGameComponent implements OnInit {
  public name: string = "";
  public wordList = [
    { word: 'こんにちは', meaning: 'hello', image: '1.png' },
    { word: 'こんばんは', meaning: 'good evening', image: '2.png' },
    { word: 'sdf', meaning: 'sdf', image: '1.png' },
    { word: 'dfs', meaning: 'goofghd evening', image: '2.png' },
    { word: 'こんvbcにちは', meaning: 'hefghllo', image: '1.png' },
    { word: '43345', meaning: 'goo234ing', image: '2.png' },
    // Other word objects...
];
  public currentQuestion: number = 0;
  public points: number = 0;
  public counter: number = 60;
  public correctAnswer: number = 0;
  public inCorrectAnswer: number = 0;
  public interval$: Subscription | undefined;
  public progress: string = "0";
  public isQuizCompleted: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name") || "";
    this.startCounter();
  }

  nextQuestion(): void {
    if (this.currentQuestion < this.questionList.length - 1) {
      this.currentQuestion++;
      this.getProgressPercent();
    }
  }
  shuffleArray(array: any[]){
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
 public questionList =  this.wordList.map(wordObject => {
  // Create a list of meanings excluding the current word's meaning
  let otherMeanings = this.wordList
      .filter(wordObj => wordObj.meaning !== wordObject.meaning)
      .map(wordObj => wordObj.meaning);

  // Shuffle the other meanings
  this.shuffleArray(otherMeanings);

  // Select three random incorrect answers
  let incorrectOptions = otherMeanings.slice(0, 3);

  // Create options array with one correct and three incorrect answers
  let options = [
      { optionText: wordObject.meaning, correct: true },
      ...incorrectOptions.map(meaning => ({ optionText: meaning, correct: false }))
  ];

  // Shuffle the options so the correct answer isn't always first
  this.shuffleArray(options);

  // Return question object
  return {
      questionText: wordObject.word,
      options: options,
      explain: "Explanation goes here" // You can add explanation if needed
  };
  console.log(this.questionList);
});
  previousQuestion(): void {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.getProgressPercent();
    }
  }

  answer(currentQno: number, option: any): void {
    const audio = new Audio();
    if (currentQno === this.questionList.length) {
      this.isQuizCompleted = true;
      this.stopCounter();
    }

    if (option.correct) {
      audio.src='assets/sounds/correct.mp3';
      console.log(1)
      this.points += 10;
      this.correctAnswer++;
      setTimeout(() => {
        this.nextQuestion();
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
    } else {
      audio.src='assets/sounds/incorrect.mp3';
      setTimeout(() => {
        this.nextQuestion();
        this.inCorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
      this.points -= 10;
    }
    audio.load();
    audio.play();
  }

  startCounter(): void {
    this.interval$ = interval(1000).subscribe(val => {
      this.counter--;
      if (this.counter === 0) {
        if (this.currentQuestion < this.questionList.length - 1) {
          this.currentQuestion++;
          this.counter = 60;
          this.points -= 10;
        } else {
          this.isQuizCompleted = true;
          this.stopCounter();
        }
      }
    });
    setTimeout(() => {
      this.stopCounter();
    }, 600000); // 10 minutes
  }

  stopCounter(): void {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }
    this.counter = 0;
  }

  resetCounter(): void {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  resetQuiz(): void {
    this.resetCounter();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = "0";
    this.correctAnswer = 0;
    this.inCorrectAnswer = 0;
    this.isQuizCompleted = false;
  }

  getProgressPercent(): string {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
    return this.progress;
  }
}
