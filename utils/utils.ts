function jwt_decode(token: any) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export function isTokenExpired(token: any) {
  const decodedToken = jwt_decode(token);
  const expirationTime = decodedToken.exp;
  const currentTime = Date.now() / 1000; // convert to seconds

  if (currentTime > expirationTime) {
    // Token has expired
    return true;
  } else {
    // Token is still valid
    return false;
  }
}



const IPFS = 'ipfs://'
export function formatLink(str?: string) {
  if (!str) return ''
  const isMatch = str.startsWith(IPFS)
  if (isMatch) {
    const hash = str.replace(IPFS, '')
    return `https://ipfs.io/ipfs/${hash}`
  }
  return str
}

export const getShortenName = (address?: string) => {
  if (address) {
    const pod1 = address.slice(0, 6)
    const pod2 = address.slice(address.length - 4)
    return `${pod1}...${pod2}`
  }
  return ''
}

export function generateColorFromAddress(address: any) {
  if (!address) return 'hsl(0, 0%, 50%)';
  const hash = address
    .split('')
    .reduce((acc: any, char: any) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 50%, 50%)`;
}
const userLocale = 'en-US'

const currencyOptions: Intl.NumberFormatOptions = {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2
  // notation: 'compact', //user can choose this
}

const numberOptions: Intl.NumberFormatOptions = {
  style: 'decimal',
  maximumFractionDigits: 2
}

export const numberFormatter = {
  compact: (value?: string | number, digits = 4) => {
    const formatter = new Intl.NumberFormat(userLocale, {
      ...numberOptions,
      notation: 'compact',
      maximumFractionDigits: digits
    })
    return formatter.format(Number(value ?? 0))
  },
  format: (value?: string | number, digits = 2) => {
    const formatter = new Intl.NumberFormat(userLocale, {
      ...numberOptions,
      maximumFractionDigits: digits
    })
    return formatter.format(Number(value ?? 0))
  }
}

export const currencyFormatter = {
  compact: (value?: string | number, digits = 4) => {
    const formatter = new Intl.NumberFormat(userLocale, {
      ...currencyOptions,
      notation: 'compact',
      maximumFractionDigits: digits
    })
    return formatter.format(Number(value ?? 0))
  },
  format: (value?: string | number, digits = 2) => {
    const formatter = new Intl.NumberFormat(userLocale, {
      ...currencyOptions,
      minimumFractionDigits: digits
    })
    return formatter.format(Number(value ?? 0))
  }
}
