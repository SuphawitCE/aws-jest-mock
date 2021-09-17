describe('DynamoDB - dynamo-db.js Functionality Test', () => {

  jest.mock('@aws-sdk/util-dynamodb', () => ({
    marshall: (args) => args,
    unmarshall: (args) => args
  }));

	const getItemResult = {
    Items: [{ PK: 'PID#777-888-999', SK: 'HENRY#9999' }]
  };

  const item = {
    PK: 'PID#777-888-999',
    SK: 'HENRY#99999',
    msid: '779999',
    vendor: 'Pomelo',
    title: 'Test product-updated',
    description: undefined,
    tags: ['Pants', 'Denim', 'Short Pants'],
    variants: {
      '80712-1001': {
        option: 'S',
        barcode: '80712-1001',
        prices: [Object],
        metafields: [Array]
      },
      '80712-1002': {
        option: 'M',
        barcode: '80712-1002',
        prices: [Object],
        metafields: [Array]
      }
    },
    m_img: { src: 'https://s3.url.com' },
    created_at: '2021-04-06T12:32:52Z',
    updated_at: '2021-04-07T12:32:52Z',
    images: undefined
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
      IndexName: ['GSIProductOriginId'],
      KeyConditionExpression: 'SK = :SK',
      ExpressionAttributeValues: {
        ':SK': { S: 'HENRY#9999' }
      }
    };
		const result = await DynamoDB.executeQuery(
			DynamoDB.getItemQueryParams('co.pmlo.henry.staging', '9999'),
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
      IndexName: ['GSIProductOriginId'],
      KeyConditionExpression: 'SK = :SK',
      ExpressionAttributeValues: {
        ':SK': { S: 'HENRY#9999' }
      }
		}
		await expect(
			DynamoDB.executeQuery(
				DynamoDB.getItemQueryParams('co.pmlo.henry.staging', 1234),
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
      Item: item
    };
    await DynamoDB.upsertItem(item, tableName);
    expect(mockPutItemCommand).toBeCalledTimes(1);
    expect(mockPutItemCommand).toHaveBeenCalledWith(expected);
  });

  test('upsertItem(..) should fail', async () => {
    mockSendResult.mockRejectedValueOnce(new Error('dynamo client send error'));

    const tableName = 'products';
    const expected = {
      TableName: tableName,
      Item: item
    };
    await expect(DynamoDB.upsertItem(item, tableName)).rejects.toThrow(
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
