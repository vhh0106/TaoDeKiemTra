export interface QuestionTypeDistribution {
    percentage: number;
    score: number;
    questionCount: number;
}

export interface ExamFormData {
    schoolLevel: string;
    schoolName?: string;
    subject: string;
    grade: string;
    textbook: string;
    knowledgeContent: string;
    duration: number;
    multipleChoice: QuestionTypeDistribution;
    trueFalse: QuestionTypeDistribution;
    shortAnswer: QuestionTypeDistribution;
    essay: QuestionTypeDistribution;
    additionalRequirements: string;
}

export interface ExamResult {
    matrix: string;
    specification: string;
    exam: string;
    answerKey: string;
}