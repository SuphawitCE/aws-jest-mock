const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  DeleteItemCommand
} = require('@aws-sdk/client-dynamodb');

const dynamoClient = new DynamoDBClient();

const PRODUCT_TABLE_NAME = 'products';
const marshalOpts = { removeUndefinedValues: true };

const getSK = (source, id) =>
  `${[source.toUpperCase().replace(/\./g, '_')]}#${id}`;

const getItemQueryParams = (
  source,
  origin_id,
  tableName = PRODUCT_TABLE_NAME
) => ({
  TableName: tableName,
  IndexName: [`GSIProductOriginId_INDEX_NAME`],
  KeyConditionExpression: 'SK = :SK',
  ExpressionAttributeValues: {
    ':SK': { S: getSK(source, origin_id) }
  }
});


async function executeQuery(queryParams) {
  try {
    const command = new QueryCommand(queryParams);
    const response = await dynamoClient.send(command);
    return response.Items && response.Items.length > 0
      ? unmarshall(response.Items[0])
      : null;
  } catch (executeQueryException) {
    throw executeQueryException;
  }
}

async function upsertItem(item, tableName = PRODUCT_TABLE_NAME) {
  try {
    const params = {
      TableName: tableName,
      Item: marshall(item, marshalOpts)
    };
    const command = new PutItemCommand(params);
    const info = await dynamoClient.send(command);
  } catch (writeItemException) {
    throw writeItemException;
  }
}

const removeItem = async (tableName, keys, condition) => {
  try {
    const params = {
      TableName: tableName,
      Key: keys,
      ConditionExpression: condition
    };
    const queryResponse = await DeleteItemCommand(params);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getItemQueryParams,
  executeQuery,
  upsertItem,
  removeItem
};
