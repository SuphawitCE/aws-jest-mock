const {
	mockItem
} = require('../fixtures/dynamo-db/general.json');

describe('DynamoDB - dynamo-db.js Functionality Test', () => {

  jest.mock('@aws-sdk/util-dynamodb', () => ({
    marshall: (args) => args,
    unmarshall: (args) => args
  }));

	const getItemResult = {
    Items: [{ PK: 'PID#777-888-999', SK: 'HENRY#9999' }]
  };

  const mockSendResult = jest.fn(() => getItemResult);

  const mockDBClient = jest.fn(() => ({
    send: mockSendResult
  }));

  const mockGetItemCommand = jest.fn(() => ({ promise: mockPromiseFn }));
  const mockPutItemCommand = jest.fn(() => {});
  const mockPromiseFn = jest.fn(() => 'resolved value');
  const mockDeleteItemCommand = jest.fn(() => ({ promise: mockPromiseFn }));
  jest.mock('@aws-sdk/client-dynamodb', () => ({
    DynamoDBClient: mockDBClient,
    QueryCommand: mockGetItemCommand,
    PutItemCommand: mockPutItemCommand,
    DeleteItemCommand: mockDeleteItemCommand
  }));

  jest.mock('uuid', () => ({
    v4: {
      uuidv4: () => '777-888-999'
    }
  }));

	const DynamoDB = require('../../utils/aws/dynamo-db');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

	test('dynamo-db.js should have all functions present', () => {
		expect(DynamoDB).toHaveProperty('executeQuery');
	});

	test('getItem(..) should succeed', async () => {
		const tableName = 'products';
		const expected = {
      TableName: tableName,
      IndexName: ['products_INDEX_NAME'],
      KeyConditionExpression: 'SK = :SK',
      ExpressionAttributeValues: {
        ':SK': { S: 'HENRY#9999' }
      }
    };
		const result = await DynamoDB.executeQuery(
			DynamoDB.getItemQueryParams('HENRY', '9999'),
      tableName
		);
		expect(mockGetItemCommand).toBeCalledTimes(1);
		expect(mockGetItemCommand).toHaveBeenCalledWith(expected);
		expect(result).toEqual(getItemResult.Items[0]);
	});

	test('getItem(..) should fail', async () => {
		mockSendResult.mockRejectedValueOnce(new Error('dynamo client send error'));

		const tableName = 'products';
		const expected = {
			TableName: tableName,
      IndexName: ['products_INDEX_NAME'],
      KeyConditionExpression: 'SK = :SK',
      ExpressionAttributeValues: {
        ':SK': { S: 'HENRY#9999' }
      }
		}
		await expect(
			DynamoDB.executeQuery(
				DynamoDB.getItemQueryParams('HENRY', 9999),
				tableName
			)
		).rejects.toThrow('dynamo client send error');
		expect(mockGetItemCommand).toBeCalledTimes(1);
		expect(mockGetItemCommand).toHaveBeenCalledWith(expected);
	});



  test('upsertItem(..) should succeed', async () => {
    const tableName = 'products';
    const expected = {
      TableName: tableName,
      Item: mockItem
    };
    await DynamoDB.upsertItem(mockItem, tableName);
    expect(mockPutItemCommand).toBeCalledTimes(1);
    expect(mockPutItemCommand).toHaveBeenCalledWith(expected);
  });

  test('upsertItem(..) should fail', async () => {
    mockSendResult.mockRejectedValueOnce(new Error('dynamo client send error'));

    const tableName = 'products';
    const expected = {
      TableName: tableName,
      Item: mockItem
    };
    await expect(DynamoDB.upsertItem(mockItem, tableName)).rejects.toThrow(
      'dynamo client send error'
    );
    expect(mockPutItemCommand).toBeCalledTimes(1);
    expect(mockPutItemCommand).toHaveBeenCalledWith(expected);
  });

  test('removeItem(..) - should succeed and response will be null', async () => {
    const tableName = 'Test';
    const keys = {};
    const condition = '';

    const expected = {
      TableName: tableName,
      Key: keys,
      ConditionExpression: condition
    };
    await DynamoDB.removeItem(tableName, keys, condition);
    expect(mockDeleteItemCommand).toBeCalledTimes(1);
    expect(mockDeleteItemCommand).toHaveBeenCalledWith(expected);
  });

  test('removeItem(..) - should encounter an error', async () => {
    mockDeleteItemCommand.mockRejectedValueOnce(
      new Error('dynamo client send error')
    );

    const tableName = 'INVALID';
    const keys = { INVALID: 'INVALID' };
    const condition = 'INVALID';

    const expected = {
      TableName: tableName,
      Key: keys,
      ConditionExpression: condition
    };

    await expect(
      DynamoDB.removeItem(tableName, keys, condition)
    ).rejects.toThrow('dynamo client send error');
    expect(mockDeleteItemCommand).toBeCalledTimes(1);
    expect(mockDeleteItemCommand).toHaveBeenCalledWith(expected);
  });

});
