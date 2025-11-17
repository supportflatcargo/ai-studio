
export enum PalletGrade {
  A = 'A',
  B = 'B',
  C = 'C',
  HS = 'HS',
  UNKNOWN = 'INCONNU'
}

export interface AnalysisResult {
  grade: PalletGrade;
  reason: string;
}

export interface CountAnalysisResult {
  match: boolean;
  counted: number;
  expected: number;
  reason: string;
}
