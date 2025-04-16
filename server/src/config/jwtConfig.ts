interface JwtConfig {
    secret: string;
    expiresIn: string | number;
  }
  
  const jwtConfig: JwtConfig = {
    secret: process.env.JWT_SECRET as string,
    expiresIn: '1h',
  };
  
  export default jwtConfig;
  