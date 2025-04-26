import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const TABLE_NAME = "Message-dxfluthlyjdjxp56miv6cqnyu4-dev"; // ✅ Exact table name

export const handler = async (event) => {
  console.log("EVENT:", JSON.stringify(event, null, 2));

  const badWords = ["badword1", "badword2"];
  const input = event.arguments.input;

  for (let word of badWords) {
    if (input.content.toLowerCase().includes(word)) {
      throw new Error("Message contains inappropriate content.");
    }
  }

  const message = {
    id: { S: uuidv4() },
    content: { S: input.content },
    sender: { S: input.sender },
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
  };

  try {
    const command = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: message,
    });

    await client.send(command);

    return {
      id: message.id.S,
      content: message.content.S,
      sender: message.sender.S,
      createdAt: message.createdAt.S,
      updatedAt: message.updatedAt.S,
    };

  } catch (error) {
    console.error("Lambda Error:", error);
    throw new Error(error.message || "DynamoDB insert failed.");
  }
};
