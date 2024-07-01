import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";
import i18next from "i18next";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");

export interface ICodeConverterResponse {
  program_language: string;
  code_stub: string;
}
const example_response: ICodeConverterResponse[] = [
  {
    program_language: "java",
    code_stub: `
import java.io.*;
import java.math.*;
import java.security.*;
import java.text.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.regex.*;
import java.util.stream.*;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

class Result {

    /*
     * Complete the 'simpleArraySum' function below.
     *
     * The function is expected to return an INTEGER.
     * The function accepts INTEGER_ARRAY ar as parameter.
     */

    public static int simpleArraySum(List<Integer> ar) {
    // Write your code here

    }

}

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(System.getenv("OUTPUT_PATH")));

        int arCount = Integer.parseInt(bufferedReader.readLine().trim());

        List<Integer> ar = Stream.of(bufferedReader.readLine().replaceAll("\\s+$", "").split(" "))
            .map(Integer::parseInt)
            .collect(toList());

        int result = Result.simpleArraySum(ar);

        bufferedWriter.write(String.valueOf(result));
        bufferedWriter.newLine();

        bufferedReader.close();
        bufferedWriter.close();
    }
}

		`
  },
  {
    program_language: "py",
    code_stub: `
#!/bin/python3

import math
import os
import random
import re
import sys

#
# Complete the 'simpleArraySum' function below.
#
# The function is expected to return an INTEGER.
# The function accepts INTEGER_ARRAY ar as parameter.
#

def simpleArraySum(ar):
    # Write your code here

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')

    ar_count = int(input().strip())

    ar = list(map(int, input().rstrip().split()))

    result = simpleArraySum(ar)

    fptr.write(str(result) + '\n')

    fptr.close()
		`
  },
  {
    program_language: "c++",
    code_stub: `
#include <bits/stdc++.h>

using namespace std;

string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

/*
 * Complete the 'simpleArraySum' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts INTEGER_ARRAY ar as parameter.
 */

int simpleArraySum(vector<int> ar) {

}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string ar_count_temp;
    getline(cin, ar_count_temp);

    int ar_count = stoi(ltrim(rtrim(ar_count_temp)));

    string ar_temp_temp;
    getline(cin, ar_temp_temp);

    vector<string> ar_temp = split(rtrim(ar_temp_temp));

    vector<int> ar(ar_count);

    for (int i = 0; i < ar_count; i++) {
        int ar_item = stoi(ar_temp[i]);

        ar[i] = ar_item;
    }

    int result = simpleArraySum(ar);

    fout << result << "\n";

    fout.close();

    return 0;
}

string ltrim(const string &str) {
    string s(str);

    s.erase(
        s.begin(),
        find_if(s.begin(), s.end(), not1(ptr_fun<int, int>(isspace)))
    );

    return s;
}

string rtrim(const string &str) {
    string s(str);

    s.erase(
        find_if(s.rbegin(), s.rend(), not1(ptr_fun<int, int>(isspace))).base(),
        s.end()
    );

    return s;
}

vector<string> split(const string &str) {
    vector<string> tokens;

    string::size_type start = 0;
    string::size_type end = 0;

    while ((end = str.find(" ", start)) != string::npos) {
        tokens.push_back(str.substr(start, end - start));

        start = end + 1;
    }

    tokens.push_back(str.substr(start));

    return tokens;
}

`
  }
];
interface ICodeConverterRequest {
  programming_language: string;
}

const example_request: ICodeConverterRequest[] = [
  {
    programming_language: "py"
  },
  {
    programming_language: "c++"
  },
  {
    programming_language: "javascript"
  }
];

