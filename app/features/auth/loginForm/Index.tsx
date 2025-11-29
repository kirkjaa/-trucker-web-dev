import Local from "./components/Local";
import LoginForm from "./components/LoginForm";

export default function LoginRender() {
  return (
    <div className="flex w-full">
      <span className="w-[80%]"></span>
      <div className="w-[50%]">
        <Local />
        <LoginForm />
      </div>
    </div>
  );
}
