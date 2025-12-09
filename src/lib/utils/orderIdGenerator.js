// Generate short order ID like AB12345
export const generateShortOrderId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let letterPart = "";

  // Generate 2 random capital letters
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    letterPart += letters.charAt(randomIndex);
  }

  // Generate 5 random numbers
  let numberPart = "";
  for (let i = 0; i < 5; i++) {
    numberPart += Math.floor(Math.random() * 10);
  }

  return `${letterPart}${numberPart}`;
};

// Alternative: More robust version
export const generateOrderId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let id = "";

  // 2 random letters
  for (let i = 0; i < 2; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // 5 random numbers
  for (let i = 0; i < 5; i++) {
    id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return id;
};
