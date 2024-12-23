export interface IQuestion {
  question: string;
  answer: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

export interface IQuiz {
  _id: string;
  title: string;
  description: string;
  questions: IQuestion[];
}
