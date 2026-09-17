// Utility functions for mock authentication using localStorage
export const getRegisteredUsers = () => {
  const data = localStorage.getItem('registered_users');
  return data ? JSON.parse(data) : [];
};

export const addRegisteredUser = (user) => {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem('registered_users', JSON.stringify(users));
};

export const findUserByEmail = (email) => {
  const users = getRegisteredUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const deleteRegisteredUser = (id) => {
  const users = getRegisteredUsers();
  const filtered = users.filter(u => u.id !== id && u.email !== id);
  localStorage.setItem('registered_users', JSON.stringify(filtered));
};
