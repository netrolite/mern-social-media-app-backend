export function profileIdValidator(id: string) {
  const urlRegex = /^[a-z0-9-_]+$/i;
  return urlRegex.test(id);
}

export function friendsValidator(friends: object[]) {
  const len = friends.length;

  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      const prev = friends[i].toString();
      const curr = friends[j].toString();
      if (prev === curr) return false;
    }
  }
  return true;
}