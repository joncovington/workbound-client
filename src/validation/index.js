export const validate = (inputs) => {
    const errors = {};
    
    if (inputs.email !== undefined) {
        if (!inputs.email.value) {

            errors["email"] = "Please enter your email Address.";

        }

        if (typeof inputs["email"] !== "undefined") {

            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

            if (!pattern.test(inputs["email"].value)) {
            errors["email"] = "Please enter valid email address.";

            } else {
                delete errors['email']
            }

        }
    }

    if (inputs.password !== undefined){
        if(!inputs.password.value && inputs.password.touched) {
            errors.password = 'Password is required'
        } else {
            if(errors.password) delete errors['password']
        }
    }

    return errors;
}