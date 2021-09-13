/*

set, reset, clear mocks, stub and spies
beforeEach -> jest.clearAllMocks, jest.resetAllMocks
jest.fn().mockImplementation()
mockReturnValue, mockResolvedValue

*/

const {
	MOCK_PROMISE,
	mockEmptyUsers,
	mockUsername,
	mockUsersPresent,
	mockUserPoolId,
} = require('../fixtures/aws/cognito/general.json');

const {
	mockAdminGetUserPayload,
	mockCustomAttributesPayload,
	mockAdminAddUserToGroupPayload,
	mockAdminConfirmSignUpPayload,
	mockAdminCreateUserPayload,
	mockAdminDeleteUserPayload,
} = require('../fixtures/aws/cognito/mockEventPayload.json');

const {

} = require('../fixtures/aws/cognito/mockResponse.json');

const mockPromiseFn = jest.fn(() => mockEmptyUsers);
const mockPromise = {
	promise: jest.fn(() => MOCK_PROMISE)
};

const mockAddCustomAttributes = jest.fn(() => mockPromise);
const mockAdminAddUserToGroup = jest.fn(() => mockPromise);
const mockAdminConfirmSignUp = jest.fn(() => mockPromise);
const mockAdminCreateUser = jest.fn(() => mockPromise);
const mockAdminDeleteUser = jest.fn(() => mockPromise);
const mockAdminUpdateUserAttributes = jest.fn(() => mockPromise);
const mockAdminGetUser = jest.fn(() => mockPromise);

const mockCognitoIdentityServiceProvider = jest.fn(() => ({
	addCustomAttributes: mockAddCustomAttributes,
	adminAddUserToGroup: mockAdminAddUserToGroup,
	adminConfirmSignUp: mockAdminConfirmSignUp,
	adminCreateUser: mockAdminCreateUser,
	adminDeleteUser: mockAdminDeleteUser,
  adminUpdateUserAttributes: mockAdminUpdateUserAttributes,
  adminGetUser: mockAdminGetUser,
}));

const Cognito = require('../../utils/aws/cognito');

jest.mock('aws-sdk', () => ({
	CognitoIdentityServiceProvider: mockCognitoIdentityServiceProvider,
}));

beforeEach(() => {
	jest.clearAllMocks();
	jest.resetModules();
});

describe('Cognito - cognito.js functionality', () => {
	test('Should return promise custom attributes - addCustomAttributes()', async () => {
		// const { CustomAttributes, UserPoolId } = mockCustomAttributesPayload;
		const addCustom = await Cognito.addCustomAttributes(mockCustomAttributesPayload.CustomAttributes, mockCustomAttributesPayload.UserPoolId);
		expect(mockAddCustomAttributes).toBeCalledTimes(1);
		expect(mockAddCustomAttributes).toBeCalledWith(mockCustomAttributesPayload);
		expect(addCustom).toEqual(MOCK_PROMISE);
	});

	test('Should return promise adminAddUserToGroup - adminAddUserToGroup()', async () => {
		const addUserToGroup = await Cognito.adminAddUserToGroup(
			mockAdminAddUserToGroupPayload.GroupName,
			mockUsername,
			mockUserPoolId
		);
		expect(mockAdminAddUserToGroup).toBeCalledTimes(1);
		expect(mockAdminAddUserToGroup).toBeCalledWith(mockAdminAddUserToGroupPayload);
		expect(addUserToGroup).toEqual(MOCK_PROMISE);
	});

	test('Should return promise adminConfirmSignUp - adminConfirmSignUp()', async () => {
		const adminConfirm = await Cognito.adminConfirmSignUp(
			mockAdminConfirmSignUpPayload.ClientMetaData,
			mockUsername,
			mockUserPoolId,
		);
		expect(mockAdminConfirmSignUp).toBeCalledTimes(1);
		expect(mockAdminConfirmSignUp).toBeCalledWith(mockAdminConfirmSignUpPayload);
		expect(adminConfirm).toEqual(MOCK_PROMISE);
	});

	test('Should return promise adminCreateUser - adminCreateUser()', async () => {
		const {
			ClientMetaData,
			DesiredDeliveryMediums,
			ForceAliasCreation,
			MessageAction,
			TemporaryPassword,
			UserAttributes,
			ValidationData,
		} = mockAdminCreateUserPayload;
		const createUser = await Cognito.adminCreateUser(
			ClientMetaData,
			DesiredDeliveryMediums,
			ForceAliasCreation,
			MessageAction,
			TemporaryPassword,
			UserAttributes,
			mockUsername,
			mockUserPoolId,
			ValidationData,
		);
		expect(mockAdminCreateUser).toBeCalledTimes(1);
		expect(mockAdminCreateUser).toBeCalledWith(mockAdminCreateUserPayload);
		expect(createUser).toEqual(MOCK_PROMISE);
	});

	test('Should return promise Delete User - adminDeleteUser()', async () => {
		const deleteUser = await Cognito.adminDeleteUser(mockUsername, mockUserPoolId);
		expect(mockAdminDeleteUser).toBeCalledTimes(1);
		expect(mockAdminDeleteUser).toBeCalledWith(mockAdminDeleteUserPayload);
		expect(deleteUser).toEqual(MOCK_PROMISE);
	});

	test('Should return promise user - adminGetUser()', async () => {
		const user = await Cognito.adminGetUser(mockUsername, mockUserPoolId);
    expect(mockAdminGetUser).toBeCalledTimes(1);
		expect(mockAdminGetUser).toBeCalledWith(mockAdminGetUserPayload);
    expect(user).toEqual(MOCK_PROMISE);
  });

});
