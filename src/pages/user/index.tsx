import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import PageContainer from '../components/PageContainer/PageContainer';
import * as yup from 'yup';
import styles from '../../styles/signup.module.scss';
import { Button, Form, TextField, View } from '@adobe/react-spectrum';
import { IFormInputs } from '../../types/UserForm';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import IndexPage from '../components/IndexPage';

const schema = yup.object({
  firstName: yup.string().required().min(2).max(30),
  lastName: yup.string().required().min(2).max(30),
  phone: yup.string().required().min(9).max(15),
  email: yup.string().email(),
  password: yup.string().min(0).max(50),
  confirmPassword: yup.string().oneOf([yup.ref('password'), '']),
});

export default function UserPage() {
  const { data } = useSession();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>();
  const token = data?.user ? data.user.token : '';
  const email = data?.user ? data.user.email : '';
  let loginCredentialsChanged = false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (data) {
      fetch(`${process.env.NEST_URL}/users/${email}`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(res => res.json())
        .then(res => setFormData(res));
    }
  }, []);

  const onSubmit: SubmitHandler<IFormInputs> = async (data, e: any) => {
    e.preventDefault();
    const updateUserDto: any = {};

    if (data.firstName && data.firstName.length > 0) {
      updateUserDto['firstName'] = data.firstName;
    }

    if (data.lastName && data.lastName.length > 0) {
      updateUserDto['lastName'] = data.lastName;
    }

    if (data.phone && data.phone.length > 0) {
      updateUserDto['phone'] = data.phone;
    }

    if (data.email && data.email.length > 0) {
      updateUserDto['email'] = data.email;
      loginCredentialsChanged = true;
    }

    if (data.password && data.password.length > 0) {
      updateUserDto['password'] = data.password;
      loginCredentialsChanged = true;
    }

    fetch(`${process.env.NEST_URL}/users/${formData.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateUserDto),
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(res => {
        setEditMode(false);
        setFormData(res);
        if (loginCredentialsChanged) {
          signOut();
        }
      })
      .catch(e => {
        console.log(e);
        throw new Error(e);
      });
  };

  return (
    <PageContainer checkAuthorized={true}>
      <IndexPage />
      <h1>{editMode ? 'Edit User Profile' : 'User Profile'}</h1>
      <View UNSAFE_style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} width="70%" height="100%">
        <div className={styles.signup__form}>
          {!editMode ? (
            <>
              <TextField label="First name:" value={formData ? formData?.firstName : ''} />
              <TextField label="Last name:" value={formData ? formData?.lastName : ''} />
              <TextField label="Phone:" value={formData ? formData?.phone : ''} />
              <TextField label="Email:" value={formData ? formData?.email : ''} />
              <View>
                <Button variant="primary" onPress={() => setEditMode(true)} marginTop="size-100">
                  Edit profile
                </Button>
              </View>
            </>
          ) : (
            <>
              <Form
                maxWidth="size-4600"
                necessityIndicator="label"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className={styles.signup__form__input}>
                  <div className={styles.signup__form__input__data}>
                    <label htmlFor="firstName">First name:</label>
                    <input
                      type="text"
                      id="firstName"
                      defaultValue={formData ? formData?.firstName : ''}
                      className={styles.signup__form__input__data__input}
                      {...register('firstName')}
                    />
                  </div>
                  <p className={styles.signup__form__input__error}>{errors.firstName?.message}</p>
                </div>

                <div className={styles.signup__form__input}>
                  <div className={styles.signup__form__input__data}>
                    <label htmlFor="lastName">Last name:</label>
                    <input
                      type="text"
                      id="lastName"
                      defaultValue={formData ? formData?.lastName : ''}
                      className={styles.signup__form__input__data__input}
                      {...register('lastName')}
                    />
                  </div>
                  <p className={styles.signup__form__input__error}>{errors.lastName?.message}</p>
                </div>

                <div className={styles.signup__form__input}>
                  <div className={styles.signup__form__input__data}>
                    <label htmlFor="phone">Phone:</label>
                    <input
                      type="text"
                      id="phone"
                      defaultValue={formData ? formData?.phone : ''}
                      className={styles.signup__form__input__data__input}
                      {...register('phone')}
                    />
                  </div>
                  <p className={styles.signup__form__input__error}>{errors.phone?.message}</p>
                </div>

                <div className={styles.signup__form__input}>
                  <div className={styles.signup__form__input__data}>
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      defaultValue={formData ? formData?.email : ''}
                      className={styles.signup__form__input__data__input}
                      {...register('email')}
                    />
                  </div>
                  <p className={styles.signup__form__input__error}>{errors.email?.message}</p>
                </div>

                <div className={styles.signup__form__input}>
                  <div className={styles.signup__form__input__data}>
                    <label htmlFor="password">Password:</label>
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
                    <label htmlFor="confirmPassword">Confirm password:</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className={styles.signup__form__input__data__input}
                      {...register('confirmPassword')}
                    />
                  </div>
                  <p className={styles.signup__form__input__error}>
                    {errors.confirmPassword?.message}
                  </p>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  UNSAFE_className={styles.signup__form__submitbtn}
                >
                  Save changes
                </Button>
              </Form>
            </>
          )}
        </div>
      </View>
    </PageContainer>
  );
}
