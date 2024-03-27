export type AuthDictionary = {
  common: {
    slogan: string;
    form: {
      title: {
        password: string;
        confirmPassword: string;
      };
    };
  };
  signin: {
    head: {
      title: string;
    };
    title: string;
    notSignup: string;
    signupNow: string;
    forgotPassword: string;
    key: string;
    notification: {
      signinSuccess: string;
      emailOrPasswordWrong: string;
    };
  };
  signup: {
    head: {
      title: string;
    };
    form: {
      title: {
        fullName: string;
        phone: string;
        avatar: string;
        position: string;
        email: string;
      };
    };
    title: string;
    haveAccount: string;
    signinNow: string;
    key: string;
    notification: {
      signupSuccess: string;
    };
  };
  verify: {
    head: {
      title: string;
    };
    form: {
      title: {
        code: string;
      };
    };
    title: string;
    description: string;
    key: string;
    notification: {
      signupSuccess: string;
    };
  };
  forgot: {
    head: {
      title: string;
    };
    title: string;
    description: string;
    messageSuccess: string;
    backSignin: string;
    notification: {
      forgotSuccess: string;
    };
  };
  reset: {
    head: {
      title: string;
    };
    form: {
      title: {
        newPassword: string;
      };
    };
    title: string;
    notification: {
      resetSuccess: string;
      linkWrong: string;
    };
  };
  joinWorkspace: {
    head: {
      title: string;
    };
    form: {
      title: {
        email: string;
      };
      error: {
        email: string;
        notFound: string;
      };
    };
    title: string;
    content: string;
    getStarted: string;
    confirmJoin: {
      title: string;
      content: string;
      submit: string;
    };
    notification: {
      success: string;
    };
  };
};
