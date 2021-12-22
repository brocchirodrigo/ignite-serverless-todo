import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';

import { document } from '../utils/dynamodbClient';

interface ICreateToDo {
  title: string;
  deadline: string;
}

interface IToDoTemplate {
  id: string;
  user_id: string;
  title: string;
  done: Boolean;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateToDo;

  const todo: IToDoTemplate = {
    id: uuid(),
    user_id,
    title,
    done: false,
    deadline: dayjs(deadline).format("DD/MM/YYYY"),
  }

  await document.put({
    TableName: 'users-todo',
    Item: todo
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'TODO Created!',
      todo: todo,
    }),
    headres: {
      "Content-Type": "application/json"
    },
  }
}