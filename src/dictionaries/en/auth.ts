import { AuthDictionary } from "dictionaries/types/AuthDictionary";

export const AuthLang: AuthDictionary = {
  common: {
    slogan: "Start a project<br>with the utilities of Taskcover</br>",
    form: {
      title: {
        password: "Password",
        confirmPassword: "Confirm password",
      },
    },
  },
  signin: {
    head: {
      title: "Sign in | Taskcover",
    },
    title: "Login",
    // notSignup: "or do not have an account yet?",
    notSignup: "Haven't got account?",
    signupNow: "Sign up now",
    forgotPassword: "Forgot password?",
    key: "Sign in",
    notification: {
      signinSuccess: "Sign in successfully!",
      emailOrPasswordWrong: "Email or password is incorrect!",
    },
    rememberAccount: "Remember account",
  },
  signup: {
    head: {
      title: "Sign up | Taskcover",
    },
    form: {
      title: {
        fullName: "Full name",
        username: "Username",
        phone: "Phone number",
        avatar: "Avatar",
        position: "Position",
        email: 'Email'
      },
    },
    title: "Sign up",
    haveAccount: "or already have an account?",
    signinNow: "Sign in now",
    key: "Sign up",
    notification: {
      signupSuccess:
        "Successful registration, please check the code in the registration email!",
    },
  },
  verify: {
    head: {
      title: "Verify account | Taskcover",
    },
    form: {
      title: {
        code: "Code",
      },
    },
    title: "Verify account",
    description:
      "A code has been sent to your registered email. Please check your email and enter the code to complete the registration.",
    key: "Verify",
    notification: {
      signupSuccess: "Account verification successful, please sign in!",
    },
  },
  forgot: {
    head: {
      title: "Forgot password | Taskcover",
    },
    title: "Forgot password",
    description:
      "Password reset link will be sent to your email<br>Please enter your registered email</br>",
    messageSuccess:
      "Password reset link has been sent to your email<br>Please check your email</br>",
    backSignin: "Back to sign in",
    notification: {
      forgotSuccess: "Please visit the emailed link to change your password!",
    },
  },
  reset: {
    head: {
      title: "Reset new password | Taskcover",
    },
    form: {
      title: {
        newPassword: "New password",
      },
    },
    title: "Reset new password",
    notification: {
      resetSuccess: "Change password successfully, please sign in again.",
      linkWrong: "The link has timed out or is incorrect.",
    },
  },
  joinWorkspace: {
    head: {
      title: "Join workspace | Taskcover",
    },
    form: {
      title: {
        email: "Your work email",
      },
      error: {
        email: "Suffix email is invalid. Example: @example.com",
        notFound: "No company uses this suffix email address in the system.",
      },
    },
    getStarted: "Get started",
    title: "Enter your workspace",
    content:
      "You want to create your own company. Click button below to upgrade to a corporate account",
    confirmJoin: {
      title: "Confirm to join",
      content: "Are you sure to join company?",
      submit: "Join now",
    },
    notification: {
      success: "The request to join the workspace has been sent successfully!",
    },
  },
  waitingApprove: {
    head: {
      title: "Waiting for approval | Taskcover",
    },
    title: "Waiting for approval of your request...",
    description1: "Your request has been sent to the admin of ",
    description2: "Once approved, you will be added to your company's team.",
    cancelRequest: "Cancel request",
    notification: {
      success: "Your request has been sent successfully!",
      notFound: "The company does not exist or the email is incorrect.",
    },
    helpCenter: "Have a question? Contact us now",
    subtext1: "Waiting for",
    subtext2: "to approve your request...",
    footer: "© 2023 Task Cover Company, Inc.",
  }
};
