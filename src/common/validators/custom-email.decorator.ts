import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNortheasternEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNortheasternEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log('🚀 ~ validate ~ args:', args.value);
          const emailRegex = /^[a-zA-Z0-9._%+-]+@northeastern\.edu$/;
          return typeof value === 'string' && emailRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a Northeastern email (@northeastern.edu)`;
        },
      },
    });
  };
}
