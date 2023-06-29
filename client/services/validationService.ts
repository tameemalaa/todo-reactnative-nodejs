import * as Yup from 'yup';

interface UserSignUpRequestData {
username: string;
email: string;
password: string;
rePassword: string;
}
interface UserSignInRequestData {
usernameOrEmail: string;
password: string;
}

interface PostTaskRequestData {
title: string;
description?: string;
finished?: boolean;
priority?: number;
deadline?: string;
}

interface PatchTaskRequestData {
title?: string;
description?: string;
finished?: boolean;
priority?: number;
deadline?: string;
}
class ValidationService {
    private static userSignUpSchema = Yup.object().shape({
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
    

    private static userSignInSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required('Username or email is required'),
        password: Yup.string().required('Password is required'),
    });
    
    private static postTaskSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string(),
        finished: Yup.boolean(),
        priority: Yup.number().lessThan(5).moreThan(0),
        deadline: Yup.date(),
    });

    private static patchTaskSchema = Yup.object().shape({
        title: Yup.string(),
        description: Yup.string(),
        finished: Yup.boolean(),
        priority: Yup.number().lessThan(5).moreThan(0),
        deadline: Yup.date(),
    })

        public static async validateUserSignUpSchema(requestData: UserSignUpRequestData): Promise<boolean> {
        try {
            await this.userSignUpSchema.validate(requestData);
            return true;
        } catch (error) {
            console.log(error);
        return false;
        }
    }

    public static async validateUserSignInSchema(requestData: UserSignInRequestData): Promise<boolean> {
        try {
            await this.userSignInSchema.validate(requestData);
            return true;
        } catch (error) {
        return false;
        }
    }


    public static async validatePostTaskSchema(requestData: PostTaskRequestData): Promise<boolean> {
        try {
            await this.postTaskSchema.validate(requestData);
            return true;
        } catch (error) {
        return false;
        }
    }

    public static async validatePatchTaskSchema(requestData: PatchTaskRequestData): Promise<boolean> {
        try {
            await this.patchTaskSchema.validate(requestData);
            return true;
        } catch (error) {
        return false;
        }
    }
    
}

export default ValidationService;