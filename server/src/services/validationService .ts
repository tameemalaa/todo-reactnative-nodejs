import * as Yup from 'yup';

interface UserRequestData {
username: string;
email: string;
password: string;
rePassword?: string;
}

class ValidationService {
    private static userSchema = Yup.object().shape({
        username: Yup.string().min(2).max(20).required(),
        email: Yup.string().email().required(),
        password: Yup.string().min(8).max(20).required(),
        rePassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .nullable(),
        });

    public static async validateUserSchema(requestData: UserRequestData): Promise<boolean> {
        try {
            await this.userSchema.validate(requestData);
            return true;
        } catch (error) {
        return false;
        }
    }
}

export default ValidationService;