import { useState, useEffect } from "react";

export const useForm = (callback, validate) => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting, callback]);

  useEffect(() => {
    setErrors(validate(inputs));
  }, [inputs, validate]);

  const handleSubmit = () => {
    setErrors(validate(inputs));
    setIsSubmitting(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    event.persist();
    setInputs((inputs) => ({ ...inputs, [name]: { touched: true, value } }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    event.persist();
    if (inputs[name] === undefined) {
      setInputs((inputs) => ({ ...inputs, [name]: { touched: true, value } }));
    }
  };

  return {
    setInputs,
    handleInputChange,
    handleBlur,
    handleSubmit,
    inputs,
    errors,
    isSubmitting,
  };
};
