const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const REGION = process.env.AWS_REGION || 'ap-southeast-1';
const ENDPOINT = process.env.DYNAMODB_ENDPOINT || undefined;

const client = new DynamoDBClient({ region: REGION, ...(ENDPOINT ? { endpoint: ENDPOINT } : {}) });
const ddb = DynamoDBDocumentClient.from(client);
const TABLE = process.env.ITEMS_TABLE || 'Tasks';

module.exports = {
  getAll: async () => {
    const res = await ddb.send(new ScanCommand({ TableName: TABLE }));
    return res.Items || [];
  },

  findById: async (id) => {
    const res = await ddb.send(new GetCommand({ TableName: TABLE, Key: { id } }));
    return res.Item || null;
  },

  create: async (item) => {
    await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
    return item;
  },

  update: async (id, data) => {
    const expr = [];
    const names = {};
    const values = {};
    let idx = 0;
    for (const k of Object.keys(data)) {
      idx++;
      const nameKey = `#k${idx}`;
      const valKey = `:v${idx}`;
      expr.push(`${nameKey} = ${valKey}`);
      names[nameKey] = k;
      values[valKey] = data[k];
    }
    if (expr.length === 0) return null;
    const UpdateExpression = 'SET ' + expr.join(', ');
    const res = await ddb.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW'
    }));
    return res.Attributes || null;
  },

  remove: async (id) => {
    await ddb.send(new DeleteCommand({ TableName: TABLE, Key: { id } }));
    return true;
  }
};
