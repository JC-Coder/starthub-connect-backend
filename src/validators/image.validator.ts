export const ImageValidators = {
  Regex: /^\w+.(png|jpeg|jpg|svg)$/,
  MaxSize: 2000000,
};

export const ImageValidatorMessages = {
  MaxSizeMessage: 'Image size should not be more than 2mb',
  RegexMessage: 'Image should only be of type png, jpeg , jpg',
};
