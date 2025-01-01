import crypto from 'crypto';

const generateUniqueCustomId = (): string => {
  // Get current timestamp
  const timestamp: number = Date.now();
  
  // Convert timestamp to base 36 (numbers + lowercase letters)
  const timestampBase36: string = timestamp.toString(36);
  
  // Generate a random number between 0 and 1295 (36^2 - 1)
  const randomPart: number = Math.floor(Math.random() * 1296);
  
  // Convert random number to base 36 and ensure it's two characters
  const randomBase36: string = randomPart.toString(36).padStart(2, '0');
  
  // Combine timestamp and random parts
  return timestampBase36 + randomBase36;
};

export default generateUniqueCustomId;