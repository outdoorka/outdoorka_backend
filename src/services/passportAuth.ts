import { config } from '../config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const scheme = config.APP_URL.includes('localhost') ? 'http' : 'https';

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_LOGIN_CLIENT_ID,
        clientSecret: config.GOOGLE_LOGIN_CLIENT_SECRET,
        callbackURL: `${scheme}://${config.APP_URL}/api/v1/auth/google/callback`
      },
      async (accessToken, refreshToken, profile, cb) => {
        const user = {
          id: profile.id || '',
          name: profile.displayName || '',
          email: profile.emails?.[0]?.value ?? '',
          photo: profile.photos?.[0]?.value ?? '',
          provider: 'google'
        };
        cb(null, user);
      }
    )
  );
};

export default configurePassport;
