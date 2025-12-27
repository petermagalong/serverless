exports.generateRandomName = async () => {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];
  const randomIndex = Math.floor(Math.random() * names.length);
  console.log(`Generated random name: ${names[randomIndex]}`);
  return names[randomIndex];
}