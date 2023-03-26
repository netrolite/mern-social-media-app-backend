import { nanoid } from "nanoid";

export function getRandomProfilePath() {
  const randomCharsLength = 9;
  return `user${nanoid(randomCharsLength)}`
}

export function getPostPath(postBody: string) {
  postBody = toLowerCaseAndSlice(postBody);
  postBody = removeSpecialChars(postBody);  
  postBody = removeLastWord(postBody);
  postBody = replaceSpacesWithDashes(postBody);

  if (isUrlFriendly(postBody)) {
    return `${postBody}-${nanoid(10)}`;
  } else {
    return nanoid();
  }
}

function toLowerCaseAndSlice(str: string) {
  str = str.toLowerCase();
  return str.slice(0, 70);
}

function removeSpecialChars(str: string) {
  const specialCharsRegex = /[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\[\]\;\:\'\"\<\>\?\,\.\/\\\|]/g;
  return str.replace(specialCharsRegex, "");
}

function removeLastWord(str: string) {
  const splitStr = str.split(" ");
  splitStr.pop();
  return splitStr.join(" ");
}

function replaceSpacesWithDashes(str: string) {
  return str.replace(/\s/g, "-");
}

function isUrlFriendly(str: string) {
  const regex = /^[a-z0-9-\s]+$/;
  return regex.test(str);
}