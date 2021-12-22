import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document.scan({
    TableName: 'users-todo',
    FilterExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': user_id,
    }
  }).promise();

  const todos = response.Items;

  if (!todos) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'There is no todo for this user',
      }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      todos,
    }),
  }
}