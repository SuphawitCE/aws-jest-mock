const {
  MOCK_PROMISE,
  mockUsername,
  mockUsersPresent,
  mockUserPoolId,
} = require("../fixtures/aws/cognito/general.json");

const {
  mockUpdateUserPoolPayload,
  //	...
} = require("../fixtures/aws/cognito/mockEventPayload.json");

const { mockEmptyUsers } = require("../fixtures/aws/cognito/mockResponse.json");

const mockPromiseFn = jest.fn(() => mockEmptyUsers);
const mockPromise = {
  promise: jest.fn(() => MOCK_PROMISE),
};

const mockUpdateUserPool = jest.fn(() => mockPromise);
//	...

const mockCognitoIdentityServiceProvider = jest.fn(() => ({
  updateUserPool: mockUpdateUserPool,
  //	...
}));

const Cognito = require("../../utils/aws/cognito/index");

jest.mock("aws-sdk", () => ({
  CognitoIdentityServiceProvider: mockCognitoIdentityServiceProvider,
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("Cognito - /utils/aws/cognito functonality", () => {
  const {
    AccountRecoverySetting,
    AdminCreateUserConfig,
    AutoVerifiedAttributes,
    DeviceConfiguration,
    EmailConfiguration,
    EmailVerificationMessage,
    EmailVerificationSubject,
    LambdaConfig,
    MfaConfiguration,
    Policies,
    SmsAuthenticationMessage,
    SmsConfiguration,
    SmsVerificationMessage,
    UserPoolAddOns,
    UserPoolId,
    UserPoolTags,
    VerificationMessageTemplate,
  } = mockUpdateUserPoolPayload;

  console.log("--------------- Async/Await ---------------");
  test("Should return async/await update userpool - updateUserPool()", async () => {
    const updatePool = await Cognito.updateUserPool(
      AccountRecoverySetting,
      AdminCreateUserConfig,
      AutoVerifiedAttributes,
      DeviceConfiguration,
      EmailConfiguration,
      EmailVerificationMessage,
      EmailVerificationSubject,
      LambdaConfig,
      MfaConfiguration,
      Policies,
      SmsAuthenticationMessage,
      SmsConfiguration,
      SmsVerificationMessage,
      UserPoolAddOns,
      UserPoolId,
      UserPoolTags,
      VerificationMessageTemplate
    );

    expect(mockUpdateUserPool).toBeCalledTimes(1);
    expect(mockUpdateUserPool).toBeCalledWith(mockUpdateUserPoolPayload);
    expect(updatePool).toEqual(MOCK_PROMISE);
  });

  console.log("--------------- Promise Resolves/Rejects ---------------");
  test("Should return resolves update userpool - updateUserPool()", async () => {
    console.log("updateUserPool() - Resolves");
    mockPromiseFn.mockResolvedValueOnce("updateUserPool - Success");

    const updatePool = await Cognito.updateUserPool(
      AccountRecoverySetting,
      AdminCreateUserConfig,
      AutoVerifiedAttributes,
      DeviceConfiguration,
      EmailConfiguration,
      EmailVerificationMessage,
      EmailVerificationSubject,
      LambdaConfig,
      MfaConfiguration,
      Policies,
      SmsAuthenticationMessage,
      SmsConfiguration,
      SmsVerificationMessage,
      UserPoolAddOns,
      UserPoolId,
      UserPoolTags,
      VerificationMessageTemplate
    );

    expect(mockUpdateUserPool).toBeCalledTimes(1);
    expect(updatePool).toEqual(MOCK_PROMISE);
  });

  test("Should return rejects update userpool - updateUserPool()", async () => {
    console.log("updateUserPool() - Rejects");
    mockPromiseFn.mockRejectedValueOnce(
      new Error("reject updateUserPool() thrown error")
    );

    await expect(async () =>
      Cognito.updateUserPool(
        AccountRecoverySetting,
        AdminCreateUserConfig,
        AutoVerifiedAttributes,
        DeviceConfiguration,
        EmailConfiguration,
        EmailVerificationMessage,
        EmailVerificationSubject,
        LambdaConfig,
        MfaConfiguration,
        Policies,
        SmsAuthenticationMessage,
        SmsConfiguration,
        SmsVerificationMessage,
        UserPoolAddOns,
        UserPoolId,
        UserPoolTags,
        VerificationMessageTemplate
      ).rejects.toThrowError("updateUserPool() error")
    );
  });
});
