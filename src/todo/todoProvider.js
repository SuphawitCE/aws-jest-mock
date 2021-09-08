export const getTodo = () => {
  console.log('Fetching Todo-list from db...');

  return [
    {
      _id: 1,
      name: 'Develop frontend react',
      isDone: false,
    },
    {
      _id: 2,
      name: 'Fix bug on a shopping cart',
      isDone: true,
    },
    {
      _id: 3,
      name: 'Develop and main AWS Cognito and also unit test',
      isDone: false,
    }
  ]; 
}
