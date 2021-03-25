const littleEndian = true;
function utf16le_encode(str) {
  const bytes = new Uint8Array(str.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    view.setUint16(i * 2, code, littleEndian);
  }
  return bytes;
}
function utf16le_decode(bytes) {
  const array = ArrayBuffer.isView(bytes) ? bytes : Uint8Array.from(bytes);
  const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  const chars = new Array(view.byteLength / 2);
  for (let i = 0; i < chars.length; i++) {
    const code = view.getUint16(i * 2, littleEndian);
    chars[i] = String.fromCharCode(code);
  }
  return chars.join('');
}
function utf8_encode(str) {
  let pos = 0;
  let buf = new Uint8Array(str.length * 3);
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const nextCode = i < str.length ? str.charCodeAt(i + 1) : 0;
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        i += 1;
        code = (code - 0xd800) * 0x400 + nextCode - 0xdc00 + 0x10000;
        if (code > 0xffff) {
          buf[pos++] = (0x1e << 3) | (code >>> 18);
          buf[pos++] = (0x2 << 6) | ((code >>> 12) & 0x3f);
          buf[pos++] = (0x2 << 6) | ((code >>> 6) & 0x3f);
          buf[pos++] = (0x2 << 6) | (code & 0x3f);
        }
      } else {
        buf[pos++] = 0xef;
        buf[pos++] = 0xbf;
        buf[pos++] = 0xbd;
      }
    } else if (code <= 0x007f) {
      buf[pos++] = (0x0 << 7) | code;
    } else if (code <= 0x07ff) {
      buf[pos++] = (0x6 << 5) | (code >>> 6);
      buf[pos++] = (0x2 << 6) | (code & 0x3f);
    } else {
      buf[pos++] = (0xe << 4) | (code >>> 12);
      buf[pos++] = (0x2 << 6) | ((code >>> 6) & 0x3f);
      buf[pos++] = (0x2 << 6) | (code & 0x3f);
    }
  }
  buf = new Uint8Array(buf.buffer.slice(0, pos));
  return buf;
}
function utf8_decode(bytes) {
  let pos = 0;
  const decodeUtf8 = () => {
    const i1 = bytes[pos++];
    if ((i1 & 0x80) === 0) {
      return i1;
    } else if ((i1 & 0xe0) === 0xc0) {
      const i2 = bytes[pos++];
      return ((i1 & 0x1f) << 6) | (i2 & 0x3f);
    } else if ((i1 & 0xf0) === 0xe0) {
      const i2 = bytes[pos++];
      const i3 = bytes[pos++];
      return ((i1 & 0x0f) << 12) | ((i2 & 0x3f) << 6) | (i3 & 0x3f);
    } else if ((i1 & 0xf8) === 0xf0) {
      const i2 = bytes[pos++];
      const i3 = bytes[pos++];
      const i4 = bytes[pos++];
      return (
        ((i1 & 0x07) << 18) |
        ((i2 & 0x3f) << 12) |
        ((i3 & 0x3f) << 6) |
        (i4 & 0x3f)
      );
    } else {
      throw new RangeError('Invalid UTF8 byte: ' + i1);
    }
  };
  const chars = new Array();
  while (pos < bytes.length) {
    const code = decodeUtf8();
    chars.push(String.fromCodePoint(code));
  }
  return chars.join('');
}
class UTF16LE {
  getBytes(str, index, count) {
    str = Array.isArray(str) ? str.join('') : str;
    if (index != null && count != null) {
      str = str.substring(index, index + count);
    } else if (index != null) {
      str = str.substring(index);
    }
    if (typeof Buffer !== 'undefined') {
      const bytes = Buffer.from(str, 'utf16le');
      return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    } else {
      return utf16le_encode(str); // polyfill
    }
  }
  getString(bytes, index, count) {
    const array = ArrayBuffer.isView(bytes) ? bytes : Uint8Array.from(bytes);
    let buffer = new Uint8Array(
      array.buffer,
      array.byteOffset,
      array.byteLength
    );
    if (index != null && count != null) {
      buffer = buffer.subarray(index, index + count);
    } else if (index != null) {
      buffer = buffer.subarray(index);
    }
    if (typeof TextDecoder !== 'undefined') {
      return new TextDecoder('utf-16le').decode(buffer);
    } else if (typeof Buffer !== 'undefined') {
      return Buffer.from(buffer).toString('utf16le');
    } else {
      return utf16le_decode(buffer); // polyfill
    }
  }
}
class UTF8 {
  getBytes(str, index, count) {
    str = Array.isArray(str) ? str.join('') : str;
    if (index != null && count != null) {
      str = str.substring(index, index + count);
    } else if (index != null) {
      str = str.substring(index);
    }
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str);
    } else if (typeof Buffer !== 'undefined') {
      const bytes = Buffer.from(str, 'utf8');
      return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    } else {
      return utf8_encode(str); // polyfill
    }
  }
  getString(bytes, index, count) {
    const array = ArrayBuffer.isView(bytes) ? bytes : Uint8Array.from(bytes);
    let buffer = new Uint8Array(
      array.buffer,
      array.byteOffset,
      array.byteLength
    );
    if (index != null && count != null) {
      buffer = buffer.subarray(index, index + count);
    } else if (index != null) {
      buffer = buffer.subarray(index);
    }
    if (typeof TextDecoder !== 'undefined') {
      return new TextDecoder().decode(buffer);
    } else if (typeof Buffer !== 'undefined') {
      return Buffer.from(buffer).toString('utf8');
    } else {
      return utf8_decode(buffer); // polyfill
    }
  }
}
const _UTF16 = new UTF16LE();
const _UTF8 = new UTF8();
export function get_Unicode() {
  return _UTF16;
}
export function get_UTF8() {
  return _UTF8;
}
