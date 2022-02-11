const aws = require("aws-sdk");

const client = new aws.CognitoIdentityServiceProvider();

const updateUserPool = async (
  accountRecoverySetting,
  adminCreateUserConfig,
  autoVerifiedAttributes,
  deviceConfiguration,
  emailConfiguration,
  emailVerificationMessage,
  emailVerificationSubject,
  lambdaConfig,
  mfaConfiguration,
  policies,
  smsAuthenticationMessage,
  smsConfiguration,
  smsVerificationMessage,
  userPoolAddOns,
  userPoolId,
  userPoolTags,
  verificationMessageTemplate
) => {
  const params = {
    AccountRecoverySetting: accountRecoverySetting,
    AdminCreateUserConfig: adminCreateUserConfig,
    AutoVerifiedAttributes: autoVerifiedAttributes,
    DeviceConfiguration: deviceConfiguration,
    EmailConfiguration: emailConfiguration,
    EmailVerificationMessage: emailVerificationMessage,
    EmailVerificationSubject: emailVerificationSubject,
    LambdaConfig: lambdaConfig,
    MfaConfiguration: mfaConfiguration,
    Policies: policies,
    SmsAuthenticationMessage: smsAuthenticationMessage,
    SmsConfiguration: smsConfiguration,
    SmsVerificationMessage: smsVerificationMessage,
    UserPoolAddOns: userPoolAddOns,
    UserPoolId: userPoolId,
    UserPoolTags: userPoolTags,
    VerificationMessageTemplate: verificationMessageTemplate,
  };

  return client.updateUserPool(params).promise();
};

module.exports = {
  updateUserPool,
};
