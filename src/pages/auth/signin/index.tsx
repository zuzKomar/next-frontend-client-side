'use client';
import { Button, Form, View } from '@adobe/react-spectrum';
import PageContainer from '../../components/PageContainer/PageContainer';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from '../../../styles/signup.module.scss';
import { signIn } from 'next-auth/react';
import IndexPage from '../../components/IndexPage';

type ILoginFormInputs = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(50).required(),
});

export default function Signin() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<ILoginFormInputs> = async (data, e: any) => {
    e.preventDefault();

    await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: '/',
    })
      .then(() => {
        router.push('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  function redirectToSignupPage() {
    router.push(`/auth/signup`);
  }

  return (
    <PageContainer>
      <IndexPage />
      <h1>Login</h1>
      <View width="70%" height="100%" UNSAFE_style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className={styles.signup__form}>
          <Form
            maxWidth="size-4600"
            isRequired
            necessityIndicator="label"
            onSubmit={handleSubmit(onSubmit)}
          >
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
            <Button
              variant="primary"
              type="submit"
              UNSAFE_className={styles.signup__form__submitbtn}
            >
              Login
            </Button>
          </Form>
          <div className={styles.signup__login}>
            <h3>
              Not a member?
              <span className={styles.signup__login__link} onClick={redirectToSignupPage}>
                {' '}
                Signup now!
              </span>
            </h3>
          </div>
        </div>
      </View>
    </PageContainer>
  );
}
