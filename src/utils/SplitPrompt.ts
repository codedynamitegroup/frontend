export default function splitPrompt(
  text: string,
  splitLength: number
): { name: string; content: string }[] {
  if (splitLength <= 0) {
    throw new Error("Max length must be greater than 0.");
  }

  const numParts = Math.ceil(text.length / splitLength);
  const fileData: { name: string; content: string }[] = [];

  for (let i = 0; i < numParts; i++) {
    const start = i * splitLength;
    const end = Math.min((i + 1) * splitLength, text.length);

    let content = "";
    if (i === numParts - 1) {
      content = `[START PART ${i + 1}/${numParts}]\n${text.substring(start, end)}\n[END PART ${i + 1}/${numParts}]\nALL PARTS SENT. Now you can continue processing the request.`;
    } else {
      content = `Do not answer yet. This is just another part of the text I want to send you. Just receive and acknowledge as "Part ${i + 1}/${numParts} received" and wait for the next part.\n[START PART ${i + 1}/${numParts}]\n${text.substring(start, end)}\n[END PART ${i + 1}/${numParts}]\nRemember not answering yet. Just acknowledge you received this part with the message "Part ${i + 1}/${numParts} received" and wait for the next part.`;
    }

    fileData.push({
      name: `split_${String(i + 1).padStart(3, "0")}_of_${String(numParts).padStart(3, "0")}.txt`,
      content
    });
  }

  return fileData;
}
