import { SignUp } from "@clerk/nextjs";

const SigninBtn = () => (
    <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
);

export default SigninBtn