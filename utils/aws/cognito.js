const aws = require('aws-sdk');

const client = new aws.CognitoIdentityServiceProvider();

// const userPoolId = 'TESTUSERPOOLID';

const addCustomAttributes = async (customAttributes, userPoolId) => {
	const params = {
		CustomAttributes: customAttributes,
		UserPoolId: userPoolId,
	};

	return client.addCustomAttributes(params).promise();
}

const adminAddUserToGroup = async (groupName, userName, userPoolId) => {
	const params = {
		GroupName: groupName,
		Username: userName,
		UserPoolId: userPoolId,
	};

	return client.adminAddUserToGroup(params).promise();
}

const adminConfirmSignUp = async (clientMetaData, userName, userPoolId) => {
	const params = {
		ClientMetaData: clientMetaData,
		Username: userName,
		UserPoolId: userPoolId,
	};

	return client.adminConfirmSignUp(params).promise();
}

const adminCreateUser = async (clientMetaData, desiredDeliveryMediums,
	forceAliasCreation, messageAction,
	temporaryPassword, userAttributes,
	userName, userPoolId, validationData) => {

	const params = {
		ClientMetaData: clientMetaData,
		DesiredDeliveryMediums: desiredDeliveryMediums,
		ForceAliasCreation: forceAliasCreation,
		MessageAction: messageAction,
		TemporaryPassword: temporaryPassword,
		UserAttributes: userAttributes,
		Username: userName,
		UserPoolId: userPoolId,
		ValidationData: validationData,
	};

	return client.adminCreateUser(params).promise();
}

const adminDeleteUser = async (userName, userPoolId) => {
	const params = {
		Username: userName,
		userPoolId: UserPoolId,
	};

	return client.adminDeleteUser(params).promise();
}

const adminGetUser = async (userName, userPoolId) => {
	const params = {
		Username: userName,
		UserPoolId,
		userPoolId,
	};

	return client.adminGetUser(params).promise();
}

const adminUpdateUserAttributes = async (userAttributes, userName, userPoolId) => {
	const params = {
		UserAttributes: userAttributes,
		Username: username,
		UserPoolId: userPoolId,
	};

	console.log(client);
	return client.adminUpdateUserAttributes(params).promise();
};

module.exports = {
	addCustomAttributes,
	adminAddUserToGroup,
	adminConfirmSignUp,
	adminCreateUser,
	adminDeleteUser,
	adminGetUser,
	adminUpdateUserAttributes,
}