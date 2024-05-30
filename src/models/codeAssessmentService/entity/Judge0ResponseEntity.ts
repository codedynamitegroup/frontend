export interface Judge0ResponseEntity {
  stdout: string;
  time: number;
  memory: number;
  stderr: string | undefined;
  compile_output: string | undefined;
  message: string | undefined;
  status: {
    id: number;
    description: string;
  };
}
