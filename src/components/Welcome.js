import React from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword
} from "firebase/auth";
import styled from "styled-components";

const Form = styled.form`
  margin-top: 20px;
`;

const Container = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
`;

const Input = styled.input`
  height: 32px;
  border-radius: 5px;
  border: 1px solid #94a3b8;
  background-color: unset;
`;

const Label = styled.label`
  margin-right: 8px;
  color: #475569;
  font-size: 14px;
`;

const Button = styled.button`
  width: 220px;
  height: 36px;
  border: none;
  color: white;
  outline: none;
  margin-top: 8px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #0284c7;
  :active {
    transform: scale(1.1);
  }
`;

const Welcome = () => {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      alert(`${error.message}-${error.code}`);
    });
  };

  return (
    <main className="welcome">
      <button className="sign-in" onClick={googleSignIn}>
        <img
          onClick={googleSignIn}
          src={GoogleSignin}
          alt="sign in with google"
          type="button"
        />
      </button>
      <hr />
      <Form onSubmit={onFormSubmit}>
        <Container>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" />
        </Container>
        <Container>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" />
        </Container>
        <Button type="submit">LOG IN</Button>
      </Form>
    </main>
  );
};

export default Welcome;
