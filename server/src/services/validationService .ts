import * as Yup from 'yup';

interface UserSignupRequestData {
username: string;
email: string;
password: string;
rePassword: string;
}
interface UserSigninRequestData {
usernameOrEmail: string;
password: string;
}


class ValidationService {
    private static userSignupSchema = Yup.object().shape({
        username: Yup.string()
          .matches(/^[a-zA-Z0-9._]+$/, 'Username cannot contain special characters except for "." and "_"')
          .min(2, 'Username should be at least 2 characters long')
          .max(20, 'Username should not exceed 20 characters')
          .required('Username is required'),
        email: Yup.string()
          .email('Invalid email format')
          .required('Email is required'),
        password: Yup.string()
          .min(8, 'Password should be at least 8 characters long')
          .max(20, 'Password should not exceed 20 characters')
          .required('Password is required'),
        rePassword: Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Please confirm your password'),
      });
    

    private static userSigninSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required('Username or email is required'),
        password: Yup.string().required('Password is required'),
    });
    
        public static async validateUserSignupSchema(requestData: UserSignupRequestData): Promise<boolean> {
        try {
            await this.userSignupSchema.validate(requestData);
            return true;
        } catch (error) {
        return false;
        }
    }

    public static async validateUserSigninSchema(requestData: UserSigninRequestData): Promise<boolean> {
        try {
            await this.userSigninSchema.validate(requestData);
            return true;
        } catch (error) {
        return false;
        }
    }
}

export default ValidationService;