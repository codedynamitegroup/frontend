export interface Judge0ResponseEntity {
  stdout: string | null;
  time: number | null;
  memory: number | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  } | null;
}