async function CodeConverterAI(programming_language: string, code_stub: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  const language = i18next.language === "en" ? "English" : "Vietnamese";
  const AI_ROLE = `
I. YOUR ROLE:
	- You are Code Converter AI, a large language model trained on a massive dataset of text and code.
	- You can generate code stubs in different programming languages based on the provided code snippet.
	- Your task is to convert the given code snippet into the specified programming language.
	- The programming languages you can convert to include Java, Python, C++, and more.
	`;

  const SYSTEM_INSTRUCTIONS = `
	II. SYSTEM_INSTRUCTIONS:
	A. Steps to follow:
		- Convert the given code snippet into the specified programming languages.
		- Ensure that the converted code is syntactically correct and follows the best practices of the target language.
		- Provide the converted code snippet as the output.
		- Do not {{provide solution}} to the problem. If method which is provided is {{empty}}, keep it {{empty}}.

	B. You are provided code stubs of language {{${programming_language}}}, and then convert it to the specified programming language:

	- Code Stub which is covered by triple quotes: 
		"""
		${code_stub}
		"""

	- Programming Language Of Code Stub which is covered by double brackets: {{${programming_language}}}

  - Number of programming languages to convert which is covered by double brackets: {{${example_request.length}}}

	- Programming Languages to Convert which is covered by triple quotes:
		"""
		${JSON.stringify(example_request)}
		"""

	E. Output:
		The structure of the response must be {{JSON format}} which follows the following structure:
		- ICodeConverterResponse[]: The array of code stubs in the specified programming language.
			[
				{
					program_language: string,
					code_stub: string
				},
				{
					program_language: string,
					code_stub: string
				},
				...
			]

		- Description: Each code converter response object only contains 2 sections: {{program_language}} and {{code_stub}}.
			+ program_language: The programming language of the converted code stub.
				* Data type: string
			+ code_stub: The converted code stub, which is the converted code snippet. 
				* Data type: string
				* Note:
					** Not markdown format. It should be plain text.
					** Do not {{provide solution}} to the problem. If method which is provided is {{empty}}, keep it {{empty}}.
						*** For example, if the original code snippet has a method definition with no implementation, the converted code should also have the same method definition with no implementation.
					** Ensure that the converted code is syntactically correct and follows the best practices of the target language.
		
		For example output which is covered by triple quote:
    """
    [
      {
        "program_language": "java",
        "code_stub": "import java.io.*;\\nimport java.math.*;\\nimport java.security.*;\\nimport java.text.*;\\nimport java.util.*;\\nimport java.util.concurrent.*;\\nimport java.util.function.*;\\nimport java.util.regex.*;\\nimport java.util.stream.*;\\nimport static java.util.stream.Collectors.joining;\\nimport static java.util.stream.Collectors.toList;\\n\\nclass Result {\\n\\n    /*\\n     * Complete the 'simpleArraySum' function below.\\n     *\\n     * The function is expected to return an INTEGER.\\n     * The function accepts INTEGER_ARRAY ar as parameter.\\n     */\\n\\n    public static int simpleArraySum(List<Integer> ar) {\\n    // Write your code here\\n\\n    }\\n\\n}\\n\\npublic class Solution {\\n    public static void main(String[] args) throws IOException {\\n        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));\\n        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(System.getenv(\\\"OUTPUT_PATH\\\")));\\n\\n        int arCount = Integer.parseInt(bufferedReader.readLine().trim());\\n\\n        List<Integer> ar = Stream.of(bufferedReader.readLine().replaceAll(\\\"\\\\s+$\\\", \\\"\\\").split(\\\" \\\")).map(Integer::parseInt).collect(toList());\\n\\n        int result = Result.simpleArraySum(ar);\\n\\n        bufferedWriter.write(String.valueOf(result));\\n        bufferedWriter.newLine();\\n\\n        bufferedReader.close();\\n        bufferedWriter.close();\\n    }\\n}"
      },
      {
        "program_language": "py",
        "code_stub": "#!/bin/python3\\n\\nimport math\\nimport os\\nimport random\\nimport re\\nimport sys\\n\\n#\\n# Complete the 'simpleArraySum' function below.\\n#\\n# The function is expected to return an INTEGER.\\n# The function accepts INTEGER_ARRAY ar as parameter.\\n#\\n\\ndef simpleArraySum(ar):\\n    # Write your code here\\n\\nif __name__ == '__main__':\\n    fptr = open(os.environ['OUTPUT_PATH'], 'w')\\n\\n    ar_count = int(input().strip())\\n\\n    ar = list(map(int, input().rstrip().split()))\\n\\n    result = simpleArraySum(ar)\\n\\n    fptr.write(str(result) + '\\n')\\n\\n    fptr.close()"
      },
      {
        "program_language": "c++",
        "code_stub": "#include <bits/stdc++.h>\\n\\nusing namespace std;\\n\\nstring ltrim(const string &);\\nstring rtrim(const string &);\\nvector<string> split(const string &);\\n\\n/*\\n * Complete the 'simpleArraySum' function below.\\n *\\n * The function is expected to return an INTEGER.\\n * The function accepts INTEGER_ARRAY ar as parameter.\\n */\\n\\nint simpleArraySum(vector<int> ar) {\\n\\n}\\n\\nint main() {\\n    ofstream fout(getenv(\\\"OUTPUT_PATH\\\"));\\n\\n    string ar_count_temp;\\n    getline(cin, ar_count_temp);\\n\\n    int ar_count = stoi(ltrim(rtrim(ar_count_temp)));\\n\\n    string ar_temp_temp;\\n    getline(cin, ar_temp_temp);\\n\\n    vector<string> ar_temp = split(rtrim(ar_temp_temp));\\n\\n    vector<int> ar(ar_count);\\n\\n    for (int i = 0; i < ar_count; i++) {\\n        int ar_item = stoi(ar_temp[i]);\\n\\n        ar[i] = ar_item;\\n    }\\n\\n    int result = simpleArraySum(ar);\\n\\n    fout << result << '\\n';\\n\\n    fout.close();\\n\\n    return 0;\\n}\\n\\nstring ltrim(const string &str) {\\n    string s(str);\\n\\n    s.erase(\\n        s.begin(),\\n        find_if(s.begin(), s.end(), not1(ptr_fun<int, int>(isspace)))\\n    );\\n\\n    return s;\\n}\\n\\nstring rtrim(const string &str) {\\n    string s(str);\\n\\n    s.erase(\\n        find_if(s.rbegin(), s.rend(), not1(ptr_fun<int, int>(isspace))).base(),\\n        s.end()\\n    );\\n\\n    return s;\\n}\\n\\nvector<string> split(const string &str) {\\n    vector<string> tokens;\\n\\n    string::size_type start = 0;\\n    string::size_type end = 0;\\n\\n    while ((end = str.find(\\\" \\\", start)) != string::npos) {\\n        tokens.push_back(str.substr(start, end - start));\\n\\n        start = end + 1;\\n    }\\n\\n    tokens.push_back(str.substr(start));\\n\\n\\n    return tokens;\\n}"
      }
    ]
    """

		Note for example:
			- The example is just for reference. Don't use it to respond to user.
			- Ensure the response is in valid {{JSON format}} !!!`;

  try {
    let result, response, text;
    result = await model.generateContentStream(AI_ROLE);
    response = await result.response;
    text = response.text;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: AI_ROLE }]
        },
        {
          role: "model",
          parts: [{ text: String(text) }]
        }
      ]
    });

    result = await chat.sendMessageStream(SYSTEM_INSTRUCTIONS);
    response = await result.response;
    text = response.text();
    const cleanText = text.replace(/```/g, "").replace(/json/g, "");
    console.log("CodeConverterAI -> cleanText", cleanText);
    const repaired = jsonrepair(cleanText);
    const json = JSON.parse(repaired);
    return json;
  } catch (error) {
    return error;
  }
}

export default CodeConverterAI;
