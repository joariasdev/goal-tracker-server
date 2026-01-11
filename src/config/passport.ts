import passport from 'passport';
import db from './db';
import PostgreUserRepository from '../repositories/PostgreUserRepository';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { env } from './env';

const configPassport = (passport: passport.PassportStatic) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET,
  };

  const userRepo = new PostgreUserRepository(db);

  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const id = jwt_payload.id;

        const user = userRepo.findById(id);

        if (!user)
          return done(null, false, { message: 'User does not exist.' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );
};

export default configPassport;
