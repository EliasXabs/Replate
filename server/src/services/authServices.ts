import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';

export type JWTSign = {
  sub: string;
  iat: number;
  exp: number;
  auth_time: number;
  iss: string;
  role: string;
};

export type OutputType<T> = { success: true; data: T } | { success: false; error: unknown };

export const verifyJWT = (token: string): OutputType<JWTSign> => {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret as jwt.Secret) as JWTSign;
    return { success: true, data: decoded };
  } catch (error: any) {
    return { success: false, error };
  }
};

export const generateJWT = (
  sub: string,
  payload?: Partial<JWTSign>
): string => {
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload: JWTSign = {
    sub,
    iat: now,
    exp: now + 24 * 60 * 60, // 24 hours expiration
    auth_time: now,
    iss: 'https://auth.example.com', // Adjust issuer as needed
    role: payload?.role ?? 'customer',
    // Spread any additional fields from payload.
    ...payload,
  };

  // Sign the token using our secret. Since we include exp manually,
  // we don't need to pass expiresIn in the options.
  return jwt.sign(jwtPayload, jwtConfig.secret as jwt.Secret);
};
