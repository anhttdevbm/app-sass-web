import { useForm, useFormContext } from "react-hook-form";
import { get } from "lodash";
import React, { useState } from "react";
import { bool } from "yup";
import { fi } from "date-fns/locale";

interface IProps {
  isScrollView: boolean;
  setScrollView: (value: boolean) => void;
  scrollErrorField: (name: string) => void;
}

export const scrollViewContext = React.createContext<IProps>({} as IProps);

export const ScrollViewProvider = ({ children }) => {
  const [isScrollView, setScrollView] = useState(false);
  const {
    formState: { errors },
  } = useForm();

  const scrollErrorField = (name) => {
    if (errors && get(errors, `${name}`)) {
      let fieldName = "sectionsList";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list = errors.sectionsList as any;
      list
        .find((item, index) => {
          if (item) {
            fieldName += `.${index}`;
            return true;
          }
        })
        .service.find((item, index) => {
          if (item) {
            fieldName += `.service.${index}`;
            return true;
          }
        });
      fieldName += `.${name.split(".")[4]}`;

      document.querySelector(`input[name="${fieldName}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <scrollViewContext.Provider
      value={{ isScrollView, setScrollView, scrollErrorField }}
    >
      {children}
    </scrollViewContext.Provider>
  );
};

// const useScrollErrorField = () => {
//   const {
//     formState: { errors },
//   } = useFormContext();

//   const scrollErrorField = (name) => {
//     if (get(errors, `${name}`)) {
//       const fieldName = errors.sectionsList;
//       document.querySelector(`input[name="${name}"]`)?.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//     }
//   };

//   return { scrollErrorField };
// };

// export default useScrollErrorField;
