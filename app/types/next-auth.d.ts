import "next-auth";
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      role: string;
      firstName: string;
      lastName: string;
      factoryId?: string | null | undefined;
      companyId?: string | null | undefined;
      imageUrl?: string | null | undefined;
      position?: IUsersPositionListTable | null | undefined;
    };
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    expires: string;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    email?: string;
    name?: string;
    image?: string;
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    is_remembered?: boolean;
    factoryId?: string;
    companyId?: string;
    imageUrl?: string;
    position?: IUsersPositionListTable;
  }

  /**
   * Used to augment the AuthOptions interface
   */
  interface AuthOptions {
    providers: Array<any>;
    secret?: string;
    session: {
      strategy: "jwt";
    };
    callbacks?: {
      jwt?: (params: { token: JWT; user?: User }) => Promise<JWT>;
      session?: (params: { session: Session; token: JWT }) => Promise<Session>;
    };
    pages?: {
      signIn?: string;
      signOut?: string;
      error?: string;
    };
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT {
    id: string;
    email?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    keepMeSignedIn?: boolean;
    exp?: number;
    error?: string;
    factoryId?: string;
    companyId?: string;
    imageUrl?: string;
    position?: IUsersPositionListTable;
  }
}
