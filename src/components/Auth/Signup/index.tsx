import Link from "next/link";
import SignupWithPassword from "../SignupWithPassword";

export default function Signup() {
  return (
    <>
    

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Signup with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SignupWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
