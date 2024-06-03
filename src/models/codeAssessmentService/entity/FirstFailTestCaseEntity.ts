export interface FirstFailTestCaseEntity {
  input: string;
  output: string;
  actualOutput: string | undefined;
  stderr: string | undefined;
  compileOutput: string | undefined;
  runtime: string | undefined;
  memory: string | undefined;
  message: string | undefined;
  description: string | undefined;
}
