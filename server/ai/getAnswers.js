function getMimeType(imageName) {
  const extension = imageName.split(".").pop().toLowerCase();
  switch (extension) {
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream"; // Fallback for unknown formats
  }
}

async function metadataToGenerativePart(imageMetadata) {
  const mimeType = getMimeType(imageMetadata.name); // Extract MIME type from file name

  // Fetch the image data from the URL
  const response = await fetch(imageMetadata.url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`
    );
  }

  // if (response.ok) {
  //   console.log(response);
  // }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer); // Convert the ArrayBuffer to Buffer

  return {
    inlineData: {
      data: buffer.toString("base64"), // Base64-encoded image data
      mimeType, // Using the inferred MIME type
    },
  };
}
async function* getAnswer(model, question, image, history) {
  let promptInput;

  console.log(image?.filePath);

  if (image && Object.keys(image).length > 0) {
    const imagePart = await metadataToGenerativePart(image);
    promptInput = [question, imagePart];
  } else {
    promptInput = question;
  }

  // const result = await model.generateContent(promptInput);
  // return result.response.text();

  // console.log(promptInput);

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(promptInput);
  // const result = await model.generateContentStream(promptInput);

  for await (const chunk of result.stream) {
    yield chunk.text(); // Yield each chunk
  }
}

export default getAnswer;
