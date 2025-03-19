// export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const emailRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9._%-]*[a-zA-Z][a-zA-Z0-9._%-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^(?=.*[a-zA-Z])[^0-9@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const restrictingGmailandYahooRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9._%-]*[a-zA-Z][a-zA-Z0-9._%-]*@(?!gmail\.com|yahoo\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^(?=.*[a-zA-Z])[^0-9@]+@(?!gmail\.com|yahoo\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const urlRegex =
  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/;

export const nameRegex = /^[a-zA-Z\s]+$/;
export const startupNameRegex = /^(?=.*[a-zA-Z])([a-zA-Z0-9\s]*)$/;

export const linkRegex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;

export const descriptionRegex =
  /^(?:[a-zA-Z0-9 !@#$%^&*()\[\]{}|;:'",.<>?\/\-_=+]{1,48})(?:\s+[a-zA-Z0-9 !@#$%^&*()\[\]{}|;:'",.<>?\/\-_=+]{1,48})*$/;

export const mobileNumberRegex = /^\+\d{1,3}-\d+$/;

export const digitRegex = /^\d+$/;

export const linkedInRegex =
  /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company|groups)\/[a-zA-Z0-9._-]+\/?(\?.*)?$/;

/**
 * This url will accept empty input box too
 *
 */
export const linkUrlRegex = /^(https?:\/\/(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/[^\s]*)?)$/;
export const facebookRegex =
  /^(https?:\/\/)?(www\.)?facebook\.com\/(pages\/[a-zA-Z0-9_-]+\/[0-9]+|groups\/[a-zA-Z0-9_-]+|[a-zA-Z0-9.]+)\/?(\?.*)?$/;
export const instagramRegex =
  /^(https?:\/\/)?(www\.)?instagram\.com\/([a-zA-Z0-9._]+)(\/[a-zA-Z0-9._-]+)?\/?(\?.*)?$/;
export const youTubeRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=[\w-]+|channel\/[\w-]+|c\/[\w-]+|user\/[\w-]+|playlist\?list=[\w-]+|shorts\/[\w-]+|[\w-]+)\/?(\?.*)?$/;
export const XRegex =
  /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\/([a-zA-Z0-9_]+)(\/status\/[0-9]+)?\/?(\?.*)?$/;

export const signInEmailRegex =
  /^\s*(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9._%-]*[a-zA-Z][a-zA-Z0-9._%-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$|^\s*(?=.*[a-zA-Z])[^0-9@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$/;

export const NotMoreThan20CharactersWithoutSpace = /^(?!.*\b[a-zA-Z0-9]{21,}\b).*$/;
export const alphaNumericChar = /^[a-zA-Z0-9]+$/;
