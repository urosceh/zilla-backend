import UserModel from "../database/models/user.model";
import {TransactionManager} from "../database/transaction.manager";

// Get command line arguments
const args = process.argv.slice(2);
const tenant = args[0];
const amountOfUsers = parseInt(args[1]);
const domainName = args[2];

if (!tenant || !amountOfUsers || !domainName || amountOfUsers > 500 || amountOfUsers < 1) {
  console.error("Usage: node seed.users.script.ts <tenant> <amountOfUsers> <domainName>");
  console.error("Amount of users must be between 1 and 500");
  process.exit(1);
}

// Pool of 25 first names and 25 last names
const firstNames = [
  "Alex",
  "Ben",
  "Cole",
  "Dan",
  "Eva",
  "Fox",
  "Gus",
  "Hal",
  "Ivy",
  "Jay",
  "Kim",
  "Leo",
  "Max",
  "Nia",
  "Oak",
  "Pip",
  "Rex",
  "Sam",
  "Tia",
  "Uma",
  "Val",
  "Wade",
  "Xara",
  "Yve",
  "Zoe",
];

const lastNames = [
  "Ash",
  "Bell",
  "Cox",
  "Day",
  "Ely",
  "Fox",
  "Gray",
  "Hill",
  "Ice",
  "Joy",
  "King",
  "Lee",
  "May",
  "Nash",
  "Oak",
  "Pike",
  "Ross",
  "Sun",
  "Tay",
  "Uhl",
  "Vale",
  "West",
  "Xu",
  "York",
  "Zane",
];

// Function to generate random alphanumeric password (8 characters)
function generateRandomPassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Function to get name combination by index (sequential, not random)
function getNameByIndex(index: number): {firstName: string; lastName: string} {
  const firstNameIndex = (index - 1) % firstNames.length;
  const lastNameIndex = Math.floor((index - 1) / firstNames.length) % lastNames.length;
  return {
    firstName: firstNames[firstNameIndex],
    lastName: lastNames[lastNameIndex],
  };
}

// Function to generate unique email
function generateEmail(firstName: string, lastName: string, index: number): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domainName}`;
}

(async () => {
  const transaction = await TransactionManager.createTenantTransaction(tenant);
  try {
    const users = [];

    for (let i = 1; i <= amountOfUsers; i++) {
      const {firstName, lastName} = getNameByIndex(i);
      const email = generateEmail(firstName, lastName, i);
      const password = generateRandomPassword();

      const user = await UserModel.create(
        {
          email,
          password,
          firstName,
          lastName,
        },
        {
          logging: false,
          transaction,
        }
      );

      users.push({userId: user.userId, email, password});
    }

    // Log only the email and password pairs
    users.forEach((user) => {
      console.log(`${user.userId},${user.email},${user.password}`);
    });

    await transaction.commit();

    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating users:", error);
    process.exit(1);
  }
})();
