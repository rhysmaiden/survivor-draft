import fs from "fs";

function encodeFile(filePath: string): string | null {
  try {
    const fileData = fs.readFileSync(filePath);
    const encodedData = Buffer.from(fileData).toString("base64");
    return encodedData;
  } catch (error) {
    console.error("Error encoding file:", error);
    return null;
  }
}

export default encodeFile;
