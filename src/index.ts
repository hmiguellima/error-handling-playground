import { Result, ok, err } from 'neverthrow';

interface User {
  id: number;
  name: string;
}

function findUser(id: number): Result<User, Error> {
  if (id > 0) {
    return ok({ id, name: `User ${id}` });
  }
  return err(new Error(`User with id ${id} not found`));
}

// Usage
const result = findUser(0);

result.match(
  (user) => console.log(`Found: ${user.name}`),
  (error) => console.error(`Error: ${error.message}`)
);

