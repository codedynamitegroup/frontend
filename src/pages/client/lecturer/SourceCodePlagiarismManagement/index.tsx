import { Dolos } from "@dodona/dolos-lib";

const LecturerSourceCodePlagiarismManagement = () => {
  const dolos = new Dolos();
  const report = dolos.analyzePaths(["./file1.js", "./file2.js"]);

  console.log("The similarity between the two files is", report);

  return (
    <div>
      <h1>Source Code Plagiarism Management</h1>
    </div>
  );
};

export default LecturerSourceCodePlagiarismManagement;
