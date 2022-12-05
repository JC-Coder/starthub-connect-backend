import * as fs from 'fs';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';

export const Helpers = {
  generateRandomString: (length: number) => {
    const nanoid = customAlphabet('123456789abcdefghijklmopqrstuvwxyz');
    return nanoid(length);
  },

  deleteImage: (image: string) => {
    fs.unlink(`./uploads/images/${image}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },

  validatePassword: (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
  },

  hashPassword: (password: string) => {
    return bcrypt.hash(password, 10);
  },
};
