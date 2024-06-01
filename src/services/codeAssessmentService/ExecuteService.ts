import { API } from "constants/API";
import axios from "axios";
import { encodeBase64 } from "utils/base64";

const judge0ApiUrl = process.env.REACT_APP_JUDE0_URL || "";
export class ExecuteService {
  static async execute(
    language_id: number | undefined,
    stdin: string | undefined,
    expected_output: string | undefined,
    cpu_time_limit: number | undefined,
    memory_limit: number | undefined,
    source_code: string | undefined
  ) {
    if (
      source_code === undefined ||
      expected_output === undefined ||
      stdin === undefined ||
      language_id === undefined
    ) {
      return Promise.reject({
        message: "insufficient data"
      });
    } else {
      try {
        const response = await axios.post(
          `${judge0ApiUrl}${API.JUDGE0.SUBMISSION}`,
          {
            language_id,
            stdin: encodeBase64(stdin),
            expected_output: encodeBase64(expected_output),
            cpu_time_limit,
            memory_limit,
            source_code: encodeBase64(source_code)
          },
          {
            params: {
              base64_encoded: true,
              wait: true
            }
          }
        );

        if (response.status === 201) {
          return response.data;
        }
      } catch (error: any) {
        console.error("Failed to execute program", error);
        return Promise.reject({
          code: error.response?.data?.code || 503,
          status: error.response?.data?.status || "Service Unavailable",
          message: error.response?.data?.message || error.message
        });
      }
    }
  }
}
