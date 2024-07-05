"use client";

import { memo, useState } from "react";
import Signup from "./Signup";
import Verify from "./Verify";
import { useAuth } from "store/app/selectors";
import { SignupStep } from "store/app/reducer";

const SignupWrapper = () => {
  const { signupStep } = useAuth();

  if (signupStep === SignupStep.VERIFY) return <Verify />;

  return <Signup />;
};

export default memo(SignupWrapper);
