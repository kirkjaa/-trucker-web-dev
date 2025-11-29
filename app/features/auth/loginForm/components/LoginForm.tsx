"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/app/components/ui/toast/use-toast";
import { Icons } from "@/app/icons";
import { login } from "@/app/services/authAction/loginAction";
import { userApi } from "@/app/services/user/userApi";
import { useGlobalStore } from "@/app/store/globalStore";
import { useUserStore } from "@/app/store/user/userStore";
import { EHttpStatusCode, ERoles } from "@/app/types/enum";
import { EOrganizationType } from "@/app/types/organization/organizationEnum";
import { IUser } from "@/app/types/user/userType";
import {
  LoginFormInputs,
  LoginFormSchema,
} from "@/app/utils/validate/auth-validate";
import loginPageLogo from "@/public/images/login-page-logo.png";

export default function LoginForm() {
  // Global State
  const { setLoading } = useGlobalStore();
  const setUser = useUserStore((state) => state.setUser);

  // Local State
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  // Hooks
  const { toast } = useToast();
  const router = useRouter();
  const {
    reset,
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      is_remembered: false,
    },
  });

  // Function
  const handleToggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      const result = await login(data);

      if (result.success) {
        const userMeRes = await userApi.getUserMe();
        if (userMeRes.statusCode === EHttpStatusCode.SUCCESS) {
          const user: Partial<IUser> = {
            id: userMeRes.data.id,
            first_name: userMeRes.data.first_name,
            last_name: userMeRes.data.last_name,
            email: userMeRes.data.email,
            role: userMeRes.data.role
              ? {
                  id: userMeRes.data.role.id,
                  role_code: userMeRes.data.role.role_code,
                  name_th: userMeRes.data.role.name_th,
                  name_en: userMeRes.data.role.name_en,
                }
              : undefined,
            organization: userMeRes.data.organization
              ? {
                  id: userMeRes.data.organization.id,
                  display_code: userMeRes.data.organization.display_code,
                  name: userMeRes.data.organization.name,
                  dial_code: userMeRes.data.organization.dial_code,
                  phone: userMeRes.data.organization.phone,
                  email: userMeRes.data.organization.email,
                  image_url: userMeRes.data.organization.image_url,
                  image_logo_url: userMeRes.data.organization.image_logo_url,
                  type: userMeRes.data.organization.type,
                  signature: userMeRes.data.organization.signature,
                  addresses: userMeRes.data.organization.addresses,
                }
              : undefined,
            position: userMeRes.data.position
              ? {
                  id: userMeRes.data.position.id,
                  code: userMeRes.data.position.code,
                  name_th: userMeRes.data.position.name_th,
                  name_en: userMeRes.data.position.name_en,
                  is_active: userMeRes.data.position.is_active,
                  is_dashboard: userMeRes.data.position.is_dashboard,
                  is_user: userMeRes.data.position.is_user,
                  is_chat: userMeRes.data.position.is_chat,
                  is_quotation: userMeRes.data.position.is_quotation,
                  is_order: userMeRes.data.position.is_order,
                  is_truck: userMeRes.data.position.is_truck,
                  is_package: userMeRes.data.position.is_package,
                  is_profile: userMeRes.data.position.is_profile,
                }
              : undefined,
          };

          setUser(user);

          toast({
            icon: "ToastSuccess",
            variant: "success",
            description: result.message,
          });

          const role = userMeRes.data.role.role_code;
          const type = userMeRes.data.organization?.type?.type_code;

          if (role === ERoles.ADMIN) {
            router.push("/admin/factories");
          } else if (
            role === ERoles.ORGANIZATION &&
            type === EOrganizationType.FACTORY
          ) {
            router.push("/factory/list-of-rfq");
          } else if (
            role === ERoles.ORGANIZATION &&
            type === EOrganizationType.COMPANY
          ) {
            router.push("/company/quotation-factory");
          }
        }
      } else {
        toast({
          icon: "ToastError",
          description: "Email or password invalid please try again",
          variant: "error",
        });
      }

      reset();
    } catch (error) {
      toast({
        icon: "Error",
        description: "Login fail please try again",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col w-full h-screen items-center justify-center 01:mr-18 02:mr-56 lg:mr-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-end justify-center gap-36">
        <div className="flex flex-col items-center gap-10">
          {/* Logo */}
          <Image src={loginPageLogo} alt="loginPageLogo" priority />
          <div className="flex gap-1 items-center">
            <Icons name="LoginIcon" className="w-20 h-20" />
            <div>
              <h5 className="text-login-01">ลงชื่อเข้าใช้งาน</h5>
              <p className="body1">ยินดีต้อนรับเข้าสู่ระบบ The Trucker</p>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4 shadow-login-form rounded-3xl p-14">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <p className="body1">ชื่อผู้ใช้งาน หรือ เบอร์โทรศัพท์</p>
                  <p className="body1 text-urgent-fail-02">*</p>
                </div>
                <Input
                  type="email"
                  className={clsx("w-96", {
                    "border-red-500": errors.username,
                  })}
                  placeholder="กรุณากรอกข้อมูล"
                  label="EMAIL"
                  rounded="3xl"
                  FrontIcon={<Icons name="Profile" className="w-5" />}
                  {...register("username")}
                />
                {errors.username && (
                  <div className="flex gap-2 items-center">
                    <Icons name="ErrorLogin" className="w-4 h-4" />
                    <p className="text-sm text-red-500 text-start pt-1">
                      {errors.username.message}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <p className="body1">รหัสผ่าน</p>
                  <p className="body1 text-urgent-fail-02">*</p>
                </div>
                <Input
                  type={isShowPassword ? "text" : "password"}
                  className={clsx("w-96", {
                    "border-red-500": errors.password,
                  })}
                  rounded="3xl"
                  placeholder="กรุณากรอกรหัสผ่าน"
                  FrontIcon={<Icons name="Lock" className="w-5" />}
                  BackIcon={
                    isShowPassword ? (
                      <Icons name="ShowPassword" className="w-5" />
                    ) : (
                      <Icons name="HidePassword" className="w-5" />
                    )
                  }
                  onIconClick={handleToggleShowPassword}
                  {...register("password")}
                />
                {errors.password && (
                  <div className="flex gap-2 items-center">
                    <Icons name="ErrorLogin" className="w-4 h-4" />
                    <p className="text-sm text-red-500 text-start pt-1">
                      {errors.password.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Remember&Forgot Password */}
              <div className="flex gap-2 items-center">
                <Checkbox
                  className="bg-white"
                  onCheckedChange={(checked) =>
                    setValue("is_remembered", checked === true)
                  }
                />
                <p className="body2">ให้ฉันอยู่ในระบบต่อไป</p>
              </div>
            </div>
            {/* Button */}
            <Button className="w-96 bg-gradient-04 relative">
              <p className="text-xl font-normal leading-5">ลงชื่อเข้าใช้งาน</p>
              <Icons name="ChevronRight" className="w-5 absolute right-5" />
            </Button>
          </div>
          <p className="bg-neutral-50/40 px-7 py-2 rounded-3xl text-center body1 mt-20">
            Copyright © By Ssllogistics Company Limited{" "}
          </p>
        </div>
      </div>
    </form>
  );
}
