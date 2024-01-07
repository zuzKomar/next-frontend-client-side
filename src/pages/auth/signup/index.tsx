import { Button, Form, View } from '@adobe/react-spectrum';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from '../../../styles/signup.module.scss';
import { signIn } from 'next-auth/react';
import { IFormInputs } from '../../../types/UserForm';
import IndexPage from '../../components/IndexPage';

const schema = yup.object({
  firstName: yup.string().required().min(2).max(30),
  lastName: yup.string().required().min(2).max(30),
  phone: yup.string().required().min(9).max(15),
  pesel: yup
    .string()
    .min(11)
    .max(11)
    .test('validatePesel', function validatePesel(pesel) {
      const reg = /^[0-9]{11}$/;
      if (reg.test(pesel!) === false) return false;
      else {
        const digits = ('' + pesel).split('');
        if (parseInt(pesel!.substring(4, 6)) > 31 || parseInt(pesel!.substring(2, 4)) > 12)
          return false;

        let checksum =
          (1 * parseInt(digits[0]) +
            3 * parseInt(digits[1]) +
            7 * parseInt(digits[2]) +
            9 * parseInt(digits[3]) +
            1 * parseInt(digits[4]) +
            3 * parseInt(digits[5]) +
            7 * parseInt(digits[6]) +
            9 * parseInt(digits[7]) +
            1 * parseInt(digits[8]) +
            3 * parseInt(digits[9])) %
          10;
        if (checksum === 0) checksum = 10;
        checksum = 10 - checksum;

        return parseInt(digits[10]) === checksum;
      }
    })
    .required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(50).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''])
    .required(),
});

export default function Signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInputs> = async data => {
    const createUserDto = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      pesel: data.pesel,
      email: data.email,
      password: data.password,
      role: 'USER',
    };

    //in the end send post request add user role to dto
    fetch(`${process.env.NEST_URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(createUserDto),
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(() => {
        signIn();
        router.push(`/auth/signin`);
      })
      .catch(e => {
        console.log(e);
        throw new Error(e);
      });
  };

  function redirectToSigninPage() {
    router.push(`/auth/signin`);
  }

  return (
    <PageContainer>
      <IndexPage />
      <h1>Wanna join? Create new account!</h1>
      <View UNSAFE_style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} width="70%" height="100%">
        <div className={styles.signup__form}>
          <Form
            maxWidth="size-4600"
            isRequired
            necessityIndicator="label"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.signup__form__input}>
              <div className={styles.signup__form__input__data}>
                <label htmlFor="firstName">First name*</label>
                <input
                  type="text"
                  id="firstName"
                  className={styles.signup__form__input__data__input}
                  {...register('firstName')}
                />
              </div>
              <p className={styles.signup__form__input__error}>{errors.firstName?.message}</p>
            </div>

            <div className={styles.signup__form__input}>
              <div className={styles.signup__form__input__data}>
                <label htmlFor="lastName">Last name*</label>
                <input
                  type="text"
                  id="lastName"
                  className={styles.signup__form__input__data__input}
                  {...register('lastName')}
                />
              </div>
              <p className={styles.signup__form__input__error}>{errors.lastName?.message}</p>
            </div>

            <div className={styles.signup__form__input}>
              <div className={styles.signup__form__input__data}>
                <label htmlFor="phone">Phone*</label>
                <input
                  type="text"
                  id="phone"
                  className={styles.signup__form__input__data__input}
                  {...register('phone')}
                />
              </div>
              <p className={styles.signup__form__input__error}>{errors.phone?.message}</p>
            </div>

            <div className={styles.signup__form__input}>
              <div className={styles.signup__form__input__data}>
                <label htmlFor="pesel">Pesel*</label>
                <input
                  type="text"
                  id="pesel"
                  className={styles.signup__form__input__data__input}
                  {...register('pesel')}
                />
              </div>
              <p className={styles.signup__form__input__error}>{errors.pesel?.message}</p>
            </div>

            <div className={styles.signup__form__input}>
              <div className={styles.signup__form__input__data}>
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  className={styles.signup__form__input__data__input}
                  {...register('email')}
                />
              </div>
              <p className={styles.signup__form__input__error}>{errors.email?.message}</p>
            </div>

            <div className={styles.signup__form__input}>
              <div className={styles.signup__form__input__data}>
                <label htmlFor="password">Password*</label>
                <input
                  type="password"
                  id="password"
                  className={styles.signup__form__input__data__input}
                  {...register('password')}
                />
              </div>
              <p className={styles.signup__form__input__error}>{errors.password?.message}</p>
            </div>

            <div className={styles.signup__form__input}>
              <div className={styles.signup__form__input__data}>
                <label htmlFor="confirmPassword">Confirm password*</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={styles.signup__form__input__data__input}
                  {...register('confirmPassword')}
                />
              </div>
              <p className={styles.signup__form__input__error}>{errors.confirmPassword?.message}</p>
            </div>

            <Button
              variant="primary"
              type="submit"
              UNSAFE_className={styles.signup__form__submitbtn}
            >
              Create new account
            </Button>
          </Form>
          <div className={styles.signup__login}>
            <h3>
              Already a member?{' '}
              <span className={styles.signup__login__link} onClick={redirectToSigninPage}>
                Login here
              </span>
            </h3>
          </div>
        </div>
      </View>
    </PageContainer>
  );
}
